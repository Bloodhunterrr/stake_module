import { useEffect, useState } from "react";
import { useGetTransactionHistoryMutation } from "@/services/authApi";
import { formatDateToDMY, formatDate } from "@/utils/formatDate";
import { LoaderSpinner } from "@/components/shared/Loader";
import { currencyList } from "@/utils/currencyList";
import type { Transaction } from "@/types/transactionHistory";

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

import CheckMarkIcon from "@/assets/icons/check-mark.svg?react";
import CloseIcon from "@/assets/icons/close.svg?react";

const PaymentsHistoryTable = () => {
  const [dates, setDates] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(),
  });

  const [page, setPage] = useState(1);

  const [fetchData, { data, isLoading, error }] =
    useGetTransactionHistoryMutation();

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
        action: undefined,
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
              action: undefined,
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
        <p className="text-accent-foreground text-center">
          Something wrong happened. Try again later!
        </p>
      ) : data?.transactions.length === 0 ? (
        <p className="text-accent-foreground text-center">No data available</p>
      ) : (
        <>
          <Table className="text-accent-foreground">
            <TableHeader className="bg-black/10 h-8">
              <TableRow>
                <TableHead className="h-8">Date & Time</TableHead>
                <TableHead className="h-8">ID</TableHead>
                <TableHead className="h-8">Amount</TableHead>
                <TableHead className="h-8 text-center">Action</TableHead>
                <TableHead className="h-8 text-center">Confirmed</TableHead>
                <TableHead className="h-8 text-center">Cancelled</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.transactions.map((trx: Transaction) => (
                <TableRow key={trx.id}>
                  <TableCell>{formatDate(new Date(trx.created_at))}</TableCell>
                  <TableCell>{trx.id}</TableCell>
                  <TableCell>
                    {trx.amount} {currencyList[trx.currency].symbol_native}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        trx.type === "deposit"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {trx.type.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="flex justify-center">
                    {trx.confirmed ? (
                      <CheckMarkIcon className="text-green-600 size-5" />
                    ) : (
                      <CloseIcon className="text-gray-400 size-5" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      {trx.cancelled ? (
                        <CheckMarkIcon className="text-red-600 size-5" />
                      ) : (
                        <CloseIcon className="text-gray-400 size-5" />
                      )}
                    </div>
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

export default PaymentsHistoryTable;
