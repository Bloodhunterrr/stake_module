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
import { Trans, useLingui } from "@lingui/react/macro";
import { MultiSelect } from "@/components/ui/multi-select";
import DateFilter from "@/components/shared/v2/date-filter";
import type { CasinoTransaction } from "@/types/casinoHistory";
import { useGetCasinoHistoryMutation } from "@/services/authApi";
import PaginationComponent from "@/components/shared/v2/pagination";

export default function CasinoHistoryTable() {
  const user: User = useAppSelector((state) => state.auth?.user);

  const [dates, setDates] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(),
  });

  const [page, setPage] = useState(1);
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("");

  const handleDateFilterSelect = (start: Date, end: Date, label: string) => {
    setDates({ startDate: start, endDate: end });
    setSelectedDateFilter(label);
    setPage(1);
  };

  const [fetchData, { data, isLoading, error }] = useGetCasinoHistoryMutation();

  const currencyOptions = user?.wallets.map((w) => ({
    value: w.slug.toUpperCase(),
    label: w.slug.toUpperCase(),
  }));

  useEffect(() => {
    fetchData({
      start_date: format(dates.startDate, "dd-MM-yyyy"),
      end_date: format(dates.endDate, "dd-MM-yyyy"),
      currencies:
        selectedCurrencies.length > 0 ? selectedCurrencies : undefined,
      page,
    });
  }, [dates, selectedCurrencies, page]);

  const groupedTransactions = useMemo(() => {
    if (!data?.transactions) return {};

    return data.transactions.reduce(
      (acc: Record<string, CasinoTransaction[]>, trx) => {
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
      <div className="grid grid-cols-3 gap-2 md:gap-4 items-center md:px-0 px-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start text-left font-normal bg-transparent text-accent-foreground"
            >
              <CalendarIcon className="sm:mr-2 h-4 w-4" />
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
              className="justify-start text-left font-normal bg-transparent text-accent-foreground"
            >
              <CalendarIcon className="sm:mr-2 h-4 w-4" />
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
          <MultiSelect
            options={currencyOptions}
            value={selectedCurrencies}
            onValueChange={(values: string[]) => setSelectedCurrencies(values)}
            placeholder={t`All currencies`}
            hideSelectAll={true}
          />
        )}
      </div>

      <DateFilter
        selected={selectedDateFilter}
        onSelect={handleDateFilterSelect}
      />

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
                  <TableCell colSpan={5} className="py-0">
                    {date}
                  </TableCell>
                </TableRow>

                {txs.map((trx) => (
                  <TableRow key={trx.id}>
                    <TableCell className="py-0">
                      <div className="flex flex-col leading-tight">
                        <span>
                          {format(new Date(trx.created_at), "HH:mm:ss")}
                        </span>
                        <span className="text-[12px] block max-w-[170px] sm:max-w-full truncate">
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
                        <span className="text-[12px] block max-w-[170px] sm:max-w-full truncate">
                          ({trx.game_name})
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="flex justify-end items-center gap-2">
                      {Number(trx.details.win?.amount) > 0 ? (
                        <>
                          <span>  <Trans>Won</Trans> {" "}
                            {trx.details.win.amount}{" "}
                            {currencyList[trx.currency].symbol_native}
                          </span>
                          <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                        </>
                      ) : (
                        <>
                          <span>Lost</span>
                          <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
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
}
