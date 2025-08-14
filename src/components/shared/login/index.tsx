import {z} from 'zod';
import {useState} from 'react';
import {toast} from 'react-toastify';
import {useForm} from 'react-hook-form';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {zodResolver} from '@hookform/resolvers/zod';
import {useLoginMutation} from '@/services/authApi';
import {Mail, Lock, Eye, EyeOff} from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

const loginSchema = z.object({
    email: z
        .string()
        .min(1, {message: 'Email is required.'})
        .email({message: 'Please enter a valid email address.'}),
    password: z
        .string()
        .min(1, {message: 'Password is required.'})
        .min(6, {message: 'Password must be at least 6 characters long.'}),
});

type LoginFormValues = z.infer<typeof loginSchema>;


export default function Login() {
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

    const onSubmit = async (data: LoginFormValues) => {
        try {
            await login(data).unwrap();
            toast.success('Login successful!');
        } catch (err: unknown) {
            handleLoginError(err);
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
                message: 'User with this email not found.',
            });
        }
    };

    return (
        <div className="flex justify-center items-center">
            <Card className="w-full max-w-md border-none shadow-none">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Welcome back
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                        <div className="grid gap-2">

                            <Label htmlFor={"email"}>Email</Label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                                <Input
                                    id={'email'}
                                    type={'text'}
                                    placeholder={"Enter your email"}
                                    className="pl-9"
                                    {...register('email')}
                                />
                            </div>
                            {errors["email"] && (
                                <p className="text-sm font-medium text-destructive">
                                    {errors["email"]?.message}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPass ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    className="pr-10 pl-9"
                                    {...register('password')}
                                />
                                <Lock
                                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    aria-label={showPass ? 'Hide password' : 'Show password'}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
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
                        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
