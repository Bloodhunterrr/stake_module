
import EyeOpen  from "@/assets/icons/eye.svg?react"
import EyeClosed  from "@/assets/icons/eye-hiden.svg?react"
import { useState, useCallback, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useChangePasswordMutation } from "@/services/authApi";
import { toast } from "react-toastify";
import './Security.css'

interface ChangePasswordFormData {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
}

const ChangePassword = () => {
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [showCurrentPass, setShowCurrentPass] = useState<boolean>(false);
    const [showNewPass, setShowNewPass] = useState<boolean>(false);
    const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);

    const [changePassword, { isLoading }] = useChangePasswordMutation();

    const {
        register,
        handleSubmit,
        setError,
        getValues,
        reset,
        formState: { errors, isDirty },
    } = useForm<ChangePasswordFormData>({
        mode: "onChange",
    });

    const clearErrorsOnInput = useCallback(() => {
        setGeneralError(null);
        if (errors.current_password) setError('current_password', { type: '' });
        if (errors.new_password) setError('new_password', { type: '' });
        if (errors.new_password_confirmation) setError('new_password_confirmation', { type: '' });
    }, [errors, setError]);

    useEffect(() => {
        if (isDirty) {
            clearErrorsOnInput();
        }
    }, [isDirty, clearErrorsOnInput]);

    const onSubmit: SubmitHandler<ChangePasswordFormData> = async (data) => {
        try {
            await changePassword(data).unwrap();
            toast.success(({ id: "Password changed successfully" }));
            Object.keys(data).forEach((key) => {
                const k = key as keyof ChangePasswordFormData;
                getValues(k);
            });
        reset({
            current_password: '',
            new_password: '',
            new_password_confirmation: '',
        });
        } catch (err: any) {
            const errorMessage = err?.data?.message || ({ id: "An unexpected error occurred" });
            setGeneralError(errorMessage);
            toast.error(errorMessage);

            if (err?.data?.errors) {
                const fieldErrors = err.data.errors;
                if (fieldErrors.current_password) {
                    setError("current_password", {
                        type: "manual",
                        message: fieldErrors.current_password[0],
                    });
                }
                if (fieldErrors.new_password) {
                    setError("new_password", {
                        type: "manual",
                        message: fieldErrors.new_password[0],
                    });
                }
                if (fieldErrors.new_password_confirmation) {
                    setError("new_password_confirmation", {
                        type: "manual",
                        message: fieldErrors.new_password_confirmation[0],
                    });
                }
            }
        }
    };

    const isFieldValid = (fieldName: keyof ChangePasswordFormData) => {
        const value = getValues(fieldName);
        return isDirty && !errors[fieldName] && Boolean(value);
    };

    return (
        <div className="security-page-layout">
            <div className="password-change">
                <div className="PageSectionTitle">
                    <div className="PageSectionTitle-Content">
                        <p className="m-text m-fs18 m-fw600 m-lh140" style={{ color: "var(--color-light-grey-5)" }}>
                            <div>Password</div>
                        </p>
                        <div className="PageSectionTitle-Text">
                            <p className="m-text Body-Regular-S">
                                <div>Create an alphanumeric password that is easy for you to remember and hard for others to guess.</div>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="password-change__form password-change__form--border">
                    <form className="PasswordChangeForm" onSubmit={handleSubmit(onSubmit)}>
                        {generalError && (
                            <div
                                className="m-form-field-description"
                                style={{ color: "var(--color-field-basic-description-error)", marginBottom: '20px' }}
                                role="alert"
                            >
                                {generalError}
                            </div>
                        )}

                        <div className="m-form-field">
                            <div
                                className={`m-input m-gradient-border m-input--basic m-input--m ${!generalError && isFieldValid('current_password') ? 'm-form-field--success' : ''} ${errors.current_password || generalError ? 'm-form-field--error' : ''
                                    }`}
                                tabIndex={0}
                            >
                                <div className="m-input-content">
                                    <input
                                        data-qa="input-current-password"
                                        id="current_password"
                                        autoComplete="current-password"
                                        type={showCurrentPass ? "text" : "password"}
                                        {...register("current_password", {
                                            required: ({ id: "Current password is required" }),
                                            minLength: {
                                                value: 6,
                                                message: ({ id: "Password must be at least 6 characters" }),
                                            },
                                        })}
                                    />
                                    <div className="m-input-content-label"><div>Old password</div></div>
                                </div>
                                <div className="m-icon-container m-input-append">
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                                        aria-label={showCurrentPass ? "Hide password" : "Show password"}
                                    >
                                        {showCurrentPass ? <EyeOpen /> : <EyeClosed />}
                                    </button>
                                </div>
                            </div>
                            {errors.current_password && (
                                <div
                                    className="m-form-field-description"
                                    style={{ color: "var(--color-field-basic-description-error)" }}
                                >
                                    {errors.current_password.message}
                                </div>
                            )}
                        </div>

                        <div className="m-form-field">
                            <div
                                className={`m-input m-gradient-border m-input--basic m-input--m ${!generalError && isFieldValid('new_password') ? 'm-form-field--success' : ''} ${errors.new_password || generalError ? 'm-form-field--error' : ''
                                    }`}
                                tabIndex={0}
                            >
                                <div className="m-input-content">
                                    <input
                                        data-qa="input-new-password"
                                        id="new_password"
                                        autoComplete="new-password"
                                        type={showNewPass ? "text" : "password"}
                                        {...register("new_password", {
                                            required: ({ id: "New password is required" }),
                                            minLength: {
                                                value: 8,
                                                message: ({ id: "Password must be at least 8 characters" }),
                                            },
                                        })}
                                    />
                                    <div className="m-input-content-label"><div>New password</div></div>
                                </div>
                                <div className="m-icon-container m-input-append">
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPass(!showNewPass)}
                                        aria-label={showNewPass ? "Hide password" : "Show password"}
                                    >
                                        {showNewPass ? <EyeOpen /> : <EyeClosed />}
                                    </button>
                                </div>
                            </div>
                            {errors.new_password && (
                                <div
                                    className="m-form-field-description"
                                    style={{ color: "var(--color-field-basic-description-error)" }}
                                >
                                    {errors.new_password.message}
                                </div>
                            )}
                        </div>

                        <div className="m-form-field">
                            <div
                                className={`m-input m-gradient-border m-input--basic m-input--m ${!generalError && isFieldValid('new_password_confirmation') ? 'm-form-field--success' : ''} ${errors.new_password_confirmation || generalError ? 'm-form-field--error' : ''
                                    }`}
                                tabIndex={0}
                            >
                                <div className="m-input-content">
                                    <input
                                        data-qa="input-confirm-password"
                                        id="new_password_confirmation"
                                        autoComplete="new-password"
                                        type={showConfirmPass ? "text" : "password"}
                                        {...register("new_password_confirmation", {
                                            required: ({ id: "Please confirm your new password" }),
                                            validate: (value) =>
                                                value === getValues("new_password") ||
                                                ({ id: "Passwords do not match" }),
                                        })}
                                    />
                                    <div className="m-input-content-label"><div>Confirm password</div></div>
                                </div>
                                <div className="m-icon-container m-input-append">
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                                        aria-label={showConfirmPass ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmPass ? <EyeOpen /> : <EyeClosed />}
                                    </button>
                                </div>
                            </div>
                            {errors.new_password_confirmation && (
                                <div
                                    className="m-form-field-description"
                                    style={{ color: "var(--color-field-basic-description-error)" }}
                                >
                                    {errors.new_password_confirmation.message}
                                </div>
                            )}
                        </div>

                        <div className="PasswordChangeForm-Btns">
                            <button
                                className="m-button m-gradient-border m-button--primary m-button--m PasswordChangeForm-Btn"
                                type="submit"
                                disabled={isLoading}
                            >
                                <div className="m-button-content">
                                    {isLoading ? <div>Saving...</div> : <div>Save</div>}
                                </div>
                            </button>
                            <button
                                className="m-button m-gradient-border m-button--secondary m-button--m PasswordChangeForm-Btn"
                                type="button"
                                onClick={() => {
                                    Object.keys(getValues()).forEach((key) => {
                                        const k = key as keyof ChangePasswordFormData;
                                        getValues(k);
                                    });
                                    setGeneralError(null);
                                }}
                            >
                                <div className="m-button-content"><div>Cancel</div></div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;