import { format } from "date-fns";
import { cn } from "@/lib/utils.ts";
import type { User } from "@/types/auth";
import { useAppSelector } from "@/hooks/rtk";
import { useNavigate } from "react-router-dom";
import type { Odd } from "@/types/sportHistory";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme.tsx";
import { currencyList } from "@/utils/currencyList";
import { Calendar } from "@/components/ui/calendar";
import { formatDateToDMY } from "@/utils/formatDate";
import { Trans, useLingui } from "@lingui/react/macro";
import Loading from "@/components/shared/v2/loading.tsx";
import { CalendarIcon, ChevronLeftIcon } from "lucide-react";
import { useGetSportHistoryMutation } from "@/services/authApi";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useEffect, useState, useMemo, Fragment, useRef, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const NewBettingHistory = () => {
    const user: User = useAppSelector((state) => state.auth?.user);

    const [tickets, setTickets] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [dates, setDates] = useState<{
        startDate: Date | undefined;
        endDate: Date | undefined;
    }>({
        startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
        endDate: new Date(),
    });
    const navigate = useNavigate()
    const [selectedCurrencies, setSelectedCurrencies] = useState<string>("");
    const [selectedStatuses, setSelectedStatuses] = useState<string>('');
    const [expandedTicketId, setExpandedTicketId] = useState<number | null>(null);

    const [fetchData, { isLoading, error }] = useGetSportHistoryMutation();
    const containerRef = useRef<HTMLDivElement>(null);

    const statusOptions = [
        { value: "0", label: "Pending" },
        { value: "1", label: "Lost" },
        { value: "3", label: "Won" },
        { value: "4", label: "Returned" },
    ];

    const currencyOptions = user?.wallets.map((w) => ({
        value: w.slug.toUpperCase(),
        label: w.slug.toUpperCase(),
    }));

    // This `useCallback` now has a stable dependency array.
    // We use the functional updates `setPage(prevPage => ...)` to avoid
    // depending on `page` directly.
    // In your NewBettingHistory component

    const fetchTickets = useCallback(async (pageToFetch: number) => {
        // Prevent fetching if dates aren't set
        if (!dates.startDate || !dates.endDate) return;

        setIsLoadingMore(true);
        try {
            const response = await fetchData({
                start_date: formatDateToDMY(dates.startDate),
                end_date: formatDateToDMY(dates.endDate),
                currencies: selectedCurrencies ? [selectedCurrencies] : undefined,
                status: selectedStatuses !== '' ? [selectedStatuses] : undefined,
                page: pageToFetch,
            }).unwrap();

            const newTickets = response?.tickets;

            if (newTickets && newTickets.length > 0) {
                // ✅ IF IT'S PAGE 1, REPLACE THE DATA
                if (pageToFetch === 1) {
                    setTickets(newTickets);
                } else {
                    // ✅ FOR ANY OTHER PAGE, APPEND
                    setTickets(prevTickets => [...prevTickets, ...newTickets]);
                }
                setHasMore(response.pagination.current_page < response.pagination.last_page);
                setPage(pageToFetch + 1); // Use direct value, not functional update here
            } else {
                // If page 1 has no results, clear the tickets
                if (pageToFetch === 1) {
                    setTickets([]);
                }
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
            if (pageToFetch === 1) {
                setTickets([]);
            }
            setHasMore(false);
        } finally {
            setIsLoadingMore(false);
        }
    }, [dates, selectedCurrencies, selectedStatuses, fetchData]);

    useEffect(() => {
        // No longer need to manually clear tickets here
        setPage(1);
        setHasMore(true);
        fetchTickets(1); // fetchTickets will handle replacing the data
    }, [fetchTickets]); // This dependency array is now much simpler

    // This effect manages the scroll event listener. It references `hasMore` and `isLoadingMore` directly.
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

            if (isNearBottom && !isLoadingMore && hasMore) {
                fetchTickets(page);
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
    }, [isLoadingMore, hasMore, page, fetchTickets]);

    const groupedTickets = useMemo(() => {
        if (!tickets) return {};
        return tickets.reduce(
            (acc: Record<string, typeof tickets>, ticket) => {
                const dateKey = format(new Date(ticket.created_date), "dd/MM/yyyy");
                if (!acc[dateKey]) acc[dateKey] = [];
                acc[dateKey].push(ticket);
                return acc;
            },
            {}
        );
    }, [tickets]);

    const STATUS_MAP: Record<
        number,
        { label: string | ((ticket: any) => string); color: string }
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
            "0"
        )} ${months[date.getUTCMonth()]} ${String(date.getUTCHours()).padStart(
            2,
            "0"
        )}:${String(date.getUTCMinutes()).padStart(2, "0")}`;
    };

    const {optionalSideBarOpen} = useTheme()
    return (
        <div className={cn("space-y-3 lg:h-[calc(100vh-64px)] container mx-auto ",{
            "lg:h-[calc(100vh-64px)] h-[calc(100vh-88px)]" : optionalSideBarOpen
        })}>
            <div className={'h-14  flex  items-center'}>
                <div className={'w-10 h-full  text-black flex items-center'} onClick={() => navigate(-1)}>
                    <ChevronLeftIcon className={'w-10'} />
                </div>
                <div className={'w-full  text-start text-black  text-lg pr-10 space-x-1 flex justify-start'}>
                    <Trans>Betting History</Trans>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 items-center px-4 md:px-0">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="justify-start text-left font-normal bg-transparent text-accent-foreground"
                        >
                            <CalendarIcon className="sm:mr-2 h-4 w-4" />
                            {dates.startDate ? format(dates.startDate, "dd/MM/yyyy") : "Start Date"}
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
                            className="justify-start text-left font-normal bg-transparent text-accent-foreground"
                        >
                            <CalendarIcon className="sm:mr-2 h-4 w-4" />
                            {dates.endDate ? format(dates.endDate, "dd/MM/yyyy") : "End Date"}
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
                    <Select
                        value={selectedCurrencies}
                        onValueChange={(val) => setSelectedCurrencies(val)}
                    >
                        <SelectTrigger className="w-full placeholder:text-background text-background">
                            <SelectValue placeholder={t`All currencies`} />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            {currencyOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value} >
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                <Select
                    value={selectedStatuses}
                    onValueChange={(val) => setSelectedStatuses(val)}
                >
                    <SelectTrigger className="w-full placeholder:text-background text-background">
                        <SelectValue placeholder={t`All Statuses`} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                        {statusOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div ref={containerRef} className={cn("overflow-y-auto no-scrollbar h-[calc(100vh-205px)] lg:h-[calc(100vh-180px)]",
                { "h-[calc(100vh-248px)] lg:h-[calc(100vh-180px)]": optionalSideBarOpen }
            )}>
                <Table className="text-accent-foreground">
                    <TableHeader className="bg-black/10 h-8 sticky top-0 z-10">
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
                        {isLoading && tickets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-4">
                                </TableCell>
                            </TableRow>
                        ) : error || tickets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-4">
                                    {error ? t`No data available` : t`No history found.`}
                                </TableCell>
                            </TableRow>
                        ) : (
                            Object.entries(groupedTickets).map(([date, dateTickets]) => {
                                return (
                                    <Fragment key={date}>
                                        <TableRow className="bg-black/80 hover:bg-black/80 text-white sticky top-8 z-10">
                                            <TableCell colSpan={3}>{date}</TableCell>
                                        </TableRow>
                                        {dateTickets.map((ticket) => {
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
                                                                expandedTicketId === ticket.id ? null : ticket.id
                                                            )
                                                        }
                                                    >
                                                        <TableCell className="py-0">
                                                            <div className="flex flex-col leading-tight">
                                <span>
                                  {Number(ticket.bet_sum).toFixed(2)}{" "}
                                    {currencyList[ticket.currency]?.symbol_native}
                                </span>
                                                                <span className="text-[12px] block max-w-[170px] sm:max-w-full truncate">
                                  ({ticket.betID})
                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {format(new Date(ticket.created_date), "HH:mm:ss")}
                                                        </TableCell>
                                                        <TableCell className="flex justify-end items-center gap-2">
                                                            {label.includes("Lost") ? (
                                                                <Trans>Lost</Trans>
                                                            ) : label.includes("Returned") ? (
                                                                <span className={"space-x-1"}>
                                  <span>
                                    <Trans>Cashout</Trans>
                                  </span>
                                  <span>{ticket.win_sum}</span>{" "}
                                                                    {currencyList[ticket.currency].symbol_native}
                                </span>
                                                            ) : label.includes("Pending") ? (
                                                                <Trans>Pending</Trans>
                                                            ) : (
                                                                <span>
                                  <Trans>Won</Trans> {label.split(" ")[1]}{" "}
                                                                    {currencyList[ticket.currency].symbol_native}
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
                                                                        const oddStatus =
                                                                            STATUS_MAP[odd.status] || STATUS_MAP[1];
                                                                        return (
                                                                            <div
                                                                                key={odd.id}
                                                                                className="relative flex flex-col border-b border-gray-400"
                                                                            >
                                                                                {(odd.status === 3 ||
                                                                                    odd.status === 1) && (
                                                                                    <div
                                                                                        className={`absolute top-0 left-0 h-full w-1/2 ${
                                                                                            odd.status === 3
                                                                                                ? "bg-gradient-to-r from-green-400/30 to-transparent"
                                                                                                : "bg-gradient-to-r from-red-400/30 to-transparent"
                                                                                        }`}
                                                                                    />
                                                                                )}
                                                                                <div className="flex items-center gap-2 px-4 py-1 relative z-10">
                                          <span
                                              className={`w-3 h-3 rounded-full ${oddStatus.color}`}
                                          />
                                                                                    <div className="text-xs text-gray-600">
                                                                                        {formatTimestamp(
                                                                                            ticket.created_date
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex justify-between px-4 py-1 relative z-10">
                                                                                    <div>
                                                                                        <div>
                                                                                            {odd.event.team1} -{" "}
                                                                                            {odd.event.team2}
                                                                                        </div>
                                                                                        <div className="text-xs text-gray-600 capitalize">
                                                                                            {odd.market.name} -{" "}
                                                                                            {odd.identifiers.selectedOddIndex}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="font-semibold">
                                                                                        {odd.rate}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                    <div className="grid px-4 pb-4 grid-cols-3 gap-2 pt-2 text-xs">
                                                                        <div>
                                                                            <div className="text-gray-400">
                                                                                <Trans>Total odds</Trans>
                                                                            </div>
                                                                            <div>
                                                                                {ticket.details?.odds
                                                                                    ?.reduce(
                                                                                        (all: number, curr: any) =>
                                                                                            all * curr.rate,
                                                                                        1
                                                                                    )
                                                                                    .toFixed(2) ?? 0}
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-gray-400">
                                                                                <Trans>Bet amount</Trans>
                                                                            </div>
                                                                            <div>
                                                                                {ticket.bet_sum}{" "}
                                                                                {
                                                                                    currencyList[ticket.currency]
                                                                                        ?.symbol_native
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-gray-400">
                                                                                <Trans>Payout</Trans>
                                                                            </div>
                                                                            <div>
                                                                                {ticket.win_sum}{" "}
                                                                                {
                                                                                    currencyList[ticket.currency]
                                                                                        ?.symbol_native
                                                                                }
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
                                );
                            })
                        )}
                        {isLoadingMore && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-4">
                                    <Loading />
                                </TableCell>
                            </TableRow>
                        )}
                        {!hasMore && tickets.length > 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-sm text-muted-foreground py-4">
                                    <Trans>You've reached the end of the list.</Trans>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default NewBettingHistory;