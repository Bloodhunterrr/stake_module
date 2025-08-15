import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'react-toastify';
import {useChangePasswordMutation} from '@/services/authApi';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {Eye, EyeOff} from 'lucide-react';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import type {FetchBaseQueryError} from "@reduxjs/toolkit/query";

const formSchema = z
    .object({
        current_password: z.string().min(6, {
            message: 'Current password must be at least 6 characters.',
        }),
        new_password: z.string().min(8, {
            message: 'New password must be at least 8 characters.',
        }),
        new_password_confirmation: z.string().min(8, {
            message: 'Please confirm your new password.',
        }),
    })
    .refine((data) => data.new_password === data.new_password_confirmation, {
        message: 'Passwords do not match.',
        path: ['new_password_confirmation'],
    });

type ChangePasswordFormData = z.infer<typeof formSchema>;

interface ApiError {
    data?: {
        message: string;
        errors?: Record<string, string[]>;
    };
    status?: number;
}

export default function Security() {
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const [changePassword, {isLoading}] = useChangePasswordMutation();

    const form = useForm<ChangePasswordFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            current_password: '',
            new_password: '',
            new_password_confirmation: '',
        },
    });

    const onSubmit = async (data: ChangePasswordFormData) => {
        try {
            await changePassword(data).unwrap();
            toast.success('Password changed successfully.');
            form.reset();
        } catch (err: unknown) {
            const apiError = err as FetchBaseQueryError & ApiError;
            const errorMessage =
                apiError?.data?.message || 'An unexpected error occurred.';
            toast.error(errorMessage);

            if (apiError?.data?.errors) {
                Object.entries(apiError.data.errors).forEach(([field, messages]) => {
                    form.setError(field as keyof ChangePasswordFormData, {
                        type: 'manual',
                        message: Array.isArray(messages) ? messages[0] : 'Validation error.',
                    });
                });
            }
        }
    };

    return (
        <div className="flex justify-center p-6 sm:p-10">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                        Create an alphanumeric password that is easy for you to remember and
                        hard for others to guess.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Current Password Field */}
                            <FormField
                                control={form.control}
                                name="current_password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Old password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type={showCurrentPass ? 'text' : 'password'}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() =>
                                                        setShowCurrentPass((prev) => !prev)
                                                    }
                                                >
                                                    {showCurrentPass ? (
                                                        <EyeOff className="h-4 w-4"/>
                                                    ) : (
                                                        <Eye className="h-4 w-4"/>
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/* New Password Field */}
                            <FormField
                                control={form.control}
                                name="new_password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>New password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type={showNewPass ? 'text' : 'password'}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowNewPass((prev) => !prev)}
                                                >
                                                    {showNewPass ? (
                                                        <EyeOff className="h-4 w-4"/>
                                                    ) : (
                                                        <Eye className="h-4 w-4"/>
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/* Confirm Password Field */}
                            <FormField
                                control={form.control}
                                name="new_password_confirmation"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Confirm password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type={showConfirmPass ? 'text' : 'password'}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowConfirmPass((prev) => !prev)}
                                                >
                                                    {showConfirmPass ? (
                                                        <EyeOff className="h-4 w-4"/>
                                                    ) : (
                                                        <Eye className="h-4 w-4"/>
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => form.reset()}
                                    className="mt-2 sm:mt-0"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}