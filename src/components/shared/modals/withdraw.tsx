import { setModal } from "@/slices/sharedSlice";
import Modal from "../modal";
import { useAppDispatch, useAppSelector } from "@/hooks/rtk";
import type { User, Wallet } from "@/types/auth";
import { useEffect, useState } from "react";
import Support  from "@/assets/icons/support.svg?react";
import { currencyList } from "@/utils/currencyList";
import ArrowDown  from "@/assets/icons/arrow-down.svg?react";
import SearchIcon  from "@/assets/icons/search.svg?react";
import SingleSelectAutocomplete, {type Option } from "../single-select-autocomplete/single-select-autocomplete";
import './withdraw.css';
import { useGetNpCryptoListQuery } from "@/services/mainApi";
import { useCreateWithdrawMutation } from "@/services/authApi";
import { toast } from "react-toastify";

type ChipsProps = {
    selectedWallet: Wallet | null;
    handleChipClick: any;
    selectedSymbol: string;
};

const WithdrawChips = ({ selectedWallet, handleChipClick, selectedSymbol }: ChipsProps) => {
    const [suggested, setSuggested] = useState<number[]>([]);
    useEffect(() => {
        if (!selectedWallet) {
            setSuggested([]);
            return;
        }
        const { min_withdraw, max_withdraw } = selectedWallet.limits || {
            min_withdraw: 0,
            max_withdraw: 0,
        };
        if (min_withdraw === 0 || max_withdraw === 0) {
            setSuggested([]);
            return;
        }
        const newSuggested: number[] = [];
        for (let i = 1; i <= 4; i++) {
            const value = min_withdraw * i;
            if (value <= max_withdraw) {
                newSuggested.push(value);
            } else {
                break;
            }
        }
        setSuggested(newSuggested);
    }, [selectedWallet]);
    if (suggested.every(el => el === 0)) return null;
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

const Withdraw = () => {
    const dispatch = useAppDispatch();
    const user: User = useAppSelector(state => state?.auth?.user);
    const [walletsListDropdownOpen, setWalletListDropdown] = useState<boolean>(false);
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(
        user.wallets.filter(w => w.limits.can_pay_with_now_payments)[0] || null
    );
    const [amount, setAmount] = useState<string>("");
    const [error, setError] = useState<string | null>('');
    const [walletAddress, setWalletAddress] = useState<string>('');
    const [walletError, setWalletError] = useState<string | null>(null);

    const selectedSymbol = selectedWallet
        ? currencyList[selectedWallet.slug.toUpperCase()]?.symbol_native || "?"
        : "";

    const minWithdraw = selectedWallet?.limits.min_withdraw || 0;
    const maxWithdraw = selectedWallet?.limits.max_withdraw || 0;

    const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
    const [cryptoError, setCryptoError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const { data: cryptoData, isLoading: cryptoIsLoading } = useGetNpCryptoListQuery({
        search: searchTerm,
    });

    const [createWithdraw] = useCreateWithdrawMutation()
    

    useEffect(() => {
        setError(null);
        setWalletError(null);
        setCryptoError(null);
    }, [selectedCrypto])

    const fetchOptions = (query: string): Promise<Option[]> => {
        // if (query.length <= 2) return Promise.resolve([]);

        setSearchTerm(query);
        return new Promise((resolve) => {
            const checkData = setInterval(() => {
                if (!cryptoIsLoading && cryptoData) {
                    clearInterval(checkData);
                    const options = cryptoData.cryptos.map((crypto) => ({
                        image: crypto.logo_url,
                        value: crypto.code,
                        label: `${crypto.name} (${crypto.code})`,
                    }));
                    resolve(options);
                }
            }, 100);
            setTimeout(() => {
                clearInterval(checkData);
                resolve([]);
            }, 3000);
        });
    };

    const handleChipClick = (value: string) => {
        setAmount(value);
    };

    const validateWalletAddress = (address: string, regex: string): boolean => {
        try {
            const pattern = new RegExp(regex);
            return pattern.test(address);
        } catch {
            return false;
        }
    };

    const handleSubmit = async () => {
        let hasError = false;

        setError(null);
        setWalletError(null);
        setCryptoError(null);

        if (!selectedWallet) {
            setError(`Please select a wallet`);
            hasError = true;
        }

        if (!selectedCrypto) {
            setCryptoError(`Please select a cryptocurrency`);
            hasError = true;
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount < minWithdraw || parsedAmount > maxWithdraw) {
            setError(`Please enter an amount between ${minWithdraw} and ${maxWithdraw} ${selectedWallet?.slug.toUpperCase()}`);
            hasError = true;
        }

        if (!walletAddress.trim()) {
            setWalletError(`Please enter wallet address`);
            hasError = true;
        } else if (selectedCrypto && selectedWallet) {
            const selectedCryptoData = cryptoData?.cryptos.find(c => c.code === selectedCrypto);
            if (selectedCryptoData?.wallet_regex && !validateWalletAddress(walletAddress, selectedCryptoData.wallet_regex)) {
                setWalletError(`Invalid wallet address format`);
                hasError = true;
            }
        }

        if (hasError) return;

        try {
            const cryptoId = cryptoData?.cryptos.find(c => c.code === selectedCrypto)?.id
            await createWithdraw({
                currency: selectedWallet?.slug.toUpperCase() || '',
                price_amount: +amount,
                crypto_id: cryptoId || 0,
                wallet_address: walletAddress
            }).unwrap();
            toast.success(`Withdraw initiated successfully!`);
            dispatch(setModal({ modal: 'withdraw-info' }))
        } catch (error) {
            setError(`Failed to initiate withdraw. Contact Support`)
            console.error('Withdraw error:', error);
        }
    };

    console.log({selectedCrypto})

    return (
        <Modal title={`Withdraw`} onClose={() => dispatch(setModal({ modal: null }))}>
            <div onClick={() => setWalletListDropdown(false)} style={{ minHeight: '400px' }}>
                <div className="Amount_root_hqzcD">
                    <div className="Amount_label_xnDQk">
                        <div><div>Amount</div> ({minWithdraw.toLocaleString('en-EN')} - {maxWithdraw.toLocaleString('en-EN')}) {selectedSymbol}</div>
                    </div>

                    <div className="m-form-field m-form-field--apply">
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
                                    min={minWithdraw}
                                    max={maxWithdraw}
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
                        {error !== '' && <div className="m-form-field-description" style={{ color: 'var(--color-field-basic-description-error)' }}>{error}</div>}
                    </div>

                    <div className="m-form-field m-form-field--apply">
                        <WithdrawChips
                            selectedWallet={selectedWallet}
                            selectedSymbol={selectedSymbol}
                            handleChipClick={handleChipClick}
                        />
                    </div>

                    <div className="m-form-field m-form-field--apply">
                        <SingleSelectAutocomplete
                            SvgIcon={SearchIcon}
                            fetchOptions={fetchOptions}
                            selected={selectedCrypto}
                            onChange={setSelectedCrypto}
                            placeholder={`Search cryptocurrency...`}
                            disabled={false}
                            isLoading={cryptoIsLoading}
                        />
                        {cryptoError && (
                            <div className="m-form-field-description" style={{ color: 'var(--color-field-basic-description-error)' }}>
                                {cryptoError}
                            </div>
                        )}
                    </div>

                    <div className="m-form-field m-form-field--apply">
                        <label className="m-form-field-label Amount_label_xnDQk"><div>Wallet Address</div></label>
                        <div className="m-input m-gradient-border m-input--basic m-input--m Amount_input_b8Icp">
                            <div className="m-input-content">
                                <input
                                    type="text"
                                    placeholder="Enter wallet address"
                                    value={walletAddress}
                                    onChange={(e) => setWalletAddress(e.target.value)}
                                />
                            </div>
                        </div>
                        {walletError && (
                            <div className="m-form-field-description" style={{ color: 'var(--color-field-basic-description-error)' }}>
                                {walletError}
                            </div>
                        )}
                    </div>
                </div>

                <div className="SubmitBtn_root_l3w2q">
                    <button
                        onClick={handleSubmit}
                        className="m-button m-gradient-border m-button--primary m-button--m SubmitBtn_button_i0Q6_"
                        data-qa="cashier-submit"
                    >
                        <div className="m-button-content"><div>Withdraw</div></div>
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

export default Withdraw;