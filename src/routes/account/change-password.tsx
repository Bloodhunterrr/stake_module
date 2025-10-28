import { Trans } from "@lingui/react/macro";
import ChangePasswordForm from "@/components/profile/v2/change-password-form";

const ChangePasswordPage = () => {
  return (
    <div className="bg-[var(--grey-700)] text-white">
      <div className="container m-0 mx-auto flex w-full min-h-screen flex-col gap-2 px-5 p-10 text-[12px]">
        <div className="text-lg font-medium">
            <Trans>Change Password</Trans>
        </div>
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePasswordPage;
