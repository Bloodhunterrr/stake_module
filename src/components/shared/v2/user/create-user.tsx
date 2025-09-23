import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";

import {useState} from 'react';
import type {User} from "@/types/auth.ts";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {useAppSelector} from "@/hooks/rtk.ts";
import {useCreateUserMutation} from "@/services/authApi.ts";
import {Trans, useLingui} from "@lingui/react/macro";

export default function CreateUser() {
    const user: User = useAppSelector((state) => state.auth?.user);
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        wallet_types: [] as string[],
        default_wallet_type: ''
    });

    const [createUser, {isLoading, isSuccess, isError, error}] = useCreateUserMutation();

    const currencyOptions = user?.wallets.map((w) => ({
        value: w.slug,
        label: w.slug.toUpperCase(),
    })) || [];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleWalletTypesChange = (checked: boolean, currencySlug: string) => {
        setFormData(prevState => {
            const currentWalletTypes = prevState.wallet_types;
            let newWalletTypes;
            if (checked) {
                newWalletTypes = [...currentWalletTypes, currencySlug];
            } else {
                newWalletTypes = currentWalletTypes.filter(type => type !== currencySlug);
            }

            let newDefaultWalletType = prevState.default_wallet_type;
            if (!checked && prevState.default_wallet_type === currencySlug) {
                newDefaultWalletType = '';
            }

            return {
                ...prevState,
                wallet_types: newWalletTypes,
                default_wallet_type: newDefaultWalletType,
            };
        });
    };

    const handleDefaultWalletChange = (value: string) => {
        setFormData(prevState => ({
            ...prevState,
            default_wallet_type: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const payload = {
                ...formData
            };
            await createUser(payload).unwrap();
            setFormData({
                username: '',
                name: '',
                email: '',
                password: '',
                wallet_types: [],
                default_wallet_type: ''
            });
        } catch (err) {
            console.error('Failed to create user:', err);
        }
    };

    const getMessage = () => {
        if (isLoading) {
            return "Creating user...";
        }
        if (isSuccess) {
            return "User created successfully! 🎉";
        }
        if (isError) {
            const errorMessage = (error as any)?.data?.message || 'Something went wrong.';
            return `Error: ${errorMessage}`;
        }
        return '';
    };

    const defaultWalletOptions = currencyOptions.filter(option =>
        formData.wallet_types.includes(option.value)
    );

    const {t} = useLingui();

    return (
        <div className={"py-4 min-h-screen px-5 bg-[#474747]"}>
            {/*className="p-5 max-w-xl mx-auto font-sans">*/}
            <h2 className="text-2xl font-bold mb-4"><Trans>Create New User</Trans></h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className={'flex flex-col gap-y-0.5'}>
                    <Input id="username"
                        type="text"
                        placeholder={t`Username`}
                        name="username"
                        value={formData.username}
                        className={"border-none text-background bg-accent border-b border-b-red-200 rounded-t-lg rounded-b-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-none"}
                        onChange={handleChange}
                        required/>
                    <Input id="name"
                        placeholder={t`Name`}
                        type="text"
                        name="name"
                        value={formData.name}
                        className={"border-none  text-background bg-accent rounded-b-lg rounded-t-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-none"}
                        onChange={handleChange}
                        required/>
                </div>
                <div className={'flex flex-col gap-y-0.5'}>
                    <Input id="email"
                        placeholder={t`Email`}
                        type="email"
                        name="email"
                        value={formData.email}
                        className={"border-none text-background   bg-accent rounded-b-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-none"}
                        onChange={handleChange}
                        required/>
                    <Input id="password"
                        type="password"
                        name="password"
                        placeholder={t`Password`}
                        className={"border-none text-background bg-accent rounded-t-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-none"}
                        value={formData.password}
                        onChange={handleChange}
                        required/>
                </div>
                <div className={'py-2'}>
                    <Label><Trans>Choose wallet:</Trans></Label>
                    <div className="flex flex-wrap gap-4 mt-2">
                        {currencyOptions.map(option => (
                            <div key={option.value} className="flex items-center space-x-2">
                                <Checkbox id={option.value}
                                    checked={formData.wallet_types.includes(option.value)}
                                    onCheckedChange={(checked) => handleWalletTypesChange(!!checked, option.value)}/>
                                <Label htmlFor={option.value}>{option.label}</Label>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <Label htmlFor="default-wallet" className={'py-1 mb-1'}><Trans>Chose one these wallet as default:</Trans></Label>
                    <Select onValueChange={handleDefaultWalletChange}
                        value={formData.default_wallet_type}
                        disabled={defaultWalletOptions.length === 0}>
                        <SelectTrigger id="default-wallet" className={'w-full disabled:text-white!'}>
                            <SelectValue placeholder={t`Select a default wallet`}/>
                        </SelectTrigger>
                        <SelectContent className={'border-none bg-background rounded-none placeholder:text-accent '}>
                            {defaultWalletOptions.map(option => (
                                <SelectItem key={option.value} value={option.value} className={'focus:text-background text-accent rounded-none'}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button type="submit"
                        className={"h-auto w-full bg-chart-2 text-accent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-none hover:bg-chart-2/80 justify-center py-2"}
                        disabled={isLoading}>
                    {isLoading ? t`Creating...` : t`Create User`}
                </Button>
            </form>
            {getMessage() &&
                <p className={`mt-4 ${isError ? 'text-red-500' : 'text-green-500'}`}>{getMessage()}</p>}
        </div>
    );
}