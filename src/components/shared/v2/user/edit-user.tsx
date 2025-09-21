import React, { useState, useEffect } from 'react';
import Loading from "@/components/shared/v2/loading.tsx";
import {
    useLazyGetSingleUserQuery,
    useGetSendSingleMessageMutation,
    useSendCreditToWalletMutation,
    usePutBlockUserMutation,
} from '@/services/authApi.ts';
import {useNavigate, useParams} from "react-router";
import type {UsersResponse, Wallet} from "@/types/auth.ts";
import {ChevronLeftIcon} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Switch} from "@/components/ui/switch.tsx";
import {cn} from "@/lib/utils.ts";
import {toast} from "react-toastify";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {Input} from "@/components/ui/input";


function UserListRender() {
    const { userId } = useParams()
    const navigate = useNavigate();
    const [data, setData] = useState<UsersResponse['user'] | null>(null)
    const [fetchUserList, { isLoading, isError, isFetching }] = useLazyGetSingleUserQuery();
    const [transferCredit] = useSendCreditToWalletMutation();
    const [sendMessage] = useGetSendSingleMessageMutation()
    const [putBlockUser] = usePutBlockUserMutation();
    const [checked, setChecked] = useState(Boolean(data?.is_blocked === 0));
    const [message, setMessage] = useState({
        subject : "",
        content :  ""
    })
    const [walletInput, setWalletInput] = useState<any>()
    const [triggerUserData, setTriggerUserData] = useState(false)

   useEffect(() => {
        fetchUserList({ user_id: (Number(userId ?? 0)) }).then((data: any) => {
            setData(data?.data);
            setChecked(Boolean(data?.data?.is_blocked === 0));
        });
    }, [triggerUserData]);



    const handleSwitchChange = async (value: boolean) => {
        setChecked(value);
        try {
            const response = await putBlockUser({
                id: Number(data?.id),
                body: { status: !value },
            }).unwrap();
            if(response.success){
                toast(`User ${checked ? "blocked" : "unblocked"} successfully`)
            }
        } catch (err) {
            console.error('Error:', err);
            setChecked(!value);
        }
    };

    if (isLoading) {
        return (
            <section className="min-h-screen flex items-center justify-center bg-background">
                <Loading />
            </section>
        );
    }

    if (isError) {
        navigate("/");
        return null;
    }

    const test = () => {
        sendMessage( {
            "receiver_ids": [(data?.id ?? 0)],
            "subject": message.subject,
            "content": message.content
        }).then(() => {
            setMessage({
                subject:  "",
                content: "",
            })
        })
    }

    const transferCreditFunction = ({user_id , wallet_slug , amount} : any) =>{
        transferCredit({
            "recipient_id": user_id,
            "wallet_slug": wallet_slug,
            "amount": amount
        }).unwrap().then(() =>{
            setTriggerUserData(true)
        })
    }


    return ( isFetching ? <p>Loading...</p>  :  <div className="min-h-screen text-muted-foregound bg-popover ">
                <div className={'h-10  flex  border-b border-popover items-center'}>
                    <div className={'w-10 h-full border-r border-popover flex items-center'} onClick={()=>navigate(-1)}>
                        <ChevronLeftIcon className={'w-10 '} />
                    </div>
                    <div className={'w-full text-center pr-10 space-x-1 flex justify-center'}>
                        <p>Details</p> <span>-</span> <p>{data?.username ?? ''}</p>
                    </div>
                </div>
                <div className="container text-xs mx-auto  pt-4 select-none p-5 ">
                    <div className={'flex h-24 flex-col bg-background/40 border-b border-popover p-2'}>
                        <div className={'h-full flex items-center'}>
                            <p>Last login</p>
                        </div>
                        <div className={'h-full flex items-center justify-between'}>
                            <p>Change Username</p>
                            <p>{data?.username ?? ""}</p>
                        </div>
                    </div>
                    <div className={'flex h-24 flex-col bg-background/40 border-b border-popover  p-2'}>
                        <div className={'h-full flex items-center justify-between'}>
                            <p>Change Password</p>
                            <p>*******</p>
                        </div>
                        <div className={'h-full flex items-center'}>
                            <p>Percentage</p>
                        </div>
                    </div>
                    <div className={'flex h-24 flex-col bg-background/40  p-2'}>
                        <Dialog>
                            <DialogTrigger className={'w-full h-full text-start'}>Notes</DialogTrigger>
                            <DialogContent
                                closeButtonClassName={"size-4"}
                                className={'border-none text-accent'}>
                                <DialogHeader>
                                    <DialogTitle className={'w-full text-center'}>Send message to this {(data && data?.username) ?? ''}</DialogTitle>
                                </DialogHeader>
                                <Input placeholder={"Title"} value={message.subject} className={'border-popover'} onInput={(event : React.ChangeEvent<HTMLInputElement>)=>{
                                        setMessage({
                                            ...message,
                                            subject : event.target.value
                                        })
                                }} />
                                <Input placeholder={"Body"} value={message.content} className={'border-popover'} onInput={(event : React.ChangeEvent<HTMLInputElement>)=>{
                                    setMessage({
                                        ...message,
                                        content : event.target.value
                                    })
                                }}/>
                                <Button className={'bg-chart-2 hover:bg-chart-2'} onClick={test}>
                                    Send
                                </Button>
                            </DialogContent>
                        </Dialog>
                        <div className={'h-full flex items-center justify-between'}>
                            <p>Status</p>
                            <Switch
                                checked={checked}
                                onCheckedChange={(value)=>{
                                    handleSwitchChange(value)
                                }}
                                switchClassName={'bg-white data-[state=checked]:bg-muted-foreground transition-all duration-300'}
                                className={'data-[state=checked]:bg-card data-[state=unchecked]:bg-destructive'}
                            />
                        </div>
                    </div>
                    <div className={'flex h-full flex-col bg-background/40 mt-3 '}>
                        {
                            data?.wallets && data?.wallets?.length > 0 && data?.wallets?.map((wallet : Wallet , index : number) => {
                                const length = data?.wallets?.length ?? 1
                                return  <div className={cn('h-12 flex items-center px-2 justify-between',{
                                   "border-b border-b-popover" : index !== (length-1)
                                })}>
                                    <Dialog>
                                        <DialogTrigger className={'w-full h-full text-start flex flex-row items-center justify-between'}>
                                            <>
                                                <p>{wallet.name}</p>
                                                <p>{(Number(Number(wallet.balance ?? 0) / 100)).toLocaleString("en-EN", {
                                                    minimumFractionDigits: wallet.decimal_places,
                                                    maximumFractionDigits: wallet.decimal_places,
                                                })}</p>
                                            </>
                                        </DialogTrigger>
                                        <DialogContent
                                            closeButtonClassName={"size-4"}
                                            className={'border-none text-accent'}>
                                            <DialogHeader>
                                                <DialogTitle className={'w-full text-center'}>Deposit / Withdraw {wallet.name} from {(data && data?.username) ?? ''}</DialogTitle>
                                            </DialogHeader>
                                            <Input placeholder={"+/- to deposit or withdraw"} value={walletInput} className={'border-popover'} onInput={(event : React.ChangeEvent<HTMLInputElement>)=>{
                                                setWalletInput(event.target.value)
                                            }} />
                                            <Button className={'bg-chart-2 hover:bg-chart-2'} onClick={()=>{
                                                transferCreditFunction({
                                                    wallet_slug : wallet?.slug,
                                                    user_id : userId ?? 0,
                                                    amount : walletInput ?? 0
                                                })
                                                console.log(walletInput)
                                                setWalletInput('')
                                            }}>
                                                Send
                                            </Button>
                                        </DialogContent>
                                    </Dialog>
                                    </div>
                            })
                        }
                    </div>
                    <div className={'flex flex-col gap-y-4 py-4'}>
                        <Button className={'rounded-none bg-chart-2 hover:bg-chart-2'} onClick={()=>{
                            navigate(`/account/transactions/user/${data?.id}`)

                        }}>
                            Transaction
                        </Button>
                        <Button className={'rounded-none bg-chart-2 hover:bg-chart-2'}>
                            Limits
                        </Button>
                    </div>
                </div>
            </div>
    );
}

export default UserListRender;