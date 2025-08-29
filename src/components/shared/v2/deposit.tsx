import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Support from "@/assets/icons/support.svg?react";
import { useAppSelector } from "@/hooks/rtk.ts";
import type { User, Wallet } from "@/types/auth.ts";
import { currencyList } from "@/utils/currencyList.ts";
import { useCreateDepositMutation } from "@/services/authApi.ts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { cn } from "@/lib/utils.ts";
import { Trans, useLingui } from "@lingui/react/macro";

type DepositProps = {
  isOpen: boolean;
  onClose: () => void;
  wallet: Wallet;
};

type ChipsProps = {
  selectedWallet: Wallet | null;
  handleChipClick: (value: string) => void;
};

const DepositChips = ({ selectedWallet, handleChipClick }: ChipsProps) => {
  const [suggested, setSuggested] = useState<number[]>([]);
  const selectedSymbol = selectedWallet
    ? currencyList[selectedWallet.slug.toUpperCase()]?.symbol_native || "?"
    : "";

  useEffect(() => {
    if (!selectedWallet) {
      setSuggested([]);
      return;
    }

    const { min_deposit, max_deposit } = selectedWallet.limits || {
      min_deposit: 0,
      max_deposit: 0,
    };

    if (min_deposit === 0 || max_deposit === 0) {
      setSuggested([]);
      return;
    }

    const newSuggested: number[] = [];
    for (let i = 1; i <= 4; i++) {
      const value = min_deposit * i;
      if (value <= max_deposit) {
        newSuggested.push(value);
      } else {
        break;
      }
    }
    setSuggested(newSuggested);
  }, [selectedWallet]);

  if (suggested.every((el) => el === 0)) return null;

  return (
    <div className="flex flex-wrap gap-2 overflow-x-auto p-2">
      {suggested.map((chip) => (
        <button
          key={chip}
          onClick={() => handleChipClick(chip.toString())}
          className="flex-shrink-0 rounded-full bg-secondary px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary/80"
        >
          {chip.toLocaleString("en-EN")} {selectedSymbol}
        </button>
      ))}
    </div>
  );
};

const Deposit = ({ isOpen, onClose, wallet }: DepositProps) => {
  const user: User = useAppSelector((state) => state?.auth?.user);
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<Wallet>(wallet);

  const minDeposit = selectedWallet?.limits.min_deposit || 0;
  const maxDeposit = selectedWallet?.limits.max_deposit || 0;

  const [createDeposit, { isLoading }] = useCreateDepositMutation();

  const { t } = useLingui();

  useEffect(() => {
    setSelectedWallet(wallet);
    setAmount("");
    setError(null);
  }, [wallet, isOpen]);

  const handleChipClick = (value: string) => {
    setAmount(value);
  };

  const selectedSymbol =
    currencyList[selectedWallet.slug.toUpperCase()]?.symbol_native || "?";

  const handleSubmit = async () => {
    if (!selectedWallet) {
      setError(t`Please select a wallet`);
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (
      isNaN(parsedAmount) ||
      parsedAmount < minDeposit ||
      parsedAmount > maxDeposit
    ) {
      setError(
        `Please enter an amount between ${minDeposit} and ${maxDeposit} ${selectedWallet.slug.toUpperCase()}`
      );
      return;
    }

    try {
      const data = await createDeposit({
        price_amount: parsedAmount,
        currency: selectedWallet.slug.toUpperCase(),
      }).unwrap();

      toast.success(t`Deposit initiated successfully!`);
      onClose();
      window.location.href = data.invoice_url;
    } catch (error) {
      setError(`Failed to initiate deposit. Contact Support`);
      console.error("Deposit error:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white text-card-foreground shadow-lg border">
        <DialogHeader>
          <DialogTitle><Trans>Deposit</Trans></DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">
              {t`Amount`} ({minDeposit.toLocaleString("en-EN")} -{" "}
              {maxDeposit.toLocaleString("en-EN")}) {selectedSymbol}
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="amount"
                type="number"
                min={minDeposit}
                max={maxDeposit}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={cn(
                  "bg-white text-foreground",
                  error && "border-destructive focus-visible:ring-destructive"
                )}/>
              <Select
                value={selectedWallet.slug}
                onValueChange={(value) => {
                  const newWallet = user.wallets?.find((w) => w.slug === value);
                  if (newWallet) setSelectedWallet(newWallet);
                }}>
                <SelectTrigger className="w-[120px] bg-white text-foreground border">
                  <SelectValue placeholder={t`Select a wallet`} />
                </SelectTrigger>
                <SelectContent>
                  {user.wallets?.map((w: Wallet) => (
                    <SelectItem key={w.id} value={w.slug}>
                      {w.slug.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
          </div>
          <DepositChips
            selectedWallet={selectedWallet}
            handleChipClick={handleChipClick}/>
        </div>
        <div className="flex flex-col gap-4">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-card hover:bg-card/70 text-accent-foreground">
            {isLoading ? t`Depositing...` : t`Deposit`}
          </Button>
          <div
            onClick={() => console.log("chat")}
            className="flex cursor-pointer items-center justify-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <Trans>Need Help?</Trans>
            <Support className="h-4 w-4"/>
            <Trans>Live Chat</Trans>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Deposit;
