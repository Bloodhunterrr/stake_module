import { useEffect, useState, useMemo, Fragment } from "react";
import {useParams} from "react-router";
import { format } from "date-fns";
import { useLazyGetSingleUsersTicketsQuery } from "@/services/authApi";
import { formatDateToDMY } from "@/utils/formatDate";
import { currencyList } from "@/utils/currencyList";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import PaginationComponent from "@/components/shared/v2/pagination";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {CalendarIcon, ChartNoAxesCombined} from "lucide-react";
import { Trans } from "@lingui/react/macro";
import Loading from "@/components/shared/v2/loading.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

interface Odd {
    id: string;
    status: number;
    event: { inf?: string; team1: string; team2: string };
    market: { name: string };
    identifiers: { selectedOddIndex: string };
    rate: number;
}

interface Ticket {
    ext_id: string;
    won_amount: string;
    stake_amount: string;
    id: string;
    user_name: string;
    bet_type: string;
    bet_sum: number;
    win_sum: number;
    currency: string;
    betID: string;
    created_at: string;
    status: number;
    details: {
        result_payload?: { action: string };
        vendor_status: string;
        odds: Odd[];
    };
}

const SingleUserBets = () => {
    const { singleBetsId } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [dates, setDates] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
        endDate: new Date(),
    });
    const [selectedCurrencies, setSelectedCurrencies] = useState<string>();
    const [selectedStatuses, setSelectedStatuses] = useState<string>();
    const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
    const [betType, setBetType] = useState('')
    const [fetchSingleTicketData, { data, isLoading, isError, isFetching }] =
        useLazyGetSingleUsersTicketsQuery();

    const currencyOptions = data?.filters && data?.filters?.wallets?.map((w : any) => ({
        value: w.slug.toUpperCase(),
        label: w.slug.toUpperCase(),
    }));
    useEffect(() => {
        if (singleBetsId) {
            fetchSingleTicketData({
                user_id: singleBetsId,
                start_date: formatDateToDMY(dates.startDate),
                end_date: formatDateToDMY(dates.endDate),
                wallet_name: (selectedCurrencies)?.toLowerCase(),
                status: selectedStatuses,
                bet_type : betType === 'all' ? "" : betType,
                page : currentPage,
            })
                .unwrap()
                .then((response) => response)
                .catch((error) => console.error("Failed to fetch tickets:", error));
        }
    }, [singleBetsId, currentPage, selectedCurrencies, selectedStatuses, dates, fetchSingleTicketData , betType]);

    const groupedTickets = useMemo(() => {
        if (!data?.tickets?.data) return {};
        return data.tickets.data.reduce(
            (acc: Record<string, Ticket[]>, ticket: Ticket) => {
                const dateKey = format(new Date(ticket.created_at), "dd/MM/yyyy");
                if (!acc[dateKey]) acc[dateKey] = [];
                acc[dateKey].push(ticket);
                return acc;
            },
            {},
        );
    }, [data?.tickets?.data]);

    const STATUS_MAP: Record<
        number,
        { label: string | ((ticket: Ticket) => string); color: string }
    > = {
        0: { label: "Pending", color: "bg-[#f67024]" },
        3: {
            label: (ticket) =>
                `Won ${Number(ticket.win_sum).toFixed(2)} ${
                    currencyList[ticket.currency]?.symbol_native
                }`,
            color: "bg-green-500",
        },
        4: { label: "Returned", color: "bg-[#355be2]" },
        1: { label: "Lost", color: "bg-red-500" },
    };


    const formatTimestamp = (timestamp: string | Date) => {
        const date = new Date(timestamp);
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        return `${days[date.getUTCDay()]} ${String(date.getUTCDate()).padStart(
            2,
            "0",
        )} ${months[date.getUTCMonth()]} ${String(date.getUTCHours()).padStart(
            2,
            "0",
        )}:${String(date.getUTCMinutes()).padStart(2, "0")}`;
    };

    return (
        <div className="space-y-3 bg-white min-h-screen container mx-auto">
            <div className="grid grid-cols-2 pt-2 md:grid-cols-2 gap-2 md:gap-4 items-center px-4 md:px-0">
                <div className={'flex flex-row gap-x-3  w-full col-span-2'}>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="justify-start text-left lg:w-1/3 font-normal rounded-none py-0 bg-muted hover:bg-muted  placeholder:text-background capitalize text-background"
                            >
                                <CalendarIcon className="sm:mr-2 h-4 w-4" />
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
                                className="justify-start lg:w-1/3 text-left font-normal rounded-none py-0 bg-muted hover:bg-muted  placeholder:text-background capitalize text-background"
                            >
                                <CalendarIcon className="sm:mr-2 h-4 w-4" />
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
                    {
                        (currencyOptions?.length > 1) && <Select value={selectedCurrencies} onValueChange={(value) =>{
                            setSelectedCurrencies(value)
                        }}>
                            <SelectTrigger className={"h-8  w-1/3  rounded-none py-0 bg-muted hover:bg-muted  placeholder:text-background capitalize text-background "}>
                                <SelectValue placeholder="Currencies"/>
                            </SelectTrigger>
                            <SelectContent className={'border-none bg-background rounded-none'}>
                                {
                                    currencyOptions?.map((types : any) =>{
                                        console.log(types)
                                        return  <SelectItem  className={'focus:text-background text-accent rounded-none capitalize'} value={types.value}>{types.label}</SelectItem>
                                    })
                                }
                            </SelectContent>
                        </Select>
                    }
                </div>



                {/*Status*/}
                <Select value={betType} onValueChange={(value) =>{
                    setBetType(value)
                }}>
                    <SelectTrigger className={"h-8  w-full  rounded-none py-0 bg-muted hover:bg-muted  placeholder:text-background capitalize text-background "}>
                        <SelectValue placeholder="Type"/>
                    </SelectTrigger>
                    <SelectContent className={'border-none bg-background rounded-none'}>
                        {
                            data?.filters && data?.filters?.betType.map((types : any) =>{
                                return  <SelectItem  className={'focus:text-background text-accent rounded-none capitalize'} value={types}>{types}</SelectItem>
                            })
                        }
                    </SelectContent>
                </Select>

                {/*Status*/}
                <Select value={selectedStatuses} onValueChange={(value) =>{
                   setSelectedStatuses(value)
                }}>
                    <SelectTrigger className={"h-8  w-full  rounded-none py-0 bg-muted hover:bg-muted  placeholder:text-background capitalize text-background "}>
                        <SelectValue placeholder="Status"/>
                    </SelectTrigger>
                    <SelectContent className={'border-none bg-background rounded-none'}>
                        {
                            data?.filters && data?.filters?.status.map((types : string , index : number) =>{
                                return  <SelectItem  className={'focus:text-background text-accent rounded-none capitalize'} value={String(index)}>{types} </SelectItem>
                            })
                        }
                    </SelectContent>
                </Select>

            </div>

            <Table className="text-accent-foreground">
                <TableHeader className="bg-black/10 h-8">
                    <TableRow>
                        <TableHead className="h-8">
                            <Trans>Bet Amount (Bet ID)</Trans>
                        </TableHead>
                        <TableHead className="h-8">
                            <Trans>Time</Trans>
                        </TableHead>
                        <TableHead className="text-right h-8">
                            <Trans>Status</Trans>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading || isFetching ? (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center py-4">
                                <Loading />
                            </TableCell>
                        </TableRow>
                    ) : isError || !data?.tickets?.data?.length ? (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center py-4">
                                {isError ? "No data available" : "No history found."}
                            </TableCell>
                        </TableRow>
                    ) : (
                        Object.entries(groupedTickets).map(([date, tickets] : any) => {
                          return  (
                                <Fragment key={date}>
                                    <TableRow className="bg-black/80 hover:bg-black/80 text-white">
                                        <TableCell colSpan={3}>{date}</TableCell>
                                    </TableRow>
                                    {tickets?.map((ticket: Ticket) => {
                                        const status = STATUS_MAP[ticket.status] || STATUS_MAP[1];
                                        const label =
                                            typeof status.label === "function"
                                                ? status.label(ticket)
                                                : status.label;

                                        return (
                                            <Fragment key={ticket.id}>
                                                <TableRow
                                                    className="cursor-pointer"
                                                    onClick={() =>
                                                        setExpandedTicketId(
                                                            expandedTicketId === ticket.id ? null : ticket.id,
                                                        )
                                                    }
                                                >
                                                    <TableCell className="py-0">
                                                        <div className="flex flex-col leading-tight">
                                                                <span>
                                                                  {Number(ticket?.stake_amount).toFixed(2)}{" "}
                                                                    {currencyList[ticket.currency]?.symbol_native}
                                                                </span>
                                                            <span
                                                                className="text-[12px] block max-w-[170px] sm:max-w-full truncate">
                                                                {ticket?.user_name}
                                                                </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {format(new Date(ticket.created_at), "HH:mm:ss")}
                                                        <span
                                                            className="text-[12px] block max-w-[170px] sm:max-w-full truncate">
                                                                  ({ticket.ext_id})
                                                                </span>
                                                    </TableCell>
                                                    <TableCell className="flex justify-end items-center gap-2">
                                                        {label.includes("Lost") ? (
                                                            <Trans>Lost</Trans>
                                                        ) : label.includes("Returned") ? (
                                                            <span className="space-x-1">
                                                             <span>
                                                            <Trans>Cashout</Trans>
                                                          </span>
                                                          <span>{ticket.won_amount}</span>{" "} {currencyList[ticket.currency]?.symbol_native}
                                                        </span>
                                                                                    ) : label.includes("Pending") ? (
                                                                                        <Trans>Pending</Trans>
                                                                                    ) : (
                                                                                        <span>
                                                          <Trans>Won</Trans> {ticket.won_amount}{" "}
                                                                                            {currencyList[ticket.currency]?.symbol_native}
                                                        </span>
                                                        )}
                                                        <span
                                                            className={`w-3 h-3 rounded-full ${status.color}`}
                                                        />
                                                    </TableCell>
                                                </TableRow>

                                                {expandedTicketId === ticket.id && (
                                                    <TableRow className="bg-muted p-0">
                                                        <TableCell colSpan={3} className="p-0">
                                                            <div className="text-sm">
                                                                {ticket.details?.odds?.map((odd: Odd) => {
                                                                    const oddStatus = STATUS_MAP[odd.status] || STATUS_MAP[1];
                                                                    return (
                                                                        <div
                                                                            key={odd.id}
                                                                            className="relative flex flex-col border-b border-gray-400"
                                                                        >
                                                                            {(odd.status === 3 || odd.status === 1) && (
                                                                                <div
                                                                                    className={`absolute top-0 left-0 h-full w-1/2 ${
                                                                                        odd.status === 3
                                                                                            ? "bg-gradient-to-r from-green-400/30 to-transparent"
                                                                                            : "bg-gradient-to-r from-red-400/30 to-transparent"
                                                                                    }`}
                                                                                />
                                                                            )}
                                                                            <div
                                                                                className="flex items-center w-full gap-2 px-4 py-1 relative z-10">
                                                                                      <span
                                                                                          className={`w-3 h-3 shrink-0 rounded-full ${oddStatus.color}`}
                                                                                      />
                                                                                <div className="text-xs text-gray-600">
                                                                                    {formatTimestamp(ticket.created_at)}
                                                                                </div>
                                                                                <div className={'w-full text-muted-foreground flex items-center justify-end'}>
                                                                                    <ChartNoAxesCombined size={18}/>
                                                                                </div>
                                                                            </div>
                                                                            <div
                                                                                className="flex justify-between px-4 py-1 relative z-10">
                                                                                <div>
                                                                                    <div>
                                                                                        {odd.event.team1} - {odd.event.team2}
                                                                                    </div>
                                                                                    <div
                                                                                        className="text-xs text-gray-600 capitalize">
                                                                                        {odd.market.name} -{" "}
                                                                                        {odd.identifiers.selectedOddIndex}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="font-semibold flex items-center flex-col h-full">

                                                                                    <span>{odd.rate.toFixed(2)}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    );
                                                                })}
                                                                <div className="grid px-4 pb-4 grid-cols-3 gap-2 pt-2 text-sm ">
                                                                    <div>
                                                                        <div className="text-gray-400">
                                                                            <Trans>Total odds</Trans>
                                                                        </div>
                                                                        <div className={'font-semibold'}>
                                                                            {ticket.details?.odds
                                                                                ?.reduce(
                                                                                    (all: number, curr: Odd) => all * curr.rate,
                                                                                    1,
                                                                                )
                                                                                .toFixed(2) ?? 0}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-gray-400">
                                                                            <Trans>Bet amount</Trans>
                                                                        </div>
                                                                        <div className={'font-semibold'}>
                                                                            {ticket?.stake_amount}{" "}
                                                                            {currencyList[ticket.currency]?.symbol_native}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-gray-400">
                                                                            <Trans>Payout</Trans>
                                                                        </div>
                                                                        <div className={'font-semibold'}>
                                                                            {ticket?.won_amount}{" "}
                                                                            {currencyList[ticket.currency]?.symbol_native}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </Fragment>
                                        );
                                    })}
                                </Fragment>
                            )
                        })
                    )}
                </TableBody>
            </Table>

            {data?.tickets?.data?.length > 0 && (
                <div className="p-4">
                    <PaginationComponent
                        totalPages={data.tickets.last_page}
                        currentPage={data.tickets.current_page}
                        setPage={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
};

export default SingleUserBets;