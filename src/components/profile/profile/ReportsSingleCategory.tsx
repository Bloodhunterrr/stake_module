import { format } from "date-fns";
import { cn } from "@/lib/utils.ts";
import { useEffect, useState } from 'react';
import { useSearchParams } from "react-router";
import { Button } from "@/components/ui/button.tsx";
import { useNavigate, useParams } from "react-router";
import { useLingui, Trans } from "@lingui/react/macro";
import { Calendar } from "@/components/ui/calendar.tsx";
import Loading from "@/components/shared/v2/loading.tsx";
import {CalendarIcon, TicketCheck, X} from "lucide-react";
import { useLazyGetAllUsersTicketsQuery } from "@/services/authApi.ts";
import type { getSendSingleMessageResponse, Wallet } from "@/types/auth.ts";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import DateFilter from "@/components/shared/v2/date-filter.tsx";
import Footer from "@/components/shared/v2/footer.tsx";

function SingleTicketReportPage() {
    const {categorySlug} = useParams();
    const [fetchSingleData, { isLoading, isError }] = useLazyGetAllUsersTicketsQuery();
    const navigate = useNavigate();
    const [searchParams , setSearchParams] = useSearchParams();
    const [data, setData] = useState<getSendSingleMessageResponse>()

    const [selectedDateFilter, setSelectedDateFilter] = useState<string>("");
    const handleDateFilterSelect = (start: Date, end: Date, label: string) => {
        setDates({ startDate: start, endDate: end });
        setSelectedDateFilter(label);
    };
    // Filters States
    const start = (searchParams.get('startDate')) ?? new Date();
    const end = (searchParams.get('endDate')) ?? new Date()

    const defaultUserWallet = (data?.user?.wallets.find((wallet : Wallet) => wallet.default === 1 )?.slug?.toUpperCase() ?? "EUR")
    const [selectedCurrencies, setSelectedCurrencies] = useState(defaultUserWallet)

    const [dates, setDates] = useState({
        startDate: new Date(start ?? ''),
        endDate: new Date(end ?? ''),
    });

    const currencyOptions = data?.filters && data?.filters?.wallets?.map((w : Wallet) => ({
        value: w.slug.toUpperCase(),
        label: w.slug.toUpperCase(),
    }));

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
    const { t } = useLingui()


    useEffect(() => {
        fetchSingleData({
            wallet_name : selectedCurrencies,
            start_date : format(dates.startDate, "yyyy/MM/dd"),
            end_date : format(dates.endDate, "yyyy/MM/dd"),
            user_id : categorySlug,
        }).unwrap().then(data =>{
            setData(data)
        })
    },[categorySlug , selectedCurrencies , dates.startDate, dates.endDate ])

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
        <div className={'min-h-screen w-full bg-[var(--grey-600)] flex flex-col justify-between'}>
            <div className={'min-h-max w-[calc(94dvw_-_60px)] max-w-300 ml-auto mr-[3dvw] min-[1440px]:mr-auto flex flex-col items-center py-0'}>
                <div className={'h-10 w-full flex items-center mt-6'}>
                    <div className={'w-max text-2xl font-bold text-white text-center pr-10 space-x-1 flex gap-1 justify-center mr-auto'}>
                        <TicketCheck className={'ml-1 mt-0.5 size-8 text-[var(--grey-100)]'}/>
                        <p className={"mr-1"}><Trans>Bets</Trans></p>
                        <span>-</span>
                        <p>{data?.user?.name}</p>
                    </div>
                    <div className={'w-10 h-full text-[var(--grey-200)] hover:text-white flex items-center'} onClick={()=>navigate(-1)}>
                        <X className={'w-10'} />
                    </div>
                </div>
                <div className={'flex flex-row max-[920px]:flex-col gap-6 w-full my-6'}>
                    <div
                        className={'sticky max-w-full min-w-[180px] h-max top-[20px] p-3 flex flex-col gap-2 bg-[var(--grey-700)] rounded-[8px] text-[var(--grey-100)]'}>
                        <div
                            className={'min-[920px]:w-full flex flex-row min-[920px]:flex-col gap-2 items-center justify-evenly'}>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline"
                                            className="justify-start w-1/3 min-[920px]:w-full h-8 text-left font-normal rounded-sm border-[var(--grey-400)] bg-transparent hover:bg-[var(--grey-900)] text-white hover:text-white">
                                        <CalendarIcon className="sm:mr-2 sm:ml-0 -mr-1 -ml-2 h-4 w-4"/>
                                        {format(dates.startDate, "dd/MM/yyyy")}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 bg-white z-[100]">
                                    <Calendar className="w-full"
                                              mode="single"
                                              selected={dates.startDate}
                                              onSelect={(date) => {
                                                  setSelectedDateFilter("");
                                                  if (date) {
                                                      setSearchParams({
                                                          endDate: format(dates.endDate, "yyyy-MM-dd"),
                                                          startDate: format(date, "yyyy-MM-dd"),
                                                      })
                                                      setDates((prev: any) => ({...prev, startDate: date}));
                                                  }
                                              }
                                              }/>
                                </PopoverContent>
                            </Popover>
                            <Popover>

                                <PopoverTrigger asChild>
                                    <Button variant="outline"
                                            className="justify-start w-1/3 min-[920px]:w-full h-8 text-left font-normal rounded-sm border-[var(--grey-400)] bg-transparent hover:bg-[var(--grey-900)] text-white hover:text-white">
                                        <CalendarIcon className="sm:mr-2 sm:ml-0 -mr-1 -ml-2 h-4 w-4"/>
                                        {format(dates.endDate, "dd/MM/yyyy")}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 bg-white z-[100]">
                                    <Calendar className="w-full"
                                              mode="single"
                                              selected={dates.endDate}
                                              onSelect={(date) => {
                                                  setSelectedDateFilter("")
                                                  if (date) {
                                                      setSearchParams({
                                                          startDate: format(dates.startDate, "yyyy-MM-dd"),
                                                          endDate: format(date, "yyyy-MM-dd"),
                                                      })
                                                      setDates((prev: any) => ({...prev, endDate: date}));
                                                  }
                                              }}
                                    />
                                </PopoverContent>
                            </Popover>
                            {/*Currency options*/}
                            <Select value={selectedCurrencies} defaultValue={defaultUserWallet}
                                    onValueChange={(value) => {
                                        setSelectedCurrencies(value)
                                    }}>
                                <SelectTrigger
                                    className={"h-8! w-1/4 min-[920px]:w-full rounded-xs bg-transparent hover:bg-[var(--grey-900)] data-[placeholder]:text-white placeholder:text-white border-none text-white font-semibold"}>
                                    <SelectValue placeholder={t`Currency`}/>
                                </SelectTrigger>
                                <SelectContent className={'border-none bg-[var(--grey-900)] rounded-md'}>
                                    {
                                        currencyOptions?.map((currency: any, index: number) => {
                                            return <SelectItem key={index}
                                                               className={'focus:text-background text-accent rounded-none'}
                                                               value={currency.label}>{currency.label}</SelectItem>
                                        })
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex flex-col w-full gap-y-2">
                        <DateFilter className="text-accent text-[12px]"
                                    selected={selectedDateFilter}
                                    onSelect={handleDateFilterSelect}/>
                        <div className={'rounded-[8px] p-6 bg-[var(--grey-700)] w-full h-full'}>
                            <div className={'flex cursor-pointer flex-col py-3 px-4 rounded-[8px] border border-[var(--grey-400)] bg-[var(--grey-600)] border-solid'}>

                                <div className={'text-md font-bold text-center h-10 items-center justify-center bg-[var(--grey-600)] text-[var(--grey-200)] border-accent px-1 flex'}>
                                    <p className={'w-1/3 h-full flex items-center justify-center text-start shrink-0'}><Trans>Username</Trans></p>
                                    <p className={'w-full h-full flex items-center justify-center'}><Trans>Played</Trans></p>
                                    <p className={'w-full h-full flex items-center justify-center'}><Trans>Won</Trans></p>
                                    <p className={'w-full h-full flex items-center justify-center'}><Trans>Comm</Trans></p>
                                    <p className={'w-full h-full flex items-center justify-center'}><Trans>Net Win</Trans></p>
                                </div>
                                <div className={"cursor-pointer border-none bg-transparent text-white"}>
                                    {
                                        data?.children?.map((item: getSendSingleMessageResponse['children'][0], i: number) => {
                                            if ((item.total_stake + item.total_won + item.total_lost) === 0) {
                                                return null
                                            }
                                            return (
                                                <div key={i}
                                                     className={'text-xs text-center h-10 items-center px-1 border-b border-b-[var(--grey-300)] flex'}
                                                     onClick={(e) => {
                                                         if (item.is_agent) {
                                                             navigate(`/account/reports/category/${item.id}?${dates.startDate ? `startDate=${format(dates.startDate, "yyyy/MM/dd")}&` : ""}${dates.endDate ? `endDate=${format(dates.endDate, "yyyy/MM/dd")}` : ""}`)
                                                         } else {
                                                             e.stopPropagation()
                                                         }
                                                     }}>
                                                    <p className={'w-1/3 h-full flex items-center truncate line-clamp-1 justify-center text-start shrink-0'}>{item?.name !== '' ? item.name : '------'}{" "}({item.total_played})</p>
                                                    <p className={'w-full h-full flex items-center justify-center'}>{item.total_stake.toFixed(2)}</p>
                                                    <p className={'w-full h-full flex items-center justify-center'}>{item.total_won.toFixed(2)}</p>
                                                    <p className={'w-full h-full flex items-center justify-center'}>{item?.sport_commission?.toFixed(2)}</p>
                                                    <p className={'w-full h-full flex items-center justify-center'}>{Number(item?.net_win ?? 0)?.toFixed(2)}</p>
                                                </div>
                                            )
                                        })
                                    }
                                    <div className="text-md w-full bg-[var(--grey-900)] text-white px-1 text-center h-10 items-center border-b border-b-[var(--grey-400)] flex">
                                        <p className={cn("w-1/3 h-full flex items-center truncate justify-center text-start shrink-0",)}>
                                            <span>Totals</span>
                                        </p>
                                        <div className="w-full h-full flex items-center justify-center">
                                            <p className="w-1/2 h-full flex items-center justify-center">
                                                {totals?.total_stake?.toFixed(2) ?? "0.00"}
                                            </p>
                                        </div>
                                        <div className="w-full h-full flex items-center justify-center">
                                            <p className="w-1/2 h-full flex items-center justify-center">
                                                {totals?.total_won?.toFixed(2) ?? "0.00"}
                                            </p>
                                        </div>
                                        <div className="w-full h-full flex items-center justify-center">
                                            <p className="w-1/2 h-full flex items-center justify-center">
                                                {totals?.sport_commission?.toFixed(2) ?? "0.00"}
                                            </p>
                                        </div>
                                        <div className="w-full h-full flex items-center justify-center">
                                            <p className={cn("w-1/2 h-full flex items-center justify-center", {
                                                "text-destructive": totals?.net_win && String(totals?.net_win).includes("-"),
                                                "text-chart-2": totals?.net_win && !String(totals?.net_win).includes("-"),
                                            })}>
                                                {totals?.net_win ? totals?.net_win.toFixed(2) : "-"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                <Footer/>
            </div>

    );
}

export default SingleTicketReportPage;