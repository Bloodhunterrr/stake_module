import { format } from "date-fns";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/rtk.ts";
import { Calendar } from "@/components/ui/calendar";
import { formatDateToDMY } from "@/utils/formatDate";
import { useEffect, useState, Fragment } from "react";
import { Trans, useLingui } from "@lingui/react/macro";
import Loading from "@/components/shared/v2/loading.tsx";
import {CalendarIcon, X} from "lucide-react";
import PaginationComponent from "@/components/shared/v2/pagination";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useLazyGetSingleUsersTransactionQuery } from "@/services/authApi";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import Footer from "@/components/shared/v2/footer.tsx";

const SingleUserTransaction = () => {
    const contextUser = useAppSelector((s) => s.auth?.user);
    const { singleBetsId } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams] = useSearchParams();
    const start = (searchParams.get('startDate')) ?? new Date();
    const end = (searchParams.get('endDate')) ?? new Date()
    const category = searchParams.get('category')
    const [dates, setDates] = useState({
        startDate: new Date(start ?? ''),
        endDate: new Date(end ?? ''),
    });
    const navigate = useNavigate();
    const [selectedCurrencies, setSelectedCurrencies] = useState<string>();
    const [selectedStatuses, setSelectedStatuses] = useState<string>();
    const [betType, setBetType] = useState('')
    const [fetchSingleTicketData, { data, isLoading, isError, isFetching }] =
        useLazyGetSingleUsersTransactionQuery();

    const currencyOptions = contextUser && contextUser?.wallets?.map((w : any) => ({
        value: w.slug.toUpperCase(),
        label: w.slug.toUpperCase(),
    }));
    useEffect(() => {
        if (singleBetsId) {
            fetchSingleTicketData({
                user_id: singleBetsId,
                start_date: formatDateToDMY(dates.startDate),
                end_date: formatDateToDMY(dates.endDate),
                currency: (selectedCurrencies)?.toLowerCase(),
                status: selectedStatuses,
                // bet_type : betType === 'all' ? "" : betType,
                category_id : (category !== null && category !== "0") ? Number(category) : "",
                page : currentPage,
            })
                .unwrap()
                .then((response) => (response))
                .catch((error) => console.error("Failed to fetch tickets:", error));
        }
    }, [singleBetsId, currentPage, selectedCurrencies, selectedStatuses, dates, fetchSingleTicketData , betType]);

    const user = (data && data[0]?.user) ?? ""

    const { t } = useLingui()

    if(isError){
        navigate('/')
    }

    if(isLoading){
        return <div className={'min-h-screen flex flex-col items-center justify-center'}>
            <Loading />
        </div>
    }

    return (
        <div className="min-h-screen w-full bg-[var(--grey-600)] flex flex-col justify-between">
            <div className="min-h-max w-[calc(94dvw_-_60px)] max-w-300 ml-auto mr-[3dvw] min-[1440px]:mr-auto flex flex-col items-center py-0">
            <div className={'h-10 w-full flex items-center mt-6'}>
                <div className={'w-max text-2xl font-bold text-white text-center pr-10 space-x-1 flex gap-1 justify-center mr-auto'}>
                    <p className={"mr-1"}><Trans>Transaction</Trans></p>
                    <span>-</span>
                    <p>{user}</p>
                </div>
                <div className={'w-10 h-full text-[var(--grey-200)] hover:text-white flex items-center'} onClick={()=>navigate(-1)}>
                    <X className={'w-10'} />
                </div>
            </div>
            <div className="flex flex-row max-[920px]:flex-col gap-6 w-full my-6">
                <div className={'sticky max-w-full min-w-[180px] h-max top-[20px] p-3 flex flex-col gap-2 bg-[var(--grey-700)] rounded-[8px] text-[var(--grey-100)]'}>
                    <div className={'min-[920px]:w-full flex flex-row min-[920px]:flex-col gap-2 items-center justify-evenly'}>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline"
                                        className="justify-start w-1/3 min-[920px]:w-full h-8 text-left font-normal rounded-sm border-[var(--grey-400)] bg-transparent hover:bg-[var(--grey-900)] text-white hover:text-white">
                                    <CalendarIcon className="sm:mr-2 sm:ml-0 -mr-1 -ml-2 h-4 w-4 " />
                                    {format(dates.startDate, "dd/MM/yyyy")}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 bg-white z-[900]">
                                <Calendar className="w-full"
                                          mode="single"
                                          selected={dates.startDate}
                                          onSelect={(date) =>
                                              date && setDates((prev) => ({ ...prev, startDate: date }))
                                          }/>
                            </PopoverContent>
                        </Popover>
                        <Popover>

                            <PopoverTrigger asChild>
                                <Button variant="outline"
                                        className="justify-start w-1/3 min-[920px]:w-full h-8 text-left font-normal rounded-sm border-[var(--grey-400)] bg-transparent hover:bg-[var(--grey-900)] text-white hover:text-white">
                                    <CalendarIcon className="sm:mr-2 sm:ml-0 -mr-1 -ml-2 h-4 w-4" />
                                    {format(dates.endDate, "dd/MM/yyyy")}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 bg-white z-[900]">
                                <Calendar className="w-full"
                                          mode="single"
                                          selected={dates.endDate}
                                          onSelect={(date) =>
                                              date && setDates((prev) => ({ ...prev, endDate: date }))
                                          }/>
                            </PopoverContent>
                        </Popover>
                        {/*Currency options*/}
                        <Select value={selectedCurrencies} onValueChange={(value) =>{
                            setSelectedCurrencies(value)
                        }}>
                            <SelectTrigger className={"h-8! w-1/4 min-[920px]:w-full rounded-xs bg-transparent hover:bg-[var(--grey-900)] data-[placeholder]:text-white placeholder:text-white border-none text-white font-semibold"}>
                                <SelectValue placeholder={t`Currency`}/>
                            </SelectTrigger>
                            <SelectContent className={'border-none bg-[var(--grey-900)] rounded-md'}>
                                {
                                    currencyOptions?.map((currency : any , index : number) =>{
                                        return  <SelectItem key={index} className={'focus:text-background text-accent rounded-sm capitalize'} value={currency.label}>{currency.label}</SelectItem>
                                    })
                                }
                            </SelectContent>
                        </Select>
                    </div>

                    <div className={'min-[920px]:w-full flex flex-row min-[920px]:flex-col items-center justify-between gap-2'}>
                        {/*bet Type*/}
                        <Select value={betType} onValueChange={(value) =>{
                            setBetType(value)
                        }}>
                            <SelectTrigger className={"h-8! w-1/4 min-[920px]:w-full rounded-xs bg-transparent hover:bg-[var(--grey-900)] data-[placeholder]:text-white placeholder:text-white border-none text-white font-semibold"}>
                                <SelectValue placeholder={t`Type`}/>
                            </SelectTrigger>
                            <SelectContent className={'border-none bg-[var(--grey-900)] rounded-md'}>
                                {
                                    data?.filters && data?.filters?.betType.map((types : string , index : number) =>{
                                        return  <SelectItem  key={index} className={'focus:text-background text-accent rounded-sm'} value={types}>{types}</SelectItem>
                                    })
                                }
                            </SelectContent>
                        </Select>
                        {/*Status options*/}
                        <Select value={selectedStatuses} onValueChange={(value) =>{
                            setSelectedStatuses(value)
                        }}>
                            <SelectTrigger className={"h-8! w-1/4 min-[920px]:w-full rounded-xs bg-transparent hover:bg-[var(--grey-900)] data-[placeholder]:text-white placeholder:text-white border-none text-white font-semibold"}>
                                <SelectValue placeholder={t`Status`}/>
                            </SelectTrigger>
                            <SelectContent className={'border-none bg-[var(--grey-900)] rounded-md'}>
                                {
                                    data?.filters && data?.filters?.status.map((status : any , index : number) =>{
                                        return  <SelectItem key={index} className={'focus:text-background text-accent rounded-sm'} value={String(index)}>{status}</SelectItem>
                                    })
                                }
                            </SelectContent>
                        </Select>
                    </div>


                </div>
            </div>

            <div className={'flex flex-col overflow-x-auto no-scrollbar p-2'}>
                <div className={'text-sm text-center h-7 items-center flex'}>
                    <p className={'w-[20%] min-w-12 pl-1 md:w-1/5 md:max-w-1/5 h-full flex bg-chart-2 items-center justify-start text-start shrink-0'}>Username</p>
                    <p className={'min-w-24 h-full flex md:w-1/5 md:max-w-1/5 items-center bg-chart-2 justify-center'}>TYPE</p>
                    <p className={'min-w-20 max-w-24 md:w-1/5 md:max-w-1/5 shrink-0 h-full flex bg-chart-2 items-center justify-center'}>Net</p>
                    <p className={'w-full min-w-20 max-w-24 md:w-1/5 md:max-w-1/5 shrink-0 h-full flex bg-chart-2 items-center justify-center'}>Created</p>
                    <p className={'w-full min-w-20 max-w-24 md:w-1/5 md:max-w-1/5 shrink-0 h-full flex bg-chart-2 items-center justify-center'}>WALLET</p>
                </div>
                <div className={cn('cursor-pointer  border-accent text-accent-foreground',{
                    'animate-pulse bg-accent/40'  : isFetching
                })}>
                    {
                        data?.map((item : any, i : number) => {
                            if((item.total_stake +item.total_won+item.total_lost) === 0){
                                return <Fragment key={i}></Fragment>;
                            }
                            return (
                                <div key={i}
                                    className={'shrink-0 text-center h-7 text-xs items-center border-b border-b-popover flex '}>
                                    <p className={'w-[20%] min-w-12 pl-1 h-full md:w-1/5 md:max-w-1/5 flex bg-accent/50 items-center justify-start line-clamp-1 text-start shrink-0 truncate'}>{item?.user !== '' ? item.user : '------'}</p>
                                    <p className={'min-w-24 w-fit h-full bg-accent/50 md:w-1/5 md:max-w-1/5 flex shrink-0 text-start items-center justify-center'}>{item.type}</p>
                                    <p className={cn('min-w-20 max-w-24 bg-accent/50 md:w-1/5 md:max-w-1/5 shrink-0 h-full flex items-center text-chart-2 justify-center' ,{
                                        "text-destructive/50" : item.out_amount
                                    })}>{item.in_amount ?? item.out_amount}</p>
                                    <p className={'w-full min-w-20 max-w-24 bg-accent/50 md:w-1/5 md:max-w-1/5 shrink-0 h-full flex items-center justify-center'}>{format(item.created_at , 'dd/MM/yyyy')}</p>
                                    <p className={'w-full min-w-20 max-w-24 bg-accent/50 md:w-1/5 md:max-w-1/5 shrink-0 h-full flex items-center justify-center'}>
                                        {(Number(item.balance_after) / 100).toLocaleString("en-EN", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            {data?.tickets?.data?.length > 0 && (
                <div className="p-4">
                    <PaginationComponent
                        totalPages={data.tickets.last_page}
                        currentPage={data.tickets.current_page}
                        setPage={setCurrentPage}/>
                </div>
            )}
        </div>
            <Footer />
        </div>
    );
};

export default SingleUserTransaction;