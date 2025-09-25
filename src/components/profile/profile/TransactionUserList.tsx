import { Fragment, useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router";
import { useLazyGetTransactionsQuery } from "@/services/authApi.ts";
import { useSearchParams } from "react-router";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CalendarIcon, ChevronLeftIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { cn } from "@/lib/utils.ts";
import Loading from "@/components/shared/v2/loading.tsx";
import { Trans, useLingui } from "@lingui/react/macro";

function SingleTicketPage() {
    const { userTransactionId } = useParams();
    const [fetchSingleData, { isLoading, isError, isFetching }] = useLazyGetTransactionsQuery();
    const navigate = useNavigate();
    const [searchParams , setSearchParams] = useSearchParams();
    const [data, setData] = useState<any>()
    const [category, setCategory] = useState(searchParams.get('category'))

    // Filters States
    const start = (searchParams.get('startDate')) ?? new Date();
    const end = (searchParams.get('endDate')) ?? new Date()
    const defaultUserWallet = (data?.user?.wallets?.find((wallet : any) => wallet.default === 1 )?.slug?.toUpperCase() ?? "EUR")
    const [selectedCurrencies, setSelectedCurrencies] = useState(defaultUserWallet)
    const [dates, setDates] = useState({
        startDate: new Date(start ?? ''),
        endDate: new Date(end ?? ''),
    });
    const [betType, setBetType] = useState('')

    const currencyOptions = data?.filters && data?.filters?.wallets?.map((w : any) => ({
        value: w.slug.toUpperCase(),
        label: w.slug.toUpperCase(),
    }));

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
            category_id : category,
            currency : selectedCurrencies,
            start_date : format(dates.startDate, "yyyy/MM/dd"),
            end_date : format(dates.endDate, "yyyy/MM/dd"),
            user_id : userTransactionId,
        }).unwrap().then(data =>{
            setData(data)
        })
    },[userTransactionId , selectedCurrencies , dates.startDate, dates.endDate , betType , status])

    if(isError){
        navigate('/')
    }

    if(isLoading){
        return <div className={'min-h-screen flex flex-col items-center justify-center'}>
            <Loading />
        </div>
    }


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
            <div className={' flex flex-col gap-y-3'}>
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
                                onSelect={(date) =>
                                {
                                    if(date){
                                        setSearchParams({
                                            endDate : format(dates.endDate, "yyyy-MM-dd"),
                                            startDate: format(date, "yyyy-MM-dd"),
                                        })
                                        setDates((prev) => ({...prev, startDate: date}))
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
                                    if(date){
                                        setSearchParams({
                                            startDate : format(dates.startDate, "yyyy-MM-dd"),
                                            endDate: format(date, "yyyy-MM-dd"),
                                        })
                                        setDates((prev) => ({...prev, endDate: date}))
                                    }
                                }
                                }/>
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
                                currencyOptions?.map((currency : any  , index  : number) =>{
                                    return  <SelectItem key={index} className={'focus:text-background text-accent rounded-none'} value={currency.label}>{currency.label}</SelectItem>
                                })
                            }
                        </SelectContent>
                    </Select>
                </div>

                <div className={'flex flex-row items-center border-b pb-2 border-popover justify-between gap-x-2 px-2'}>
                    {/*bet Type*/}
                    <Select value={betType} onValueChange={(value) =>{
                        setBetType(value)
                    }}>
                        <SelectTrigger className={"h-8!  w-1/2  rounded-none py-0 bg-transparent hover:bg-transparent   placeholder:text-accent border-none text-accent "}>
                            <SelectValue placeholder={t`Type`}/>
                        </SelectTrigger>
                        <SelectContent className={'border-none bg-background rounded-none'}>
                            {
                                data?.filters && data?.filters?.betType.map((types : any , index : number) =>{
                                    return  <SelectItem key={index}  className={'focus:text-background text-accent rounded-none capitalize'} value={types}>{types}</SelectItem>
                                })
                            }
                        </SelectContent>
                    </Select>

                    {/*Static for the moment*/}
                    <Select value={category ?? ""} onValueChange={(value) =>{
                        setCategory(value)
                        if(value === "Sport"){
                            navigate(`/account/tickets/${userTransactionId}?${dates.startDate ? `startDate=${format(dates.startDate, "yyyy-MM-dd")}&` : ""}${dates.endDate ? `endDate=${format(dates.endDate, "yyyy-MM-dd")}` : ""}`);
                        }

                    }}>
                        <SelectTrigger className={"h-8!  w-1/2  rounded-none py-0 bg-transparent hover:bg-transparent   placeholder:text-accent border-none text-accent"}>
                            <SelectValue placeholder={t`Status`}/>
                        </SelectTrigger>
                        <SelectContent className={'border-none bg-background rounded-none'}>
                            {
                                ['Sport' , 'Casino' , 'Live Casino'].map((status : any , index : number) =>{
                                    return  <SelectItem key={index} className={'focus:text-background text-accent rounded-none'} value={status}>{status}</SelectItem>
                                })
                            }
                        </SelectContent>
                    </Select>
                </div>


            </div>
            <div className={'flex flex-col p-3'}>
                <div
                    className={'text-sm text-center h-7 items-center bg-chart-2 px-1   flex '}>
                    <p className={'w-[30%] h-full flex items-center justify-start text-start shrink-0'}><Trans>Username</Trans></p>
                    <p className={'w-full h-full flex items-center justify-center'}><Trans>Played</Trans></p>
                    <p className={'w-full h-full flex items-center justify-center'}><Trans>Won</Trans></p>
                    <p className={'w-full h-full flex items-center justify-center'}><Trans>Net Win</Trans></p>
                </div>
                <div className={cn('cursor-pointer  border-accent bg-accent/50 text-accent-foreground',{
                    'animate-pulse bg-accent/40'  : isFetching
                })}>
                    {
                        data?.children?.map((item : any, i : number) => {
                            if((item.total_stake +item.total_won+item.total_lost) === 0){
                                return <Fragment key={i}></Fragment>;
                            }
                            return (
                                <div key={i}
                                    className={'text-sm text-center h-7 items-center px-1 border-b border-b-popover flex '}
                                    onClick={()=>{
                                        if(item.is_player){
                                            navigate(`/account/transactions/user/${item?.id}?${dates.startDate ? `startDate=${format(dates.startDate, "yyyy-MM-dd")}&` : ""}${dates.endDate ? `endDate=${format(dates.endDate, "yyyy-MM-dd")}` : ""}`)
                                            // ?${dates.startDate ? `startDate=${format(dates.startDate, "yyyy-MM-dd")}&` : ""}${dates.endDate ? `endDate=${format(dates.endDate, "yyyy-MM-dd")}` : ""}`);
                                        }else{
                                            navigate(`/account/reports/${item?.id}?${dates.startDate ? `startDate=${format(dates.startDate, "yyyy-MM-dd")}&` : ""}${dates.endDate ? `endDate=${format(dates.endDate, "yyyy-MM-dd")}` : ""}${category  ? `&category=${category}` : ""}`);
                                        }
                                    }}>
                                    <p className={'w-[30%] h-full flex items-center justify-start line-clamp-1 text-start shrink-0 truncate'}>{item?.name !== '' ? item.name : '------'}{" "}({item.total_played})</p>
                                    <p className={'w-full h-full flex items-center justify-center'}>{item.total_stake}</p>
                                    <p className={'w-full h-full flex items-center justify-center'}>{item.total_won}</p>
                                    <p className={'w-full h-full flex items-center justify-center'}>{item.total_lost}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default SingleTicketPage;