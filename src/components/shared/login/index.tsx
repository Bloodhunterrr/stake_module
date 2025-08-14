

import Envelope  from "@/assets/icons/envelope.svg?react"
import Locker  from "@/assets/icons/locker.svg?react"
import EyeOpen  from "@/assets/icons/eye.svg?react"
import EyeClosed  from "@/assets/icons/eye-hiden.svg?react"
import { useState, useEffect, useCallback } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useLoginMutation } from "@/services/authApi";
import type { LoginRequest } from "@/types/auth";
import { toast } from "react-toastify";

const Login = () => {
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [showPass, setShowPass] = useState<boolean>(false);
    const [login, { isLoading }] = useLoginMutation();

    const {
        register,
        handleSubmit,
        setError,
        getValues,
        formState: { errors, isDirty },
    } = useForm<LoginRequest>({
        mode: "onChange",
    });

    const clearErrorsOnInput = useCallback(() => {
        setGeneralError(null);
        if (errors.email) setError('email', { type: '' });
        if (errors.password) setError('password', { type: '' });
    }, [errors.email, errors.password, setError]);

    useEffect(() => {
        if (isDirty) {
            setGeneralError(null);
            clearErrorsOnInput()
        }
    }, [isDirty, clearErrorsOnInput]);



    const onSubmit: SubmitHandler<LoginRequest> = async (data) => {
        try {
            await login(data).unwrap();
        } catch (err: any) {
            if (err?.status === 401 || err?.data?.message === 'Invalid credentials') {
                setError('email', {
                    type: 'manual',
                    message: ({ id: "Invalid email or password" }),
                });
                setError('password', {
                    type: 'manual',
                    message: ({ id: "Invalid email or password" }),
                });
                return
            }

            if (err?.status === 404 && err?.data?.message === 'User not found') {
                setError('email', {
                    type: 'manual',
                    message: ({ id: "User not found" }),
                });
                return;
            }
            const errorMessage = ({ id: "An unexpected error occurred" });
            setGeneralError(errorMessage);
            toast.error(errorMessage);
        }
    };

    const isFieldValid = (fieldName: keyof LoginRequest) => {
        const value = getValues(fieldName);
        return isDirty && !errors[fieldName] && Boolean(value);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="AuthContainer_content_dDdZq"
        >
            <h3
                className="m-text Header-Semi-Bold-M"
                data-qa="login_title"
                style={{  marginBottom: '20px' }}
            >
                <div>Welcome back</div>
            </h3>

            <div className="common-module_field_etXUF">
                <div
                    className={`m-form-field m-form-field--apply ${!generalError && isFieldValid('email') ? 'm-form-field--success' : ''} ${errors.email || generalError ? 'm-form-field--error' : ''
                        }`}
                >
                    <div>
                        <div className="m-input m-gradient-border m-input--dark m-input--m">
                            <div className="m-icon-container m-input-prepend">
                                <Envelope />
                            </div>
                            <div className="m-input-content">
                                <input
                                    autoComplete="email"
                                    {...register("email", {
                                        required: ({ id: "Email is required" }),
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: ({ id: "Invalid email address" }),
                                        },
                                    })}
                                    aria-invalid={errors.email ? "true" : "false"}
                                />
                                <div className="m-input-content-label">
                                    <div>Enter your email</div>
                                </div>
                            </div>
                        </div>
                        {errors.email && (
                            <div
                                className="m-form-field-description"
                                style={{ color: "var(--color-field-basic-description-error)" }}
                            >
                                {errors.email.message}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="common-module_field_etXUF">
                <div
                    className={`m-form-field m-form-field--apply  ${!generalError && isFieldValid('password') ? 'm-form-field--success' : ''} ${errors.password || generalError ? 'm-form-field--error' : ''}`}
                >
                    <div className="m-input m-gradient-border m-input--dark m-input--m">
                        <div className="m-icon-container m-input-prepend">
                            <Locker />
                        </div>
                        <div className="m-input-content">
                            <input
                                type={showPass ? "text" : "password"}
                                autoComplete="current-password"
                                {...register("password", {
                                    required: ({ id: "Password is required" }),
                                    minLength: {
                                        value: 6,
                                        message: ({ id: "Password must be at least 6 characters" }),
                                    },
                                })}
                                aria-invalid={errors.password ? "true" : "false"}
                            />
                            <div className="m-input-content-label">
                                <div>Enter your password</div>
                            </div>
                        </div>
                        <div className="m-icon-container m-input-append">
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                aria-label={showPass ? "Hide password" : "Show password"}
                            >
                                {showPass ? <EyeOpen /> : <EyeClosed />}
                            </button>
                        </div>
                    </div>
                    {errors.password && (
                        <div
                            className="m-form-field-description"
                            style={{ color: "var(--color-field-basic-description-error)" }}
                        >
                            {errors.password.message}
                        </div>
                    )}
                </div>
            </div>

            {generalError && (
                <div
                    className="m-form-field-description"
                    style={{ color: "var(--color-field-basic-description-error)", marginBottom: '20px' }}
                    role="alert"
                >
                    {generalError}
                </div>
            )}

            <div className="common-module_actionsBlock_HQxPC">
                <button
                    className="m-button m-gradient-border m-button--primary m-button--m"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? <div>Logging in...</div> : <div>Login</div>}
                </button>
            </div>
        </form>
    );
};

export default Login;