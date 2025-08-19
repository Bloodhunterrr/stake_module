import ChangePasswordForm from "@/components/profile/v2/change-password-form";

const ChangePasswordPage = () => {
  return (
    <div className="bg-white">
      <div className="container m-0 mx-auto flex w-full min-h-screen flex-col gap-2 px-5 p-10 text-[12px]">
        <div className="text-lg font-medium text-accent-foreground">
          Change Password
        </div>
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePasswordPage;
