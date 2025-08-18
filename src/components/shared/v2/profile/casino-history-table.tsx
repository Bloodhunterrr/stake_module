import type { User } from "@/types/auth";
import { useAppSelector } from "@/hooks/rtk";
import { useEffect, useState } from "react";
import { useGetCasinoHistoryMutation } from "@/services/authApi";
import { formatDateToDMY, formatDate } from "@/utils/formatDate";
import { currencyList } from "@/utils/currencyList";
import { toast } from "react-toastify";

import NoDataAvailable from "@/components/shared/no-data-available/NoDataAvailable";
import Pagination from "@/components/shared/table-pagination/TablePagination";
import { LoaderSpinner } from "@/components/shared/Loader";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { CasinoTransaction } from "@/types/casinoHistory";

const CasinoHistoryTable = () => {
  const user: User = useAppSelector((state) => state.auth?.user);

  const [dates, setDates] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(),
  });

  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const [fetchData, { data, isLoading, error }] = useGetCasinoHistoryMutation();

  useEffect(() => {
    fetchData({
      start_date: formatDateToDMY(dates.startDate),
      end_date: formatDateToDMY(dates.endDate),
      currencies:
        selectedCurrencies.length > 0 ? selectedCurrencies : undefined,
      page,
    });
  }, [dates, selectedCurrencies, page, fetchData]);

  const handleCopy = (trx: CasinoTransaction) => {
    const formattedText = `
ID: ${trx.id}
Game Name: ${trx.game_name}
Game ID: ${trx.game_id}
Bet Amount: ${trx.details.bet.amount}
Win Amount: ${trx.details.win.amount}
Date: ${formatDate(new Date(trx.created_at))}
`.trim();

    navigator.clipboard
      .writeText(formattedText)
      .then(() => toast.success("Details copied to clipboard"))
      .catch(() => toast.error("Failed to copy"));
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex justify-center p-10">
          <LoaderSpinner />
        </div>
      ) : error ? (
        <NoDataAvailable
          info={
            "data" in error
              ? (error.data as { message?: string })?.message ??
                "Something wrong happened. Try again later!"
              : "Something wrong happened. Try again later!"
          }
        />
      ) : data?.transactions.length === 0 ? (
        <NoDataAvailable info="No spins history found." />
      ) : (
        <>
          {" "}
          <Table className="text-accent-foreground ">
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
              <Pagination
                currentPage={data.pagination.current_page}
                totalPages={data.pagination.last_page}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CasinoHistoryTable;
