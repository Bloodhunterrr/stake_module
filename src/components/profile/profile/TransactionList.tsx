import { useState, useEffect } from 'react';
import Loading from "@/components/shared/v2/loading.tsx";
import {useLazyGetSingleUserQuery, useLazyGetSingleUserTransactionQuery} from '@/services/authApi.ts';
import {useNavigate, useParams} from "react-router";
import type {TransactionResponse, UsersResponse} from "@/types/auth.ts";
import {CalendarIcon, ChevronLeftIcon} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar.tsx";
import {MultiSelect} from "@/components/ui/multi-select.tsx";
import {formatDateToDMY} from "@/utils/formatDate.ts";
import {cn} from "@/lib/utils.ts";
import {Trans, useLingui} from "@lingui/react/macro";


function UserListRender() {
    const { userId } = useParams()
    const navigate = useNavigate();
    const [data, setData] = useState<TransactionResponse['data'] | null>(null)
    const [user, setUser] = useState<UsersResponse['user'] | null>(null)
    const [fetchTransactionList, { isLoading, isError, isFetching }] = useLazyGetSingleUserTransactionQuery();

    const [dates, setDates] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate())),
        endDate: new Date(),
    });
    const [fetchUserList] = useLazyGetSingleUserQuery();

    const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
    const { t } = useLingui();

    useEffect(() => {
        fetchTransactionList(
            {
                start_date: formatDateToDMY(dates.startDate),
                type : '',
                end_date: formatDateToDMY(dates.endDate),
                currency : selectedCurrencies,
                user_id: (Number(userId ?? 0))
            }).then((data: any) => {
            setData(data?.data);
        });
    }, [dates.startDate, dates.endDate , selectedCurrencies]);


    useEffect(() => {
        fetchUserList({ user_id: (Number(userId ?? 0)) }).then((data: any) => {
            setUser(data?.data);
        });
    }, []);

    const currencyOptions = user?.wallets?.map((w) => ({
        value: w.slug.toUpperCase(),
        label: w.slug.toUpperCase(),
    }));

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
       <div className={cn("min-h-screen text-muted-foreground bg-popover ")}>
            <div className={'h-10  flex  border-b border-popover items-center'}>
                <div className={'w-10 h-full border-r text-muted border-popover flex items-center'} onClick={()=>navigate(-1)}>
                    <ChevronLeftIcon className={'w-10 '} />
                </div>
                <div className={'w-full text-muted text-center pr-10 space-x-1 flex justify-center'}>
                    <p className={"mr-1"}><Trans>Transactions</Trans></p>
                    <span>-</span>
                    <p>{user?.username ?? ''}</p>
                </div>
            </div>
            <div className="grid grid-cols-3 container mx-auto py-3 md:grid-cols-4 gap-2 md:gap-4 items-center px-4 md:px-0">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="justify-start text-left font-normal bg-muted rounded-none h-8 text-accent-foreground"
                        >
                            <CalendarIcon className="sm:mr-2 sm:ml-0 -mr-1 -ml-2 h-4 w-4 " />
                            {format(dates.startDate, "dd/MM/yyyy")}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 bg-white">
                        <Calendar
                            className="w-full"
                            mode="single"
                            selected={dates.startDate}
                            onSelect={(date) =>
                                date && setDates((prev) => ({ ...prev, startDate: date }))
                            }
                        />
                    </PopoverContent>
                </Popover>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="justify-start text-left font-normal bg-muted rounded-none h-8 text-accent-foreground"
                        >
                            <CalendarIcon className="sm:mr-2 sm:ml-0 -mr-1 -ml-2 h-4 w-4" />
                            {format(dates.endDate, "dd/MM/yyyy")}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 bg-white">
                        <Calendar
                            className="w-full"
                            mode="single"
                            selected={dates.endDate}
                            onSelect={(date) =>
                                date && setDates((prev) => ({ ...prev, endDate: date }))
                            }
                        />
                    </PopoverContent>
                </Popover>

                {currencyOptions && (
                    <MultiSelect
                        options={currencyOptions}
                        className={'h-8 rounded-none bg-muted hover:bg-muted  placeholder:text-accent-foreground'}
                        value={selectedCurrencies}
                        onValueChange={setSelectedCurrencies}
                        placeholder={t`All currencies`}
                        hideSelectAll
                    />
                )}
            </div>

            <div className={cn("container text-xs text-white mx-auto  py-2  select-none " ,
                {
                    "animate-pulse bg-black/10" : isFetching
                }) }>
                <div className={'px-2'}>
                    <div className={'bg-popover'}>
                        {
                            data && data.length > 0 ? data?.map((singleTransaction : any)  => {
                                const {created_at , in_amount , out_amount ,  user , raw_data} = singleTransaction
                                return (
                                    <div className={'flex flex-row py-2 border-b border-b-muted-foreground pl-2 justify-between'}>
                                        <p className={'w-1/2'}>{created_at}</p>
                                        <p className={'w-1/4 text-end pr-2 shrink-0' }>{in_amount ? "+" : "-"}{in_amount ? in_amount : out_amount}</p>
                                        <p className={'text-card text-start w-1/4'}>{user}</p>
                                        <p className={'text-start w-1/4 capitalize'}>{raw_data.type_raw}</p>
                                    </div>
                                )
                            } ) : <p className={'p-3 text-center'}>No Data</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserListRender;