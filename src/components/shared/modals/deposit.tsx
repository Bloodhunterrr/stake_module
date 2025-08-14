;
import { useEffect, useState } from "react";
import type { User, Wallet } from "@/types/auth";
import { toast } from "react-toastify";
import Support  from "@/assets/icons/support.svg?react"
import ArrowDown  from "@/assets/icons/arrow-down.svg?react"
import Modal from "../modal";
import { useAppDispatch, useAppSelector } from "@/hooks/rtk";
import { setModal } from "@/slices/sharedSlice";
import './deposit.css'
import { currencyList } from "@/utils/currencyList";
import { useCreateDepositMutation } from "@/services/authApi";
import config from "@/config";

type ChipsProps = {
    selectedWallet: Wallet | null,
    handleChipClick: any, 
    selectedSymbol: string
}


const DepositChips = ({ selectedWallet, handleChipClick, selectedSymbol }: ChipsProps) => {
  const [suggested, setSuggested] = useState<number[]>([]);

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

  if(suggested.every(el => el === 0)) return null;

  return (
    <div className="AmountChips_root_LitMb hideScrollbar">
      {suggested.map((chip) => (
        <div
          key={chip}
          onClick={() => handleChipClick(chip.toString())}
          className="AmountChips_item_Q7vgn amount-chip--white-theme"
        >
          {chip.toLocaleString('en-EN')} {selectedSymbol}
        </div>
      ))}
    </div>
  );
};

const Deposit = () => {
    const dispatch = useAppDispatch();
    
    const user: User = useAppSelector(state => state?.auth?.user);
    const [walletsListDropdownOpen, setWalletListDropdown] = useState<boolean>(false);
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(user.wallets?.filter(w => w.limits.can_pay_with_now_payments)[0] || null);
    const [amount, setAmount] = useState<string>("");
    const [error, setError] = useState<string|null>('')

    const minDeposit = selectedWallet?.limits.min_deposit || 0;
    const maxDeposit = selectedWallet?.limits.max_deposit || 0;

    const [createDeposit, {isLoading}] = useCreateDepositMutation()

    const handleChipClick = (value: string) => {
        setAmount(value);
    };

    const selectedSymbol = selectedWallet
        ? currencyList[selectedWallet.slug.toUpperCase()]?.symbol_native || "?"
        : "";

    const handleSubmit = async () => {
        if (!selectedWallet) {
            setError(`Please select a wallet`);
            return;
        }

        const parsedAmount = parseFloat(amount)
        if (isNaN(parsedAmount) || parsedAmount < minDeposit || parsedAmount > maxDeposit) {
            setError(`Please enter an amount between ${minDeposit} and ${maxDeposit} ${selectedWallet.slug.toUpperCase()}`);
            return;
        }

        try {
            const data= await createDeposit({
                price_amount: parsedAmount,
                currency: selectedWallet.slug.toUpperCase(),
            }).unwrap();

            toast.success(`Deposit initiated successfully!`);
            dispatch(setModal({ modal: null }));
            window.location.href = data.invoice_url
        } catch (error) {
            setError(`Failed to initiate deposit. Contact Support`)
            console.error('Deposit error:', error);
        }
    };

    return (
        <Modal title={`Deposit`} onClose={() => dispatch(setModal({ modal: null }))}>
            <div onClick={() => setWalletListDropdown(false)}>
                <div className="Amount_root_hqzcD">
                    <div className="Amount_label_xnDQk">
                        <div><div>Amount</div> ({minDeposit.toLocaleString('en-EN')} - {maxDeposit.toLocaleString('en-EN')}) {selectedSymbol}</div>
                    </div>
                    <div className="m-form-field m-form-field--apply m-form-field--success">
                        <div
                            className="m-input m-gradient-border m-input--dark m-input--l Amount_input_b8Icp"
                            tabIndex={0}
                        >
                            <div className="m-input-content">
                                <input
                                    id="bvgush"
                                    className="Amount_input_b8Icp"
                                    placeholder=" "
                                    inputMode="decimal"
                                    type="number"
                                    min={minDeposit}
                                    max={maxDeposit}
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <div className="m-input-append">
                                <div className="m-dropdown">
                                    <div className="m-dropdown-activator">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setWalletListDropdown(!walletsListDropdownOpen);
                                            }}
                                            className="m-button m-gradient-border m-button--secondary m-button--s CurrencySelect_button_Ak0qa"
                                        >
                                            <div className="m-button-content">
                                                <p className="m-text m-fs12 m-fw600 m-lh160">
                                                    {selectedWallet?.slug.toUpperCase()}
                                                </p>
                                            </div>
                                            <div className="m-icon-container">
                                                <ArrowDown className="m-icon m-icon-loadable CurrencySelect_icon_NoMBv" />
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                {walletsListDropdownOpen && (
                                    <div className="m-dropdown-content CurrencySelect_dropdown_sgDAJ">
                                        <div className="CurrencySelect_items_GMBhe">
                                            {user.wallets?.map((w: Wallet) => (
                                                <div
                                                    key={w.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedWallet(w);
                                                        setWalletListDropdown(false);
                                                    }}
                                                    className="CurrencySelect_item_O5D5k"
                                                >
                                                    {w.slug.toUpperCase()}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {error !== '' && <div className="m-form-field-description" style={{color: 'var(--color-field-basic-description-error)'}}>{error}</div>}
                    </div>
                    <DepositChips
                        selectedWallet={selectedWallet}
                        selectedSymbol={selectedSymbol}
                        handleChipClick={handleChipClick}
                    />
                </div>
                <div className="SubmitBtn_root_l3w2q">
                    <button
                        disabled={isLoading}
                        onClick={handleSubmit}
                        className="m-button m-gradient-border m-button--primary m-button--m SubmitBtn_button_i0Q6_"
                        data-qa="cashier-submit"
                    >
                        <div className="m-button-content"><div>Deposit</div></div>
                    </button>

                    <div onClick={() => console.log('chat')} className="Support_livechat_u6EmP">
                        <p
                            className="m-text m-fs14 m-fw500 m-lh160 Support_text_yjcl3"
                            style={{ color: "var(--color-mid-grey-3)" }}
                        >
                            <div>Need Help?</div>
                        </p>
                        <Support className="m-icon m-icon-loadable" />
                        <div>Live Chat</div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default Deposit;