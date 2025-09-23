import {
  useEffect,
  useState,
  useMemo,
  Fragment,
  useRef,
  useCallback,
} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import type { User } from "@/types/auth";
import { CalendarIcon, ChevronLeftIcon } from "lucide-react";
import { useAppSelector } from "@/hooks/rtk";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/v2/loading.tsx";
import { Calendar } from "@/components/ui/calendar";
import { currencyList } from "@/utils/currencyList";
import { Trans, useLingui } from "@lingui/react/macro";
import DateFilter from "@/components/shared/v2/date-filter";
import type { CasinoTransaction } from "@/types/casinoHistory";
import { useGetCasinoHistoryMutation } from "@/services/authApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";
import {useTheme} from "@/hooks/useTheme.tsx";

export default function CasinoHistoryTable() {
  const user: User = useAppSelector((state) => state.auth?.user);
  const navigate = useNavigate();

  const [dates, setDates] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(),
  });

  const [tickets, setTickets] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("");
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleDateFilterSelect = (start: Date, end: Date, label: string) => {
    setDates({ startDate: start, endDate: end });
    setSelectedDateFilter(label);
    setPage(1);
  };

  const [fetchData, { isLoading, error }] = useGetCasinoHistoryMutation();
  const containerRef = useRef<HTMLDivElement>(null);

  const currencyOptions = user?.wallets.map((w) => ({
    value: w.slug.toUpperCase(),
    label: w.slug.toUpperCase(),
  }));

    // In your CasinoHistoryTable component

    const fetchTickets = useCallback(
        async (pageToFetch: number) => {
            // Guard clause to prevent fetching without valid dates
            if (!dates.startDate || !dates.endDate) return;

            setIsLoadingMore(true);
            try {
                const response = await fetchData({
                    start_date: format(dates.startDate, "dd-MM-yyyy"),
                    end_date: format(dates.endDate, "dd-MM-yyyy"),
                    currencies: selectedCurrencies.length > 0 ? selectedCurrencies : undefined,
                    page: pageToFetch,
                }).unwrap();

                const newTransactions = response?.transactions;

                if (newTransactions && newTransactions.length > 0) {
                    // ✅ IF IT'S PAGE 1 (a new filter), REPLACE THE DATA
                    if (pageToFetch === 1) {
                        setTickets(newTransactions);
                    } else {
                        // ✅ FOR ANY OTHER PAGE (infinite scroll), APPEND
                        setTickets((prevTickets) => [...prevTickets, ...newTransactions]);
                    }
                    setHasMore(response.pagination.current_page < response.pagination.last_page);
                    setPage(pageToFetch + 1);
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
        },
        [dates, selectedCurrencies, fetchData]
    );


    useEffect(() => {
        setPage(1);
        setHasMore(true);
        fetchTickets(1); // The fetch function now correctly handles replacing the data.
    }, [fetchTickets]); // The dependency array can be simplified to just this.

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
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isLoadingMore, hasMore, page, fetchTickets]);

  const groupedTransactions = useMemo(() => {
    if (!tickets) return {};

    return tickets.reduce((acc: Record<string, CasinoTransaction[]>, trx) => {
      const dateKey = format(new Date(trx.created_at), "dd/MM/yyyy");
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(trx);
      return acc;
    }, {});
  }, [tickets]);

  const { t } = useLingui();


    const {optionalSideBarOpen} = useTheme()

    return (
        <div className={cn("space-y-3 lg:h-[calc(100vh-64px)] h-[calc(100vh-44px)] container mx-auto ",{
            "lg:h-[calc(100vh-64px)] h-[calc(100vh-88px)]" : optionalSideBarOpen
        })}>
      <div className="space-y-3 h-[calc(100vh-164px)] container mx-auto">
        <div className={"h-14  flex  items-center"}>
          <div
            className={"w-10 h-full  text-black flex items-center"}
            onClick={() => navigate(-1)}
          >
            <ChevronLeftIcon className={"w-10"} />
          </div>
          <div
            className={
              "w-full  text-start text-black  text-lg pr-10 space-x-1 flex justify-start"
            }
          >
            <Trans>Casino History</Trans>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 md:gap-4 items-center md:px-0 px-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal bg-transparent text-accent-foreground"
              >
                <CalendarIcon className="sm:mr-2 -mr-1.5 px-0 size-3 lg:h-4 lg:w-4" />
                {dates.startDate
                  ? format(dates.startDate, "dd/MM/yyyy")
                  : t`Pick start date`}
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
                className="justify-start text-left font-normal px-0 bg-transparent text-accent-foreground"
              >
                <CalendarIcon className="sm:mr-2 -mr-1.5 px-0 size-3 lg:h-4 lg:w-4" />
                {dates.endDate
                  ? format(dates.endDate, "dd/MM/yyyy")
                  : t`Pick end date`}
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
              value={selectedCurrencies[0] ?? ""}
              onValueChange={(val) => setSelectedCurrencies(val ? [val] : [])}
            >
              <SelectTrigger className="w-full placeholder:text-background text-background">
                <SelectValue placeholder={t`All currencies`} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {currencyOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <DateFilter
          selected={selectedDateFilter}
          onSelect={handleDateFilterSelect}
        />

          <div ref={containerRef} className={cn("overflow-y-auto no-scrollbar h-[calc(100vh-214px)] lg:h-[calc(100vh-236px)]",
              { "h-[calc(100vh-258px)] lg:h-[calc(100vh-180px)]": optionalSideBarOpen }
          )}>
          <Table className="text-accent-foreground">
            <TableHeader className="bg-black/10 h-8">
              <TableRow>
                <TableHead className="h-8">
                  <Trans>Time (Bet ID)</Trans>
                </TableHead>
                <TableHead className="h-8">
                  <Trans>Bet Amount (Game)</Trans>
                </TableHead>
                <TableHead className="h-8 text-right">
                  <Trans>Status</Trans>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!isLoading && (error || tickets.length === 0) ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-4 text-accent-foreground"
                  >
                    {error ? t`No data available` : t`No history found.`}
                  </TableCell>
                </TableRow>
              ) : (
                Object.entries(groupedTransactions).map(([date, txs]) => (
                  <Fragment key={date}>
                    <TableRow className="bg-black/80 hover:bg-black/80 text-white h-[30px]">
                      <TableCell colSpan={5} className="py-0">
                        {date}
                      </TableCell>
                    </TableRow>

                    {txs.map((trx) => (
                      <TableRow key={trx.id}>
                        <TableCell className="py-0 text-xs">
                          <div className="flex flex-col leading-tight">
                            <span>
                              {format(new Date(trx.created_at), "HH:mm:ss")}
                            </span>
                            <span className="text-[12px] block max-w-[110px] sm:max-w-full truncate">
                              ( {trx.id})
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="py-0">
                          <div className="flex flex-col leading-tight">
                            <span>
                              {Number(trx.details.bet.amount).toFixed(2)}{" "}
                              {currencyList[trx.currency].symbol_native}
                            </span>
                            <span className="text-[11px] block max-w-[100px] sm:max-w-full truncate">
                              ({trx.game_name})
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="flex justify-end lg:max-w-full max-w-[90px] items-center gap-2">
                          {Number(trx.details.win?.amount) > 0 ? (
                            <>
                              <span className={'text-xs'}>
                                {" "}
                                <Trans>Won</Trans> {trx.details.win.amount}{" "}
                                {currencyList[trx.currency].symbol_native}
                              </span>
                              <span className="w-3 h-3 shrink-0 rounded-full bg-green-500 inline-block" />
                            </>
                          ) : (
                            <>
                              <span>
                                <Trans>Lost</Trans>
                              </span>
                              <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </Fragment>
                ))
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
                  <TableCell
                    colSpan={3}
                    className="text-center text-sm text-muted-foreground py-4"
                  >
                    <Trans>You've reached the end of the list.</Trans>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
