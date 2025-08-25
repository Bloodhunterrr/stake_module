import { useEffect, useState } from "react";
import { useGetTransactionHistoryMutation } from "@/services/authApi";
import { formatDateToDMY, formatDate } from "@/utils/formatDate";
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
import Loading from "@/components/shared/loading";
import { useAppSelector } from "@/hooks/rtk";
import type { User } from "@/types/auth";
import { MultiSelect } from "@/components/ui/multi-select";

const PaymentsHistoryTable = () => {
  const user: User = useAppSelector((state) => state.auth?.user);

  const [dates, setDates] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(),
  });

  const [page, setPage] = useState(1);
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
  const [selectedTransactionTypes, setSelectedTransactionTypes] = useState<
    string[]
  >([]);

  const [fetchData, { data, isLoading, error }] =
    useGetTransactionHistoryMutation();

  const currencyOptions = user?.wallets.map((w) => ({
    value: w.slug.toUpperCase(),
    label: w.slug.toUpperCase(),
  }));

  const transactionTypeOptions = [
    { value: "withdraw", label: "Withdraw" },
    { value: "deposit", label: "Deposit" },
  ];

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
      currencies:
        selectedCurrencies.length > 0 ? selectedCurrencies : undefined,
      action:
        selectedTransactionTypes.length > 0
          ? selectedTransactionTypes
          : undefined,
      page,
    });
  }, [page, selectedTransactionTypes, selectedCurrencies, dates]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center px-0">
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

        <MultiSelect
          options={currencyOptions}
          value={selectedCurrencies}
          onValueChange={(values: string[]) => setSelectedCurrencies(values)}
          placeholder="All currencies"
          hideSelectAll={true}
        />

        <MultiSelect
          options={transactionTypeOptions}
          value={selectedTransactionTypes}
          onValueChange={(values: string[]) =>
            setSelectedTransactionTypes(values)
          }
          placeholder="All Actions"
          hideSelectAll={true}
        />

      </div>

      {isLoading ? (
        <Loading />
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
