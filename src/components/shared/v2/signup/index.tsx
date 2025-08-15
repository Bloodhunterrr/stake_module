import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form.tsx";

import {z} from "zod";
import {useState} from "react";
import {toast} from "react-toastify";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {Mail, Lock, Eye, EyeOff} from "lucide-react";
import {useForm, type SubmitHandler} from "react-hook-form";

const formSchema = z.object({
    email: z.string().email({
        message: "Invalid email address.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    promoCode: z.string().optional(),
    newsOffers: z.boolean().default(false).optional(),
    partnerOffers: z.boolean().default(false).optional(),
});

type SignUpRequest = z.infer<typeof formSchema>;

export default function SignUp() {
    const [showPass, setShowPass] = useState<boolean>(false);

    const form = useForm<SignUpRequest>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            promoCode: "",
            newsOffers: false,
            partnerOffers: false,
        },
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<SignUpRequest> = async (data) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log("Sign-up data:", data);
            toast.info("You have successfully signed up.",);
        } catch (err) {
            console.error(err);
            toast.error("Uh oh! Something went wrong.",);
        }
    };

    return (
        <div className="flex justify-center items-center">
            <Card className="w-full max-w-md border-none shadow-none">
                <CardHeader>
                    <CardTitle className="text-2xl">Create your account</CardTitle>
                    <CardDescription>
                        Enter your details below to create an account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                                    size={20}/>
                                                <Input
                                                    placeholder="Enter your email"
                                                    {...field}
                                                    className="pl-10"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                                    size={20}/>
                                                <Input
                                                    type={showPass ? "text" : "password"}
                                                    placeholder="Enter your password"
                                                    {...field}
                                                    className="pl-10 pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPass(!showPass)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                                    aria-label={showPass ? "Hide password" : "Show password"}
                                                >
                                                    {showPass ? <EyeOff size={20}/> : <Eye size={20}/>}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="promoCode"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Promo Code (optional)</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                                    size={20}/>
                                                <Input
                                                    placeholder="Enter promo code"
                                                    {...field}
                                                    className="pl-10"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="newsOffers"
                                    render={({field}) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    I would like to receive news and offers.
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="partnerOffers"
                                    render={({field}) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    I agree to receive offers from our partners.
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={form.formState.isSubmitting}
                            >
                                Sign Up
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
