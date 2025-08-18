import Wallet from "@/components/profile/wallet";

const WalletPage = () => {
  return (
    <div className="container m-0 mx-auto flex w-full min-h-screen  bg-white flex-col gap-2 px-5 p-10 text-[12px]">
      <div className="text-lg font-medium text-accent-foreground">
       Wallet
      </div>
      <Wallet />
    </div>
  );
};

export default WalletPage;
