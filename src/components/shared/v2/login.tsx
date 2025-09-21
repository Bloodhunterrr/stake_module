import { z } from 'zod';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { zodResolver } from '@hookform/resolvers/zod';
import {Trans, useLingui} from "@lingui/react/macro";
import { useLoginMutation } from '@/services/authApi.ts';
import { Card, CardContent } from '@/components/ui/card.tsx';

const loginSchema = z.object({
    email: z
        .string(),
        // .min(1, {message: 'Email is required.'})
        // .email({message: 'Please enter a valid email address.'}),
    password: z
        .string()
        .min(1, {message: 'Password is required.'})
        .min(6, {message: 'Password must be at least 6 characters long.'}),
});


type LoginFormValues = z.infer<typeof loginSchema>;


export default function Login({setLoginModalOpen}: {setLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
    const [showPass, setShowPass] = useState(false);
    const [login, {isLoading}] = useLoginMutation();

    const {
        register,
        handleSubmit,
        setError,
        formState: {errors},
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const { t } = useLingui();

    const onSubmit = async (data: LoginFormValues) => {
        try {
            await login(data).unwrap();
            setLoginModalOpen(false);
        } catch (err: unknown) {
            handleLoginError(err);
            setLoginModalOpen(false);
        }
    };

    const handleLoginError = (err: unknown) => {
        const error = err as { data?: { message?: string }; status?: number };
        const errorMsg = error?.data?.message || 'An unexpected error occurred.';
        toast.error(errorMsg);

        if (error?.status === 401 || errorMsg === 'Invalid credentials') {
            setError('password', {
                type: 'manual',
                message: 'Invalid email or password.',
            });
        } else if (error?.status === 404 && errorMsg === 'User not found') {
            setError('email', {
                type: 'manual',
                message: 'User with this email/username not found.',
            });
        }
    };

    return (
        <div className="flex justify-center items-center h-full overflow-auto">
            <Card className="w-full max-w-md border-none bg-secondary shadow-none">
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                        <div className="grid gap-2">

                            <div className="relative">
                                <Input
                                    id={'email'}
                                    type={'text'}
                                    placeholder={t`Enter your email/username`}
                                    className="placeholder:text-xs text-xs h-12 bg-primary-foreground border-background/50 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-1 focus-visible:border-chart-2"
                                    {...register('email')}
                                    autoFocus={false}
                                />
                            </div>
                            {errors["email"] && (
                                <p className="text-sm font-medium text-destructive">
                                    {errors["email"]?.message}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPass ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    placeholder={t`Password`}
                                    className="placeholder:text-xs  bg-primary-foreground text-xs pr-10 h-12 border-background/50 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-1 focus-visible:border-chart-2"
                                    {...register('password')}
                                    autoFocus={false}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    aria-label={showPass ? 'Hide password' : 'Show password'}
                                    className="absolute inset-y-0 right-0  flex items-center pr-3"
                                >
                                    {showPass ? (
                                        <Eye className="h-4 w-4 text-muted-foreground"/>
                                    ) : (
                                        <EyeOff className="h-4 w-4 text-muted-foreground"/>
                                    )}
                                </button>
                                {errors.password && (
                                    <p className="text-sm font-medium text-destructive mt-2">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <Button type="submit" className="w-full mt-2 bg-chart-2 focus-visible:ring-none focus-visible:ring-offset-none focus-visible:border-none h-12  hover:bg-chart-2 text-primary-foreground text-base hover:text-primary-foreground rounded-none " disabled={isLoading}>
                            {isLoading ? t`Logging in...` : t`Log In`}
                        </Button>
                    </form>
                    <div className={'pt-4  text-xs text-green-900 flex items-center justify-between'}>
                        <p><Trans>Join Now</Trans></p>
                        <p className="text-right"><Trans>Have trouble logging in?</Trans></p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
