import { format } from "date-fns";
import { cn } from "@/lib/utils.ts";
import { useTheme } from "@/hooks/useTheme.tsx";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { currencyList } from "@/utils/currencyList";
import { formatDateToDMY } from "@/utils/formatDate";
import { Trans, useLingui } from "@lingui/react/macro";
import Loading from "@/components/shared/v2/loading.tsx";
import { CalendarIcon, ChartNoAxesCombined, X } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useLazyGetSingleUsersTicketsQuery } from "@/services/authApi";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useEffect, useState, useMemo, Fragment, useRef, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";

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
    event_count: number;
    details: {
        result_payload?: { action: string };
        vendor_status: string;
        odds: Odd[];
    };
}

const SingleUserBets = () => {
    const { singleBetsId } = useParams();
    const [searchParams] = useSearchParams();
    const start = searchParams.get('startDate');
    const end = searchParams.get('endDate');
    const typeParams = searchParams.get('type') ?? ""
    const statusParams = searchParams.get('status') ?? ""

    // Separate date states initialized to null if no search param exists
    const [startDate, setStartDate] = useState<Date | undefined>(start ? new Date(start) : undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(end ? new Date(end) : undefined);

    const navigate = useNavigate();
    const [selectedCurrencies, setSelectedCurrencies] = useState<string>();
    const [selectedStatuses, setSelectedStatuses] = useState<string>(statusParams);
    const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
    const [betType, setBetType] = useState(typeParams);

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);


    const [fetchSingleTicketData, { data, isLoading, isError, isFetching }] = useLazyGetSingleUsersTicketsQuery();
    const groupedTickets = useMemo(() => {
        if (!tickets || tickets.length === 0) return {};
        return tickets.reduce(
            (acc: Record<string, Ticket[]>, ticket: Ticket) => {
                const dateKey = format(new Date(ticket.created_at), "dd/MM/yyyy");
                if (!acc[dateKey]) acc[dateKey] = [];
                acc[dateKey].push(ticket);
                return acc;
            },
            {},
        );
    }, [tickets]);

    // In the SingleUserBets component

    // In the SingleUserBets component

    const fetchMoreTickets = useCallback(async (pageToFetch: number) => {
        // The safety check now lives inside the memoized function
        if (!singleBetsId || !startDate || !endDate) {
            // If the main filters aren't set, do nothing.
            return;
        }

        // Prevent re-fetching while already loading
        if (isLoadingMore) return;

        // For infinite scroll, stop if there's no more data
        if (pageToFetch > 1 && !hasMore) return;

        setIsLoadingMore(true);
        try {
            const response = await fetchSingleTicketData({
                user_id: singleBetsId,
                start_date: formatDateToDMY(startDate),
                end_date: formatDateToDMY(endDate),
                currency: selectedCurrencies?.toLowerCase(),
                status: selectedStatuses,
                bet_type: betType === 'all' ? "" : betType,
                page: pageToFetch,
            }).unwrap();

            console.log(response , 'test');

            const newTickets = response?.tickets?.data;

            if (newTickets && newTickets.length > 0) {
                if (pageToFetch === 1) {
                    setTickets(newTickets); // Replace on page 1
                } else {
                    setTickets(prevTickets => [...prevTickets, ...newTickets]); // Append on other pages
                }
                setHasMore(response.tickets.current_page < response.tickets.last_page);
                setPage(pageToFetch + 1);
            } else {
                if (pageToFetch === 1) {
                    setTickets([]);
                }
                setHasMore(false);
            }
        } catch (error : any) {
            if(error && ("status" in error) && error?.status === 401) {
                navigate('/')
            }
            console.error("Failed to fetch tickets:", error);
            if (pageToFetch === 1) {
                setTickets([]);
            }
            setHasMore(false);
        } finally {
            setIsLoadingMore(false);
        }
    }, [
        singleBetsId,
        startDate,
        endDate,
        selectedCurrencies,
        selectedStatuses,
        betType,
        fetchSingleTicketData,
    ]);


    useEffect(() => {
        setPage(1);
        setHasMore(true);
        fetchMoreTickets(1);
    }, [fetchMoreTickets]);


    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

            if (isNearBottom && !isLoadingMore && hasMore) {
                fetchMoreTickets(page);
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, [isLoadingMore, hasMore, page, fetchMoreTickets]);


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

    const { t } = useLingui();
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
    const user = (tickets?.find((user: any) => user.user_name)?.user_name ?? "");

    const { optionalSideBarOpen } = useTheme();


    const calculateCommission = (value: number, event_count: number) => {
        switch (true) {
            case (event_count === 1): {
                return value * 0.04
            }
            case (event_count > 1 && event_count <= 2): {
                return value * 0.06
            }
            case (event_count > 2): {
                return value * 0.08
            }
            default: {
                return 0;
            }
        }
    };

    return (
        <div className=" h-[calc(100vh-164px)] container mx-auto ">
            <div className={'h-10 w-full flex items-center mt-6'}>
                <div className={'w-max text-2xl font-bold text-white text-center pr-10 space-x-1 flex gap-1 justify-center mr-auto'}>
                    <p>Bets</p>
                    <span>-</span>
                    <p>{user}</p>
                </div>
                <div className={'w-10 h-full text-[var(--grey-200)] hover:text-white flex items-center'} onClick={()=>navigate(-1)}>
                    <X className={'w-10'} />
                </div>
            </div>
            {/* The scrollable container */}
            <div ref={containerRef} className={cn("overflow-y-auto transition-all duration-300 h-[calc(100vh-85px)] lg:h-[calc(100vh-105px)]",{
                "h-[calc(100vh-128px)]" : optionalSideBarOpen
            })}>
                <div className={' flex flex-col py-0.5 gap-y-3'}>
                    <div className={'w-full border-b border-b-popover  flex flex-row items-center justify-evenly'}>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="justify-start w-1/3 text-left font-normal bg-muted rounded-none h-8 text-accent-foreground"
                                >
                                    <CalendarIcon className="sm:mr-2 sm:ml-0 -mr-1 -ml-2 h-4 w-4 " />
                                    {startDate ? format(startDate, "dd/MM/yyyy") : "Start Date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 bg-white">
                                <Calendar
                                    className="w-full"
                                    mode="single"
                                    selected={startDate}
                                    onSelect={(date) =>
                                        date && setStartDate(date)
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
                                    {endDate ? format(endDate, "dd/MM/yyyy") : "End Date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 bg-white">
                                <Calendar
                                    className="w-full"
                                    mode="single"
                                    selected={endDate}
                                    onSelect={(date) =>
                                        date && setEndDate(date)
                                    }
                                />
                            </PopoverContent>
                        </Popover>
                        <Select value={selectedCurrencies} onValueChange={(value) => {
                            setSelectedCurrencies(value)
                        }}>
                            <SelectTrigger className={"h-8! w-1/4  rounded-none  bg-transparent hover:bg-transparent  data-[placeholder]:text-white placeholder:text-white border-none text-white font-semibold "}>
                                <SelectValue placeholder={"Currency"} />
                            </SelectTrigger>
                            <SelectContent className={'border-none bg-background rounded-none'}>
                                {
                                    data?.filters?.wallets?.map((w: any, index: number) => {
                                        return <SelectItem key={index} className={'focus:text-background text-accent rounded-none'} value={w.slug.toUpperCase()}>{w.slug.toUpperCase()}</SelectItem>
                                    })
                                }
                            </SelectContent>
                        </Select>
                    </div>

                    <div className={'flex flex-row items-center border-b pb-2 border-popover justify-between gap-x-2 px-2'}>
                        <Select value={betType} onValueChange={(value) => {
                            setBetType(value)
                        }}>
                            <SelectTrigger className={"h-8!  w-1/2  rounded-none py-0  bg-transparent hover:bg-transparent  data-[placeholder]:text-white placeholder:text-white border-none text-white font-semibold "}>
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent className={'border-none bg-background rounded-none'}>
                                {
                                    data?.filters?.betType?.map((type: string, index: number) => {
                                        return <SelectItem key={index} className={'focus:text-background text-accent rounded-none capitalize'} value={type}>{type}</SelectItem>
                                    })
                                }
                            </SelectContent>
                        </Select>
                        <Select value={selectedStatuses} onValueChange={(value) => {
                            setSelectedStatuses(value)
                        }}>
                            <SelectTrigger className={"h-8!  w-1/2  rounded-none py-0   bg-transparent hover:bg-transparent   data-[placeholder]:text-white placeholder:text-white border-none text-white font-semibold"}>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className={'border-none bg-background rounded-none'}>
                                {
                                    data?.filters?.status?.map((status: any, index: number) => {
                                        return <SelectItem key={index} className={'focus:text-background text-accent rounded-none'} value={String(index)}>{status}</SelectItem>
                                    })
                                }
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Table className="bg-popover hover:bg-popover text-white">
                    <TableHeader className="bg-chart-2 hidden text-white  h-8">
                        <TableRow className={'hover:bg-transparent border-popover'}>
                            <TableHead className="h-8 px-0 max-w-[110px] text-white">
                                <span className="max-md:hidden"><Trans>Bet Amount/User</Trans></span><span className="md:hidden"><Trans>Bet</Trans></span>
                            </TableHead>
                            <TableHead className="h-8 px-0 text-white text-center max-w-1/4">
                                <Trans>Time/Id</Trans>
                            </TableHead>
                            <TableHead className="text-right h-8 text-white max-w-1/4">
                            </TableHead>
                            <TableHead className="text-right h-8 text-white max-w-1/4">
                                <Trans>Status</Trans>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tickets.length === 0 && (isLoading || isFetching) ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-4">
                                </TableCell>
                            </TableRow>
                        ) : isError || tickets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-4">
                                    {isError ? t`No data available` : t`No history found.`}
                                </TableCell>
                            </TableRow>
                        ) : (
                            Object.entries(groupedTickets).map(([date, tickets]: any) => {
                                return (
                                    <Fragment key={date}>
                                        <TableRow className="bg-popover/10  border-popover hover:bg-background/30 text-white">
                                            <TableCell colSpan={4}>{date}</TableCell>
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
                                                        className="cursor-pointer h-12 w-full px-0 bg-popover/10 border-popover hover:bg-poover "
                                                        onClick={() =>
                                                            setExpandedTicketId(
                                                                expandedTicketId === ticket.id ? null : ticket.id,
                                                            )
                                                        }
                                                    >
                                                        <TableCell className="p-0 max-w-[20%] ">
                                                            <div className="flex px-2 flex-col leading-tight">
                                                                <span>
                                                                    {Number(ticket?.stake_amount).toFixed(2)}{" "}
                                                                    {currencyList[ticket.currency]?.symbol_native}
                                                                </span>
                                                                <span
                                                                    className="text-[12px] block max-w-[120px] sm:max-w-full truncate">
                                                                    {ticket?.user_name}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell colSpan={2} className={'max-w-1/2  py-0 px-0'}>
                                                            <span className={'flex flex-row shrink-0 gap-1'}>
                                                                <span>
                                                                    {format(new Date(ticket.created_at), "HH:mm:ss")}
                                                                    <span
                                                                        className="text-[12px] block max-w-[100px] truncate sm:max-w-full">
                                                                        ({ticket.ext_id})
                                                                    </span>
                                                                </span>
                                                                <span className={'w-1/2 flex text-xs items-center justify-evenly flex-col'}>
                                                                    <span>{ticket?.user_name}</span>
                                                                    {
                                                                        ticket.status !== 4 &&
                                                                        <span>
                                                                            <span>({(calculateCommission(Number(ticket?.stake_amount ?? 0), Number(ticket?.event_count ?? 0)) ?? 0).toFixed(2)}</span>
                                                                            <span>{currencyList[ticket.currency]?.symbol_native})</span>
                                                                        </span>
                                                                    }
                                                                </span>
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="flex justify-end  text-xs items-center gap-2">
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
                                                        <TableRow className="bg-popover/10 border-popover hover:bg-popover p-0">
                                                            <TableCell colSpan={4} className="p-0">
                                                                <div className="text-sm">
                                                                    {ticket.details?.odds?.map((odd: Odd) => {
                                                                        const oddStatus = STATUS_MAP[odd.status] || STATUS_MAP[1];
                                                                        return (
                                                                            <div
                                                                                key={odd.id}
                                                                                className="relative flex flex-col border-b border-popover/60"
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
                                                                                    <div className="text-xs text-white">
                                                                                        {formatTimestamp(ticket.created_at)}
                                                                                    </div>
                                                                                    <div className={'w-full text-muted-foreground flex items-center justify-end'}>
                                                                                        <ChartNoAxesCombined size={18} />
                                                                                    </div>
                                                                                </div>
                                                                                <div
                                                                                    className="flex justify-between px-4 py-1 relative z-10">
                                                                                    <div>
                                                                                        <div>
                                                                                            {odd.event.team1} - {odd.event.team2}
                                                                                        </div>
                                                                                        <div
                                                                                            className="text-xs text-white capitalize">
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
                                                                            <div className="text-accent">
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
                                                                            <div className="text-accent">
                                                                                <Trans>Bet amount</Trans>
                                                                            </div>
                                                                            <div className={'font-semibold'}>
                                                                                {ticket?.stake_amount}{" "}
                                                                                {currencyList[ticket.currency]?.symbol_native}
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-accent">
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
                        <TableRow className={'hover:bg-[#a7a7a7]  bg-[#a7a7a7]  border-popover'}>
                            <TableHead className="h-11 px-2 max-w-[110px] text-black">
                                <Trans>Total</Trans>
                            </TableHead>
                            <TableHead className="h-8 px-0 text-white text-center max-w-1/4">
                            </TableHead>
                            <TableHead className="text-right h-8 text-white max-w-1/4">
                            </TableHead>
                            <TableHead className="text-right h-8 text-white max-w-1/4">
                                <div className={cn( "text-black")}>
                                       <span>€</span>
                                    {data?.statistics?.net_win?.toFixed(2)}
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableBody>
                </Table>
                {isLoadingMore && (
                    <div className="flex justify-center p-4">
                        <Loading />
                    </div>
                )}
                {!hasMore && tickets.length > 0 && (
                    <div className="text-center text-sm text-muted-foreground p-4">
                        You've reached the end of the list.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SingleUserBets;