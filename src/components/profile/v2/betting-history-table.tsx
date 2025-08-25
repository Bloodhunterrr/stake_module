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
import Loading from "@/components/shared/loading";
import { useAppSelector } from "@/hooks/rtk";
import type { User } from "@/types/auth";
import { MultiSelect } from "@/components/ui/multi-select";

const BettingHistoryTable = () => {
  const user: User = useAppSelector((state) => state.auth?.user);

  const [page, setPage] = useState(1);
  const [dates, setDates] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(),
  });
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

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

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 items-center  px-4 md:px-0">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start text-left font-normal bg-transparent text-accent-foreground"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dates.startDate
                ? format(dates.startDate, "dd/MM/yyyy")
                : "Pick start date"}
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
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dates.endDate
                ? format(dates.endDate, "dd/MM/yyyy")
                : "Pick end date"}
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
          <MultiSelect
            options={currencyOptions}
            value={selectedCurrencies}
            onValueChange={setSelectedCurrencies}
            placeholder="All currencies"
            hideSelectAll
          />
        )}

        <MultiSelect
          options={statusOptions}
          value={selectedStatuses}
          onValueChange={setSelectedStatuses}
          placeholder="All statuses"
          hideSelectAll
        />
      </div>

      <Table className="text-accent-foreground">
        <TableHeader>
          <TableRow>
            <TableHead>Bet Amount (Bet ID)</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
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
                {error ? "No data available" : "No history found."}
              </TableCell>
            </TableRow>
          ) : (
            Object.entries(groupedTickets).map(([date, tickets]) => (
              <Fragment key={date}>
                <TableRow className="bg-black/80 hover:bg-black/80 text-white">
                  <TableCell colSpan={3}>{date}</TableCell>
                </TableRow>

                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="py-0">
                      <div className="flex flex-col leading-tight">
                        <span>
                          {Number(ticket.bet_sum).toFixed(2)}{" "}
                          {currencyList[ticket.currency]?.symbol_native}
                        </span>
                        <span className="text-[12px]">({ticket.betID})</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      {format(new Date(ticket.created_date), "HH:mm:ss")}
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      {ticket.status === 3 ? (
                        <>
                          {`Win ${Number(ticket.win_sum).toFixed(2)} ${
                            currencyList[ticket.currency]?.symbol_native
                          }`}
                          <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        </>
                      ) : (
                        <>
                          Lost
                          <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </Fragment>
            ))
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
