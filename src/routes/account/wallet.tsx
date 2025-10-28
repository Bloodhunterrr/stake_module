import { Trans } from "@lingui/react/macro";
import Wallet from "@/components/profile/wallet";

const WalletPage = () => {
  return (
    <div className="bg-[var(--grey-700)] text-white">
       <div className="container m-0 mx-auto flex w-full min-h-screen flex-col gap-2 px-5 p-10 text-[12px]">
      <div className="text-lg font-medium">
          <Trans>Wallet</Trans>
      </div>
      <Wallet />
    </div>
    </div>
   
  );
};

export default WalletPage;
