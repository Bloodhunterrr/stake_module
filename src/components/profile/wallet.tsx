import { useState } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "@/hooks/rtk";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { User, Wallet } from "@/types/auth";
import { InfoIcon, LockIcon } from "lucide-react";
import { currencyList } from "@/utils/currencyList";
import { Trans, useLingui } from "@lingui/react/macro";
import Deposit from "@/components/shared/v2/deposit.tsx";
import Withdraw from "@/components/shared/v2/withdraw.tsx";
import { useSetDefaultWalletMutation } from "@/services/authApi";
import CashBackIcon from "@/assets/icons/cashback-wallet.svg?react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Wallet() {
  const user: User = useAppSelector((state) => state?.auth?.user);
  const [setDefaultWallet] = useSetDefaultWalletMutation();

  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

  const handleOpenDeposit = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setIsDepositOpen(true);
  };

  const handleOpenWithdraw = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setIsWithdrawOpen(true);
  };

  const { t } = useLingui();

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {user.wallets?.map((w: Wallet) => (
          <Card key={w.slug} className="relative overflow-hidden bg-white py-0 pt-4">
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
              <Badge variant="secondary" className="text-sm font-semibold">
                {w.slug.toUpperCase()}
              </Badge>
              <Button
                variant={w.default ? "secondary" : "default"}
                size="sm"
                onClick={() => {
                  if (w.default) {
                    toast.warn(t`This wallet is already default`);
                    return;
                  }
                  setDefaultWallet({
                    currency: w.slug.toUpperCase(),
                  });
                }}>
                {w.default ? t`Default` : t`Set default`}
                <InfoIcon className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              <div className="mb-4">
                <CardDescription className="text-sm">
                  <Trans>Total balance</Trans>
                </CardDescription>
                <CardTitle className="text-3xl font-bold">
                  {(+w.balance / 100).toLocaleString("en-EN", {
                    minimumFractionDigits: w.decimal_places,
                    maximumFractionDigits: w.decimal_places,
                  })}{" "}
                  {currencyList[w.slug.toUpperCase()]?.symbol_native}
                </CardTitle>
              </div>
              <div className="flex space-x-2">
                <Button
                  className="flex-1 bg-gray-200"
                  variant="outline"
                  disabled={!w.limits.can_pay_with_now_payments}
                  onClick={() => handleOpenWithdraw(w)}>
                  <Trans>Withdraw</Trans>
                </Button>
                <Button
                  className="flex-1 bg-card hover:bg-card/70 text-accent-foreground"
                  disabled={!w.limits.can_pay_with_now_payments}
                  onClick={() => handleOpenDeposit(w)}>
                  <Trans>Deposit</Trans>
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t bg-gray-50 p-4">
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500"><Trans>Real money</Trans></span>
                <div className="mt-1 flex items-center">
                  <CashBackIcon className="mr-2 h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">
                    {(+w.balance / 100).toLocaleString("en-EN", {
                      minimumFractionDigits: w.decimal_places,
                      maximumFractionDigits: w.decimal_places,
                    })}
                    {currencyList[w.slug.toUpperCase()]?.symbol_native}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500"><Trans>Bonus money</Trans></span>
                <div className="mt-1 flex items-center">
                  <LockIcon className="mr-2 h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">0.00</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedWallet && (
        <>
          <Deposit isOpen={isDepositOpen}
            onClose={() => setIsDepositOpen(false)}
            wallet={selectedWallet}/>
          <Withdraw isOpen={isWithdrawOpen}
            onClose={() => setIsWithdrawOpen(false)}
            wallet={selectedWallet}
          />
        </>
      )}
    </>
  );
}
