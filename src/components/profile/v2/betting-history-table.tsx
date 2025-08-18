import { useEffect, useState } from "react";
import { formatDateToDMY, formatDate } from "@/utils/formatDate";
import type { Ticket } from "@/types/sportHistory";
import { LoaderSpinner } from "@/components/shared/Loader";
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

const TicketStatuses = (status: number) => {
  switch (status) {
    case 0:
      return "Pending";
    case 1:
      return "Lost";
    case 3:
      return "Won";
    case 4:
      return "Returned";
    default:
      return "-";
  }
};

const getBadgeClass = (status: number) => {
  switch (status) {
    case 0:
      return "bg-yellow-100 text-yellow-800";
    case 1:
      return "bg-red-100 text-red-800";
    case 3:
      return "bg-green-100 text-green-800";
    case 4:
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const BettingHistoryTable = () => {
  const [page, setPage] = useState(1);
  const [dates, setDates] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(),
  });

  const [fetchData, { data, isLoading, error }] = useGetSportHistoryMutation();

  useEffect(() => {
    fetchData({
      start_date: formatDateToDMY(dates.startDate),
      end_date: formatDateToDMY(dates.endDate),
      page: 1,
    });
  }, []);

  useEffect(() => {
    fetchData({
      start_date: formatDateToDMY(dates.startDate),
      end_date: formatDateToDMY(dates.endDate),
      currencies: undefined,
      status: undefined,
      page,
    });
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center px-8">
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

        <Button
          className="w-full bg-card text-accent-foreground hover:bg-card/70 cursor-pointer"
          onClick={() => {
            setPage(1);
            fetchData({
              start_date: formatDateToDMY(dates.startDate),
              end_date: formatDateToDMY(dates.endDate),
              currencies: undefined,
              status: undefined,
              page: 1,
            });
          }}
        >
          Filter
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-10">
          <LoaderSpinner />
        </div>
      ) : error ? (
        <p className="text-center">
          Something wrong happened. Try again later!
        </p>
      ) : (
        <>
          <Table className="text-accent-foreground">
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Bet ID</TableHead>
                <TableHead>Bet Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Bet Amount</TableHead>
                <TableHead>Win Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.tickets.map((ticket: Ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>
                    {formatDate(new Date(ticket.created_date))}
                  </TableCell>
                  <TableCell>{ticket.id}</TableCell>
                  <TableCell>{ticket.betID}</TableCell>
                  <TableCell>
                    {ticket.bet_type}
                    {ticket.bet_type === "multiple" &&
                      ` (${ticket.details.odds.length})`}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getBadgeClass(
                        ticket.status
                      )}`}
                    >
                      {TicketStatuses(ticket.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {ticket.bet_sum}{" "}
                    {currencyList[ticket.currency]?.symbol_native}
                  </TableCell>
                  <TableCell>
                    {ticket.win_sum}{" "}
                    {currencyList[ticket.currency]?.symbol_native}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {data && (
            <div className="p-4">
              <PaginationComponent
                totalPages={data.pagination.last_page}
                currentPage={page}
                setPage={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BettingHistoryTable;
