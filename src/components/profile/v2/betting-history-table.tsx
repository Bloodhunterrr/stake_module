import { useEffect, useState, useMemo, Fragment } from "react";
import { formatDateToDMY } from "@/utils/formatDate";
import { currencyList } from "@/utils/currencyList";
import { useGetSportHistoryMutation } from "@/services/authApi";
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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import Loading from "@/components/shared/v2/loading.tsx";
import { useAppSelector } from "@/hooks/rtk";
import type { User } from "@/types/auth";
import { Trans, useLingui } from "@lingui/react/macro";
import type { Odd } from "@/types/sportHistory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BettingHistoryTable = () => {
  const user: User = useAppSelector((state) => state.auth?.user);

  const [page, setPage] = useState(1);
  const [dates, setDates] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(),
  });
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [expandedTicketId, setExpandedTicketId] = useState<number | null>(null);

  const [fetchData, { data, isLoading, error }] = useGetSportHistoryMutation();

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

  useEffect(() => {
    fetchData({
      start_date: formatDateToDMY(dates.startDate),
      end_date: formatDateToDMY(dates.endDate),
      currencies:
        selectedCurrencies.length > 0 ? selectedCurrencies : undefined,
      status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      page,
    });
  }, [page, selectedStatuses, selectedCurrencies, dates]);

  const groupedTickets = useMemo(() => {
    if (!data?.tickets) return {};
    return data.tickets.reduce(
      (acc: Record<string, typeof data.tickets>, ticket) => {
        const dateKey = format(new Date(ticket.created_date), "dd/MM/yyyy");
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(ticket);
        return acc;
      },
      {}
    );
  }, [data?.tickets]);

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
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 items-center px-4 md:px-0">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start text-left font-normal bg-transparent text-accent-foreground"
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
              className="justify-start text-left font-normal bg-transparent text-accent-foreground"
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
                <SelectItem key={opt.value} value={opt.value} >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select
          value={selectedStatuses[0] ?? ""}
          onValueChange={(val) => setSelectedStatuses(val ? [val] : [])}
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
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
                <Loading />
              </TableCell>
            </TableRow>
          ) : error || !data?.tickets?.length ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
                {error ? t`No data available` : t`No history found.`}
              </TableCell>
            </TableRow>
          ) : (
            Object.entries(groupedTickets).map(([date, tickets]) => {
              return (
                <Fragment key={date}>
                  <TableRow className="bg-black/80 hover:bg-black/80 text-white">
                    <TableCell colSpan={3}>{date}</TableCell>
                  </TableRow>

                  {tickets.map((ticket) => {
                    console.log(ticket);
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
                                          {formatTimestamp(ticket.created_date)}
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
        </TableBody>
      </Table>

      {data && data.tickets.length > 0 && (
        <div className="p-4">
          <PaginationComponent
            totalPages={data.pagination.last_page}
            currentPage={page}
            setPage={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default BettingHistoryTable;
