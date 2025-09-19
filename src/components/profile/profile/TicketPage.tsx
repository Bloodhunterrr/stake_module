import {Fragment, useEffect, useState} from 'react';
import {useLazyGetAllUsersTicketsQuery} from "@/services/authApi.ts";
import {useNavigate} from "react-router";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {CalendarIcon, ChevronLeftIcon} from "lucide-react";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import Loading from "@/components/shared/v2/loading.tsx";
import { useSearchParams } from "react-router";
function TicketPage() {
    const [fetchAllUsersTickets, { isLoading, isError, isFetching }] = useLazyGetAllUsersTicketsQuery();

    const [searchParams] = useSearchParams()
    const [data, setData] = useState<any>()
    const [category, setCategory] = useState('')

    // Filters
    const [selectedCurrencies, setSelectedCurrencies] = useState('')
    const [dates, setDates] = useState({
        startDate: searchParams.get('startDate') ?? new Date(),
        endDate:  searchParams.get('endDate') ?? new Date(),
    });
    const [betType, setBetType] = useState('')
    const [status, setStatus] = useState('')


    const navigate = useNavigate()

    useEffect(() => {
        fetchAllUsersTickets({
            bet_status : status,
            bet_type : betType,
            wallet_name : selectedCurrencies,
            start_date : format(dates.startDate, "yyyy/MM/dd"),
            end_date : format(dates.endDate, "yyyy/MM/dd"),
        }).unwrap().then(data =>{
            setData(data)
        })
    },[selectedCurrencies , dates.startDate, dates.endDate , betType , status])

    const currencyOptions = data?.filters?.wallets?.map((w : any) => ({
        value: w.slug.toUpperCase(),
        label: w.slug.toUpperCase(),
    }));

    if(isError){
        navigate('/')
    }

    if(isLoading){
        return <div className={'min-h-screen flex flex-col items-center justify-center'}>
            <Loading />
        </div>
    }
    return (
        <div className={'min-h-screen container mx-auto'}>
            <div className={'h-10  flex  border-b border-popover items-center'}>
                <div className={'w-10 h-full border-r text-muted border-popover flex items-center'} onClick={()=>navigate(-1)}>
                    <ChevronLeftIcon className={'w-10 '} />
                </div>
                <div className={'w-full text-muted text-center pr-10 space-x-1 flex justify-center'}>
                    <p>Bets</p>
                    <span>-</span>
                    <p>{data?.user?.name}</p>
                </div>
            </div>
            <div className={' flex flex-col gap-y-3'}>
                <div className={'w-full border-b border-b-popover py-2 flex flex-row items-center justify-evenly'}>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="justify-start w-1/3 text-left font-normal bg-muted rounded-none h-8 text-accent-foreground"
                            >
                                <CalendarIcon className="sm:mr-2 sm:ml-0 -mr-1 -ml-2 h-4 w-4 " />
                                {format(dates.startDate, "dd/MM/yyyy")}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 bg-white">
                            <Calendar
                                className="w-full"
                                mode="single"
                                selected={new Date(dates.startDate)}
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
                                className="justify-start w-1/3 text-left font-normal bg-muted rounded-none h-8 text-accent-foreground"
                            >
                                <CalendarIcon className="sm:mr-2 sm:ml-0 -mr-1 -ml-2 h-4 w-4" />
                                {format(dates.endDate, "dd/MM/yyyy")}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 bg-white">
                            <Calendar
                                className="w-full"
                                mode="single"
                                selected={new Date(dates.endDate)}
                                onSelect={(date) =>
                                    date && setDates((prev) => ({ ...prev, endDate: date }))
                                }
                            />
                        </PopoverContent>
                    </Popover>
                    {/*Currency options*/}
                    <Select value={selectedCurrencies} onValueChange={(value) =>{
                        setSelectedCurrencies(value)
                    }}>
                        <SelectTrigger className={"h-8! w-1/4  rounded-none  bg-transparent hover:bg-transparent   placeholder:text-accent border-none text-accent"}>
                            <SelectValue placeholder={"Currency"}/>
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

                <div className={'flex flex-row items-center border-b pb-2 border-popover justify-between gap-x-2 px-2'}>
                    {/*bet Type*/}
                    <Select value={betType} onValueChange={(value) =>{
                        setBetType(value)
                    }}>
                        <SelectTrigger className={"h-8!  w-1/2  rounded-none py-0 bg-transparent hover:bg-transparent   placeholder:text-accent border-none text-accent "}>
                            <SelectValue placeholder="Type"/>
                        </SelectTrigger>
                        <SelectContent className={'border-none bg-background rounded-none'}>
                            {
                                data?.filters && data?.filters?.betType.map((types : string , index : number) =>{
                                    return  <SelectItem key={index} className={'focus:text-background text-accent rounded-none capitalize'} value={types}>{types}</SelectItem>
                                })
                            }
                        </SelectContent>
                    </Select>
                    {/*Status options*/}
                    <Select value={status} onValueChange={(value) =>{
                        setStatus(value)
                    }}>
                        <SelectTrigger className={"h-8!  w-1/2  rounded-none py-0 bg-transparent hover:bg-transparent   placeholder:text-accent border-none text-accent"}>
                            <SelectValue placeholder="Status"/>
                        </SelectTrigger>
                        <SelectContent className={'border-none bg-background rounded-none'}>
                            {
                                data?.filters && data?.filters?.status.map((status : any , index : number) =>{
                                    return  <SelectItem key={index} className={'focus:text-background text-accent rounded-none'} value={status}>{status}</SelectItem>
                                })
                            }
                        </SelectContent>
                    </Select>

                    {/*Static for the moment*/}
                    <Select value={category} onValueChange={(value) =>{
                        setCategory(value)
                        if(value !== "Sport"){
                            navigate(`/account/reports?${dates.startDate ? `startDate=${format(dates.startDate, "yyyy-MM-dd")}&` : ""}${dates.endDate ? `endDate=${format(dates.endDate, "yyyy-MM-dd")}` : ""}`);
                        }

                    }}>
                        <SelectTrigger className={"h-8!  w-1/2  rounded-none py-0 bg-transparent hover:bg-transparent   placeholder:text-accent border-none text-accent"}>
                            <SelectValue placeholder="Status"/>
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
            <div className={'flex cursor-pointer flex-col p-3'}>
                <div
                    className={'text-sm text-center h-7 items-center bg-chart-2  border-accent px-1  flex '}>
                    <p className={'w-1/3 h-full flex items-center justify-start text-start shrink-0'}>Username</p>
                    <p className={'w-full h-full flex items-center justify-center'}>Played</p>
                    <p className={'w-full h-full flex items-center justify-center'}>Won</p>
                    <p className={'w-full h-full flex items-center justify-center text-center'}>Net Win</p>
                </div>
                <div className={'cursor-pointer border-x border-popover bg-accent/50 text-accent-foreground'}>
                    {
                        isFetching ? <div
                                className={'text-sm animate-pulse text-center h-7 items-center  px-1 border-b flex '}>
                                <p className={'w-[30%] h-full flex items-center justify-start text-start shrink-0'}></p>
                                <p className={'w-full h-full flex items-center justify-center'}></p>
                                <p className={'w-full h-full flex items-center justify-center'}></p>
                                <p className={'w-full h-full flex items-center justify-center text-center'}></p>
                            </div> :
                            data?.children?.length > 0  && data?.children?.map((item : any, index : number) => {
                                if(item.total_stake  + item.total_won + item.total_lost  === 0){
                                    return <Fragment key={index}></Fragment>
                                }
                                return <div key={index}
                                            className={'text-sm text-center h-7 items-center border-popover px-1 border-b flex '}
                                            onClick={() => {
                                                if(!item.is_agent){
                                                    navigate(`/account/tickets/user/${item?.id}`);
                                                }
                                                else{
                                                    navigate(`/account/tickets/${item?.id}?${dates.startDate ? `startDate=${format(dates.startDate, "yyyy-MM-dd")}&` : ""}${dates.endDate ? `endDate=${format(dates.endDate, "yyyy-MM-dd")}` : ""}`);
                                                }
                                            }}>
                                    <p className={'w-1/3 h-full flex items-center truncate line-clamp-1 justify-start text-start shrink-0'}>{item?.name !== '' ? item.name : '------'}{" "}({item.total_played})</p>
                                    <p className={'w-full h-full flex items-center justify-center'}>{item.total_stake}</p>
                                    <p className={'w-full h-full flex items-center justify-center'}>{item.total_won}</p>
                                    <p className={'w-full h-full flex items-center justify-center '}>{item.total_lost}</p>
                                </div>
                            })
                    }
                </div>
            </div>
        </div>
    );
}

export default TicketPage;