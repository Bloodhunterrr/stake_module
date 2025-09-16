import { useEffect, useState, useMemo, Fragment } from "react";
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
import { CalendarIcon } from "lucide-react";
import { useAppSelector } from "@/hooks/rtk";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/v2/loading.tsx";
import { Calendar } from "@/components/ui/calendar";
import { currencyList } from "@/utils/currencyList";
import { formatDateToDMY } from "@/utils/formatDate";
import { Trans, useLingui } from "@lingui/react/macro";
import CloseIcon from "@/assets/icons/close.svg?react";
import DateFilter from "@/components/shared/v2/date-filter";
import type { Transaction } from "@/types/transactionHistory";
import CheckMarkIcon from "@/assets/icons/check-mark.svg?react";
import PaginationComponent from "@/components/shared/v2/pagination";
import { useGetTransactionHistoryMutation } from "@/services/authApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("");

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

  const handleDateFilterSelect = (start: Date, end: Date, label: string) => {
    setDates({ startDate: start, endDate: end });
    setSelectedDateFilter(label);
    setPage(1);
  };

  useEffect(() => {
    if (!user) return;
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

  const groupedTransactions = useMemo(() => {
    if (!data?.transactions) return {};
    return data.transactions.reduce(
      (acc: Record<string, Transaction[]>, trx) => {
        const dateKey = format(new Date(trx.created_at), "dd/MM/yyyy");
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(trx);
        return acc;
      },
      {}
    );
  }, [data?.transactions]);

  const { t } = useLingui();

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
              <CalendarIcon className="sm:mr-2 h-4 w-4" />
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

        <Select
          value={selectedTransactionTypes[0] ?? ""}
          onValueChange={(val: string) =>
            setSelectedTransactionTypes(val ? [val] : [])
          }
        >
                     <SelectTrigger className="w-full placeholder:text-background text-background">

            <SelectValue placeholder={t`All Actions`} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {transactionTypeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DateFilter
        selected={selectedDateFilter}
        onSelect={handleDateFilterSelect}
      />

      <Table className="text-accent-foreground">
        <TableHeader className="bg-black/10 h-8">
          <TableRow>
            <TableHead className="h-8">
              <Trans>Time</Trans>
            </TableHead>
            <TableHead className="h-8">
              <Trans>ID</Trans>
            </TableHead>
            <TableHead className="h-8">
              <Trans>Amount</Trans>
            </TableHead>
            <TableHead className="h-8 text-center">
              <Trans>Action</Trans>
            </TableHead>
            <TableHead className="h-8 text-center">
              <Trans>Status</Trans>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                <Loading />
              </TableCell>
            </TableRow>
          ) : error || data?.transactions.length === 0 ? (
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
                  <TableCell colSpan={6} className="py-0 px-2 font-medium">
                    {date}
                  </TableCell>
                </TableRow>

                {txs.map((trx) => (
                  <TableRow key={trx.id}>
                    <TableCell>
                      {format(new Date(trx.created_at), "HH:mm")}
                    </TableCell>
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
                        {trx.type.includes("deposit") ? (
                          <Trans>DEPOSIT</Trans>
                        ) : trx.type.includes("withdraw") ? (
                          <Trans>WITHDRAW</Trans>
                        ) : (
                          trx.type.toUpperCase()
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="flex justify-center">
                      {trx.confirmed ? (
                        <CheckMarkIcon className="text-green-600 size-5" />
                      ) : (
                        <CloseIcon className="text-red-600 size-5" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </Fragment>
            ))
          )}
        </TableBody>
      </Table>

      {data && data.transactions.length > 0 && (
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

export default PaymentsHistoryTable;
