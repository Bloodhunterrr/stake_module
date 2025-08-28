import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trans, useLingui } from "@lingui/react/macro";
import { useChangePasswordMutation } from "@/services/authApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const formSchema = z
  .object({
    current_password: z.string().min(6, {
      message: "Current password must be at least 6 characters.",
    }),
    new_password: z.string().min(8, {
      message: "New password must be at least 8 characters.",
    }),
    new_password_confirmation: z.string().min(8, {
      message: "Please confirm your new password.",
    }),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "Passwords do not match.",
    path: ["new_password_confirmation"],
  });

type ChangePasswordFormData = z.infer<typeof formSchema>;

interface ApiError {
  data?: {
    message: string;
    errors?: Record<string, string[]>;
  };
  status?: number;
}

export default function ChangePasswordForm() {
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePassword(data).unwrap();
      toast.success(t`Password changed successfully.`);
      form.reset();
    } catch (err: unknown) {
      const apiError = err as FetchBaseQueryError & ApiError;
      const errorMessage =
        apiError?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);

      if (apiError?.data?.errors) {
        Object.entries(apiError.data.errors).forEach(([field, messages]) => {
          form.setError(field as keyof ChangePasswordFormData, {
            type: "manual",
            message: Array.isArray(messages)
              ? messages[0]
              : "Validation error.",
          });
        });
      }
    }
  };

  const { t } = useLingui();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="current_password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showCurrentPass ? "text" : "password"}
                    className="h-10 rounded-[3px] focus-visible:border-b-card border-[#a7a7a7] ring-0 ring-offset-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-accent-foreground"
                    placeholder={t`Old Password`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute hover:bg-transparent right-0 top-0 h-full px-3 py-2 text-accent-foreground opacity-[0.7]"
                    onClick={() => setShowCurrentPass((prev) => !prev)}
                  >
                    {showCurrentPass ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showNewPass ? "text" : "password"}
                    className="h-10 rounded-[3px] focus-visible:border-b-card border-[#a7a7a7] ring-0 ring-offset-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-accent-foreground"
                    placeholder={t`New Password`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute hover:bg-transparent right-0 top-0 h-full px-3 py-2 text-accent-foreground opacity-[0.7]"
                    onClick={() => setShowNewPass((prev) => !prev)}
                  >
                    {showNewPass ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="new_password_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showConfirmPass ? "text" : "password"}
                    className="h-10 rounded-[3px] focus-visible:border-b-card border-[#a7a7a7] ring-0 ring-offset-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-accent-foreground"
                    placeholder={t`Confirm New Password`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute hover:bg-transparent right-0 top-0 h-full px-3 py-2 text-accent-foreground opacity-[0.6]"
                    onClick={() => setShowConfirmPass((prev) => !prev)}>
                    {showConfirmPass ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}/>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-card h-10 rounded-[3px] hover:bg-card/70  text-accent-foreground"
        >
          <Trans>Change Password</Trans>
        </Button>
      </form>
    </Form>
  );
}
