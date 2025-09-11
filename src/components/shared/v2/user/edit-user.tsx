import { useState, useEffect } from 'react';
import Loading from "@/components/shared/v2/loading.tsx";
import { useLazyGetSingleUserQuery } from '@/services/authApi.ts';
import {useNavigate, useParams} from "react-router";
import type {UsersResponse, Wallet} from "@/types/auth.ts";
import {ChevronLeftIcon} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Switch} from "@/components/ui/switch.tsx";
import {cn} from "@/lib/utils.ts";


function UserListRender() {
    const { userId } = useParams()
    const navigate = useNavigate();
    const [data, setData] = useState<UsersResponse['user'] | null>(null)
    const [fetchUserList, { isLoading, isError, isFetching }] = useLazyGetSingleUserQuery();

       useEffect(() => {
        fetchUserList({ user_id: (Number(userId ?? 0)) }).then((data: any) => {
            setData(data?.data);
        });
    }, []);



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

    return (
            isFetching ? <p>Loading...</p>  :  <div className="min-h-screen text-muted-foregound bg-popover ">
                <div className={'h-10  flex  border-b border-popover items-center'}>
                    <div className={'w-10 h-full border-r border-popover flex items-center'} onClick={()=>navigate(-1)}>
                        <ChevronLeftIcon className={'w-10 '} />
                    </div>
                    <div className={'w-full text-center pr-10 space-x-1 flex justify-center'}>
                        <p>Details</p> <span>-</span> <p>{data?.username ?? ''}</p>
                    </div>
                </div>
                <div className="container text-xs mx-auto  pt-3 p-4 ">
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
                        <div className={'h-full flex items-center'}>
                            <p>Notes</p>
                        </div>
                        <div className={'h-full flex items-center justify-between'}>
                            <p>Status</p>
                            <Switch
                                switchClassName={'bg-white data-[state=checked]:bg-white'}
                                className={'data-[state=checked]:bg-chart-2 data-[state=unchecked]:bg-destructive'}
                                checked={!(data?.is_blocked ?? true)}
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
                                         <p>{wallet.name}</p>
                                         <p>{(Number(Number(wallet.balance ?? 0) / 100)).toLocaleString("en-EN", {
                                             minimumFractionDigits: wallet.decimal_places,
                                             maximumFractionDigits: wallet.decimal_places,
                                         })}</p>
                                    </div>
                            })
                        }
                    </div>
                    <div className={'flex flex-col gap-y-4 p-4'}>
                        <Button className={'rounded-none bg-chart-2 hover:bg-chart-2'}>
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