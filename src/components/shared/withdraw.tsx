import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {cn} from "@/lib/utils"
import {toast} from "react-toastify"
import {useEffect, useState} from "react"
import {useAppSelector} from "@/hooks/rtk"
import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import type {User, Wallet} from "@/types/auth"
import {currencyList} from "@/utils/currencyList"
import Support from "@/assets/icons/support.svg?react"
import {useGetNpCryptoListQuery} from "@/services/mainApi"
import {useCreateWithdrawMutation} from "@/services/authApi"

type WithdrawProps = {
    isOpen: boolean
    onClose: () => void
    wallet: Wallet
}

export default function Withdraw({isOpen, onClose, wallet}: WithdrawProps) {
    const user: User = useAppSelector((state) => state?.auth?.user)
    const [amount, setAmount] = useState<string>("")
    const [walletAddress, setWalletAddress] = useState<string>("")
    const [selectedCrypto, setSelectedCrypto] = useState<string>("")
    const [error, setError] = useState<string | null>(null)
    const [walletAddressError, setWalletAddressError] = useState<string | null>(null)
    const [cryptoError, setCryptoError] = useState<string | null>(null)
    const [selectedWallet, setSelectedWallet] = useState<Wallet>(wallet)

    const {data: cryptoData} = useGetNpCryptoListQuery({
        search: '',
    })

    const [createWithdraw, {isLoading: isWithdrawing}] = useCreateWithdrawMutation()

    const selectedSymbol = selectedWallet
        ? currencyList[selectedWallet.slug.toUpperCase()]?.symbol_native || "?"
        : ""
    const minWithdraw = selectedWallet?.limits.min_withdraw || 0
    const maxWithdraw = selectedWallet?.limits.max_withdraw || 0

    useEffect(() => {
        setSelectedWallet(wallet)
        setAmount("")
        setWalletAddress("")
        setSelectedCrypto("")
        setError(null)
        setWalletAddressError(null)
        setCryptoError(null)
    }, [wallet, isOpen])

    const handleChipClick = (value: string) => {
        setAmount(value)
    }

    const validateWalletAddress = (address: string, regex: string): boolean => {
        try {
            const pattern = new RegExp(regex)
            return pattern.test(address)
        } catch {
            return false
        }
    }

    const handleSubmit = async () => {
        let hasError = false

        setError(null)
        setWalletAddressError(null)
        setCryptoError(null)

        if (!selectedWallet) {
            setError(`Please select a wallet`)
            hasError = true
        }

        if (!selectedCrypto) {
            setCryptoError(`Please select a cryptocurrency`)
            hasError = true
        }

        const parsedAmount = parseFloat(amount)
        if (
            isNaN(parsedAmount) ||
            parsedAmount < minWithdraw ||
            parsedAmount > maxWithdraw
        ) {
            setError(
                `Please enter an amount between ${minWithdraw} and ${maxWithdraw} ${selectedWallet?.slug.toUpperCase()}`,
            )
            hasError = true
        }

        if (!walletAddress.trim()) {
            setWalletAddressError(`Please enter a wallet address`)
            hasError = true
        } else if (selectedCrypto) {
            const selectedCryptoData = cryptoData?.cryptos.find(
                (c) => c.code === selectedCrypto,
            )
            if (
                selectedCryptoData?.wallet_regex &&
                !validateWalletAddress(walletAddress, selectedCryptoData.wallet_regex)
            ) {
                setWalletAddressError(`Invalid wallet address format`)
                hasError = true
            }
        }

        if (hasError) return

        try {
            const cryptoId = cryptoData?.cryptos.find(
                (c) => c.code === selectedCrypto,
            )?.id
            await createWithdraw({
                currency: selectedWallet?.slug.toUpperCase() || "",
                price_amount: +amount,
                crypto_id: cryptoId || 0,
                wallet_address: walletAddress,
            }).unwrap()
            toast.success(`Withdraw initiated successfully!`)
            onClose() // or dispatch(setModal({ modal: 'withdraw-info' }))
        } catch (err) {
            setError(`Failed to initiate withdraw. Contact Support`)
            console.error("Withdraw error:", err)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Withdraw</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="amount">
                            Amount ({minWithdraw.toLocaleString("en-EN")} -{" "}
                            {maxWithdraw.toLocaleString("en-EN")}) {selectedSymbol}
                        </Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="amount"
                                type="number"
                                min={minWithdraw}
                                max={maxWithdraw}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className={cn({
                                    "border-destructive focus-visible:ring-destructive":
                                    error,
                                })}
                            />
                            <Select
                                value={selectedWallet.slug}
                                onValueChange={(value) => {
                                    const newWallet = user.wallets?.find((w) => w.slug === value)
                                    if (newWallet) setSelectedWallet(newWallet)
                                }}
                            >
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="Select a wallet"/>
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

                    <WithdrawChips selectedWallet={selectedWallet} handleChipClick={handleChipClick}/>

                    <div className="grid gap-2">
                        <Label htmlFor="crypto">Select Cryptocurrency</Label>
                        <Select
                            value={selectedCrypto}
                            onValueChange={(value) => setSelectedCrypto(value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Search for a crypto..."/>
                            </SelectTrigger>
                            <SelectContent>
                                {cryptoData?.cryptos?.map((crypto) => (
                                    <SelectItem key={crypto.id} value={crypto.code}>
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={crypto.logo_url}
                                                alt={crypto.name}
                                                className="h-5 w-5"
                                            />
                                            {crypto.name} ({crypto.code})
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {cryptoError && (
                            <p className="text-sm font-medium text-destructive">{cryptoError}</p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="wallet-address">Wallet Address</Label>
                        <Input
                            id="wallet-address"
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                            className={cn({
                                "border-destructive focus-visible:ring-destructive":
                                walletAddressError,
                            })}
                        />
                        {walletAddressError && (
                            <p className="text-sm font-medium text-destructive">
                                {walletAddressError}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <Button onClick={handleSubmit} disabled={isWithdrawing} className="w-full">
                        {isWithdrawing ? "Withdrawing..." : "Withdraw"}
                    </Button>
                    <div
                        onClick={() => console.log("chat")}
                        className="flex cursor-pointer items-center justify-center space-x-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <p>Need Help?</p>
                        <Support className="h-4 w-4"/>
                        <span>Live Chat</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

type ChipsProps = {
    selectedWallet: Wallet | null
    handleChipClick: (value: string) => void
}

const WithdrawChips = ({selectedWallet, handleChipClick}: ChipsProps) => {
    const [suggested, setSuggested] = useState<number[]>([])
    const selectedSymbol = selectedWallet
        ? currencyList[selectedWallet.slug.toUpperCase()]?.symbol_native || "?"
        : ""

    useEffect(() => {
        if (!selectedWallet) {
            setSuggested([])
            return
        }

        const {min_withdraw, max_withdraw} = selectedWallet.limits || {
            min_withdraw: 0,
            max_withdraw: 0,
        }

        if (min_withdraw === 0 || max_withdraw === 0) {
            setSuggested([])
            return
        }

        const newSuggested: number[] = []
        for (let i = 1; i <= 4; i++) {
            const value = min_withdraw * i
            if (value <= max_withdraw) {
                newSuggested.push(value)
            } else {
                break
            }
        }
        setSuggested(newSuggested)
    }, [selectedWallet])

    if (suggested.every((el) => el === 0)) return null

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
    )
}
