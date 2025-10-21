import { z } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {Eye, EyeOff, XIcon} from 'lucide-react';
import logo from "@/assets/images/logo.svg";
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { zodResolver } from '@hookform/resolvers/zod';
import {Trans, useLingui} from "@lingui/react/macro";
import { useLoginMutation } from '@/services/authApi.ts';
import {Card, CardContent, CardHeader} from '@/components/ui/card.tsx';

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
            setLoginModalOpen(true);
        }
    };

    const handleLoginError = (err: unknown) => {
        const error = err as { data?: { message?: string }; status?: number };
        const errorMsg = error?.data?.message || 'An unexpected error occurred.';
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
        console.log(errorMsg)
    };

    return (
        <div className="flex justify-center items-center h-full w-full overflow-auto">
            <Card className="h-full w-full p-0 rounded-md bg-cover bg-center fixed flex flex-col bg-[var(--grey-700)] text-grey-200 border-transparent overflow-hidden">
                <CardContent className="h-full w-full flex flex-col overflow-y-auto px-0 pb-4">
                    <CardHeader className="h-15 w-full bg-[var(--grey-600)] shadow-[#0003_0_4px_6px_-1px,#0000001f_0_2px_4px_-1px] px-4 grid-cols-2 grid-rows-1">
                        <img src={logo} alt="logo" className="h-[16px] my-auto" />
                        <div className="h-full flex items-center justify-end">
                            <XIcon className="h-6 w-6 text-[var(--grey-200)] hover:text-white transition-all duration-300" />
                        </div>
                    </CardHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 px-4 pt-8">
                        <div className="grid gap-2">

                            <div className="relative">
                                <Input
                                    id={'email'}
                                    type={'text'}
                                    placeholder={t`Enter your email/username`}
                                    className="placeholder:text-transparent bg-primary-foreground pr-10 h-11 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-[color:var(--grey-300)]
                                               w-full text-[white] bg-[var(--grey-700)] border-[color:var(--grey-400)] hover:border-[color:var(--grey-300)] transition-all duration-[0.25s] cursor-text appearance-none
                                               font-normal text-lg shadow-none m-0 p-2 rounded-lg border-2 border-solid outline-none touch-auto dark:aria-invalid:border-3 dark:aria-invalid:border-destructive"
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
                                    className="placeholder:text-transparent bg-primary-foreground h-11 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-2 focus-visible:border-[color:var(--grey-300)]
                                               w-full text-[white] bg-[var(--grey-700)] border-[color:var(--grey-400)] hover:border-[color:var(--grey-300)] transition-all duration-[0.25s] cursor-text appearance-none
                                               font-normal text-lg shadow-none m-0 p-2 pr-10 rounded-lg border-2 border-solid outline-none touch-auto aria-invalid:border-3 aria-invalid:border-destructive"
                                    {...register('password')}
                                    autoFocus={false}/>

                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    aria-label={showPass ? 'Hide password' : 'Show password'}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 h-12">
                                    {showPass ? (
                                        <Eye className="h-5 w-5 text-[var(--grey-200)] hover:text-white transition-all duration-300" />
                                    ) : (
                                        <EyeOff className="h-5 w-5 text-[var(--grey-200)] hover:text-white transition-all duration-300" />
                                    )}
                                </button>
                                {errors.password && (
                                    <p className="text-sm font-medium text-destructive mt-2">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 rounded-lg mt-2 focus-visible:ring-none focus-visible:ring-offset-none focus-visible:border-none
                                                         h-12 text-primary-foreground text-base hover:text-primary-foreground" disabled={isLoading}>
                            {isLoading ? t`Signing in...` : t`Sign In`}
                        </Button>
                    </form>
                        <div className={'pt-4 px-4 text-md text-white font-semibold flex items-center justify-between mb-auto'}>
                            <p className="text-left"><Trans>Have trouble logging in?</Trans></p>
                        </div>
                        <div className={'pt-4 px-4 mt-auto text-md text-[var(--grey-200)] flex items-center justify-center'}>
                            Don’t have an account?
                            <p className="pl-1 font-semibold text-white"><Trans>Register an Account</Trans></p>
                        </div>
                </CardContent>
            </Card>
        </div>
    );
}
