import { useEffect, useState } from "react";
import { useGetCasinoHistoryMutation } from "@/services/authApi";
import { formatDate } from "@/utils/formatDate";
import { currencyList } from "@/utils/currencyList";
import { LoaderSpinner } from "@/components/shared/Loader";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaginationComponent from "@/components/shared/v2/pagination";

import type { CasinoTransaction } from "@/types/casinoHistory";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const CasinoHistoryTable = () => {
  const [dates, setDates] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(),
  });

  const [page, setPage] = useState(1);

  const [fetchData, { data, isLoading, error }] = useGetCasinoHistoryMutation();

  useEffect(() => {
    fetchData({
      start_date: format(dates.startDate, "dd-MM-yyyy"),
      end_date: format(dates.endDate, "dd-MM-yyyy"),
      page: 1,
    });
  }, []);

  useEffect(() => {
    fetchData({
      start_date: format(dates.startDate, "dd-MM-yyyy"),
      end_date: format(dates.endDate, "dd-MM-yyyy"),
      currencies: undefined,
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
              start_date: format(dates.startDate, "dd-MM-yyyy"),
              end_date: format(dates.endDate, "dd-MM-yyyy"),
              currencies: undefined,
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
        <p className="text-accent-foreground text-center">No data available</p>
      ) : data?.transactions.length === 0 ? (
        <p className="text-accent-foreground text-center">
          No spins history found.
        </p>
      ) : (
        <>
          <Table className="text-accent-foreground">
            <TableHeader className="bg-black/10 h-8">
              <TableRow>
                <TableHead className="h-8">Date & Time</TableHead>
                <TableHead className="h-8">ID</TableHead>
                <TableHead className="h-8">Game</TableHead>
                <TableHead className="h-8">Game ID</TableHead>
                <TableHead className="h-8">Bet</TableHead>
                <TableHead className="h-8">Win</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.transactions.map((trx: CasinoTransaction) => (
                <TableRow key={trx.id}>
                  <TableCell>{formatDate(new Date(trx.created_at))}</TableCell>
                  <TableCell>{trx.id}</TableCell>
                  <TableCell>{trx.game_name}</TableCell>
                  <TableCell>{trx.game_id}</TableCell>
                  <TableCell>
                    {trx.details.bet.amount}{" "}
                    {currencyList[trx.currency].symbol_native}
                  </TableCell>
                  <TableCell>
                    {String(trx.details.win.amount) === "0" ? (
                      <span>-</span>
                    ) : (
                      <span>
                        {trx.details.win.amount}{" "}
                        {currencyList[trx.currency].symbol_native}
                      </span>
                    )}
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

export default CasinoHistoryTable;
