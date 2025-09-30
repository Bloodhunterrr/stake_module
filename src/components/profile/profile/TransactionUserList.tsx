import { format } from "date-fns";
import { cn } from "@/lib/utils.ts";
import { useSearchParams } from "react-router";
import { Button } from "@/components/ui/button.tsx";
import { Fragment, useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router";
import { Trans, useLingui } from "@lingui/react/macro";
import { Calendar } from "@/components/ui/calendar.tsx";
import Loading from "@/components/shared/v2/loading.tsx";
import { CalendarIcon, ChevronLeftIcon } from "lucide-react";
import { useLazyGetTransactionsQuery } from "@/services/authApi.ts";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import DateFilter from "@/components/shared/v2/date-filter.tsx";

function SingleTicketPage() {
    const { userTransactionId } = useParams();
    const [fetchSingleData, { isLoading, isError, isFetching }] = useLazyGetTransactionsQuery();
    const navigate = useNavigate();
    const [searchParams , setSearchParams] = useSearchParams();
    const [data, setData] = useState<any>()

    // Filters States
    const start = (searchParams.get('startDate')) ?? new Date();
    const end = (searchParams.get('endDate')) ?? new Date()
    const defaultUserWallet = (data?.user?.wallets?.find((wallet : any) => wallet.default === 1 )?.slug?.toUpperCase() ?? "EUR")
    const [selectedCurrencies, setSelectedCurrencies] = useState(defaultUserWallet)
    const [dates, setDates] = useState({
        startDate: new Date(start ?? ''),
        endDate: new Date(end ?? ''),
    });

    const currencyOptions = data?.filters && data?.filters?.wallets?.map((w : any) => ({
        value: w.slug.toUpperCase(),
        label: w.slug.toUpperCase(),
    }));

    const [selectedDateFilter, setSelectedDateFilter] = useState<string>("");
    const handleDateFilterSelect = (start: Date, end: Date, label: string) => {
        setDates({ startDate: start, endDate: end });
        setSelectedDateFilter(label);
    };
    const { t } = useLingui();


    useEffect(() => {
        const start = (searchParams.get('startDate'))
        const end = (searchParams.get('endDate'))
        if(start && end){
            setDates({
                startDate: new Date(start),
                endDate: new Date(end)
            })
        }
    }, [start , end]);

    useEffect(() => {
        fetchSingleData({
            currency : selectedCurrencies,
            start_date : format(dates.startDate, "yyyy/MM/dd"),
            end_date : format(dates.endDate, "yyyy/MM/dd"),
            user_id : userTransactionId,
        }).unwrap().then(data =>{
            setData(data)
        })
    },[userTransactionId , selectedCurrencies , dates.startDate, dates.endDate ])

    if(isError){
        navigate('/')
    }

    if(isLoading){
        return <div className={'min-h-screen flex flex-col items-center justify-center'}>
            <Loading />
        </div>
    }


    const totals = data?.totals

    return (
        <div className={'container mx-auto'}>
            <div className={'h-10  flex  border-b border-popover items-center'}>
                <div className={'w-10 h-full border-r text-muted border-popover flex items-center'} onClick={()=>navigate(-1)}>
                    <ChevronLeftIcon className={'w-10 '} />
                </div>
                <div className={'w-full text-muted text-center pr-10 space-x-1 flex justify-center'}>
                    <p className={"mr-1"}><Trans>Reports</Trans></p>
                    <span>-</span>
                    <p>{data?.user?.name}</p>
                </div>
            </div>
            <div className={' flex flex-col '}>
                <div className={'w-full border-b border-b-popover py-2 flex flex-row items-center justify-evenly'}>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline"
                                    className="justify-start w-1/3 text-left font-normal bg-muted rounded-none h-8 text-accent-foreground">
                                <CalendarIcon className="sm:mr-2 sm:ml-0 -mr-1 -ml-2 h-4 w-4 " />
                                {format(dates.startDate, "dd/MM/yyyy")}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 bg-white">
                            <Calendar className="w-full"
                                      mode="single"
                                      selected={dates.startDate}
                                      onSelect={(date) => {
                                          setSelectedDateFilter("");
                                          if(date) {
                                              setSearchParams({
                                                  endDate : format(dates.endDate, "yyyy-MM-dd"),
                                                  startDate: format(date, "yyyy-MM-dd"),
                                              })
                                              setDates((prev : any) => ({ ...prev, startDate: date }));
                                          }
                                      }
                                      }/>
                        </PopoverContent>
                    </Popover>
                    <Popover>

                        <PopoverTrigger asChild>
                            <Button variant="outline"
                                    className="justify-start w-1/3 text-left font-normal bg-muted rounded-none h-8 text-accent-foreground">
                                <CalendarIcon className="sm:mr-2 sm:ml-0 -mr-1 -ml-2 h-4 w-4" />
                                {format(dates.endDate, "dd/MM/yyyy")}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 bg-white">
                            <Calendar className="w-full"
                                      mode="single"
                                      selected={dates.endDate}
                                      onSelect={(date) => {
                                          setSelectedDateFilter("")
                                          if(date){
                                              setSearchParams({
                                                  startDate : format(dates.startDate, "yyyy-MM-dd"),
                                                  endDate: format(date, "yyyy-MM-dd"),
                                              })
                                              setDates((prev : any) => ({ ...prev, endDate: date }));
                                          }
                                      }}
                            />
                        </PopoverContent>
                    </Popover>
                    {/*Currency options*/}
                    <Select value={selectedCurrencies} defaultValue={defaultUserWallet} onValueChange={(value) =>{
                        setSelectedCurrencies(value)
                    }}>
                        <SelectTrigger className={"h-8!  w-1/4  rounded-none py-0 bg-transparent hover:bg-transparent   placeholder:text-accent border-none text-accent"}>
                            <SelectValue placeholder={t`Currency`}/>
                        </SelectTrigger>
                        <SelectContent className={'border-none bg-background rounded-none'}>
                            {
                                currencyOptions?.map((currency : any , index : number) =>{
                                    return  <SelectItem key={index} className={'focus:text-background text-accent rounded-none'} value={currency.label}>{currency.label}</SelectItem>
                                })
                            }
                        </SelectContent>
                    </Select>
                </div>
                <DateFilter
                    className="text-accent text-[12px]"
                    selected={selectedDateFilter}
                    onSelect={handleDateFilterSelect}
                />
            </div>
            <div className={'flex flex-col py-3'}>
                <div
                    className={'text-[11px] text-center h-7 items-center bg-white/70 text-black border-accent px-1 flex'}>
                    <p className={'w-[30%] h-full flex items-center justify-start text-start shrink-0'}><Trans>Username</Trans></p>
                    <p className={'w-full h-full flex items-center justify-center'}><Trans>Played</Trans></p>
                    <p className={'w-full h-full flex items-center justify-center'}><Trans>Won</Trans></p>
                    <p className={'w-full h-full flex items-center justify-center'}><Trans>Net Win</Trans></p>
                </div>
                <div className={cn('cursor-pointer border-none bg-background/80 text-accent/60',{
                    'animate-pulse bg-accent/40'  : isFetching
                })}>
                    {
                        data?.children?.map((item : any, i : number) => {
                            if((item.total_stake +item.total_won+item.total_lost) === 0){
                                return <Fragment key={i}></Fragment>;
                            }
                            return (
                                <div key={i}
                                    className={'text-xs text-center h-7 items-center px-1  border-b border-b-popover flex'}
                                    onClick={()=>{
                                        if(item.is_player){
                                            navigate(`/account/transactions/user/${item?.id}?${dates.startDate ? `startDate=${format(dates.startDate, "yyyy-MM-dd")}&` : ""}${dates.endDate ? `endDate=${format(dates.endDate, "yyyy-MM-dd")}` : ""}`)
                                        }else{
                                            navigate(`/account/reports/${item?.id}?${dates.startDate ? `startDate=${format(dates.startDate, "yyyy-MM-dd")}&` : ""}${dates.endDate ? `endDate=${format(dates.endDate, "yyyy-MM-dd")}` : ""}`);
                                        }
                                    }}>
                                    <p className={'w-[30%] h-full flex items-center justify-start line-clamp-1 text-start shrink-0 truncate'}>{item?.name !== '' ? item.name : '------'}{" "}</p>
                                    <p className={'w-full h-full flex items-center justify-center'}>{item.total_stake}</p>
                                    <p className={'w-full h-full flex items-center justify-center'}>{item.total_won}</p>
                                    <p className={'w-full h-full flex items-center justify-center'}>{item.total_lost}</p>
                                </div>
                            )
                        })
                    }
                    <div className="text-[11px] w-full bg-white px-1 text-black text-center h-6 items-center border-b flex">
                        <p
                            className={cn(
                                "w-[30%] h-full flex items-center  truncate justify-start text-start shrink-0",
                            )}
                        >
                            <span>Totals</span>
                        </p>
                        <div className="w-full h-full  flex items-center justify-center">
                            <p className="w-1/2 h-full flex items-center justify-center">
                                {totals?.total_stake?.toFixed(2) ?? "0.00"}
                            </p>
                        </div>
                        <div className="w-full h-full  flex items-center justify-center">
                            <p className="w-1/2 h-full flex items-center justify-center">
                                {totals?.total_won?.toFixed(2) ?? "0.00"}
                            </p>
                        </div>
                        <div className="w-full h-full flex items-center justify-center">
                            <p
                                className={cn("w-1/2 h-full flex items-center justify-center", {
                                    "text-destructive": totals?.net_win && String(totals?.net_win).includes("-"),
                                    "text-chart-2": totals?.net_win && !String(totals?.net_win).includes("-"),
                                })}
                            >
                                {totals?.net_win ? totals?.net_win.toFixed(2) : "-"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleTicketPage;