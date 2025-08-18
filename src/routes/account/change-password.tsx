import ChangePasswordForm from "@/components/shared/v2/profile/change-password-form";

const ChangePasswordPage = () => {
  return (
    <div className="m-0 mx-auto flex w-full min-h-screen  bg-white flex-col gap-2 px-5 p-10 text-[12px]">
      <div className="text-lg font-medium text-accent-foreground">
        Change Password
      </div>
      <ChangePasswordForm />
    </div>
  );
};

export default ChangePasswordPage;
