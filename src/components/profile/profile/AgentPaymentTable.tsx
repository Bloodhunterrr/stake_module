import { format } from "date-fns";
import type { User } from "@/types/auth";
import { CalendarIcon } from "lucide-react";
import { useAppSelector } from "@/hooks/rtk";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { currencyList } from "@/utils/currencyList";
import { formatDateToDMY } from "@/utils/formatDate";
import { Trans, useLingui } from "@lingui/react/macro";
import CloseIcon from "@/assets/icons/close.svg?react";
import Loading from "@/components/shared/v2/loading.tsx";
import type { Transaction } from "@/types/transactionHistory";
import { useEffect, useState, useMemo, Fragment } from "react";
import CheckMarkIcon from "@/assets/icons/check-mark.svg?react";
import PaginationComponent from "@/components/shared/v2/pagination";
import { useGetTransactionHistoryMutation } from "@/services/authApi";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AgentPaymentTable = () => {
    const user: User = useAppSelector((state) => state.auth?.user);

    const [dates, setDates] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
        endDate: new Date(),
    });

    const [page, setPage] = useState(1);
    const [selectedCurrencies, setSelectedCurrencies] = useState<string>('');
    const [selectedTransactionTypes, setSelectedTransactionTypes] = useState<string[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined);

    const [fetchData, {data, isLoading, error}] =
        useGetTransactionHistoryMutation();

    const currencyOptions = user?.wallets.map((w) => ({
        value: w.slug.toUpperCase(),
        label: w.slug.toUpperCase(),
    }));

    const transactionTypeOptions = [
        {value: null, label: "All"},
        {value: "withdraw", label: "Withdraw"},
        {value: "deposit", label: "Deposit"},
    ];

    useEffect(() => {
        if (!user) return;
        fetchData({
            start_date: formatDateToDMY(dates.startDate),
            end_date: formatDateToDMY(dates.endDate),
            currencies: selectedCurrencies.length > 0 ? [selectedCurrencies] : undefined,
            action: selectedTransactionTypes.length > 0 ? selectedTransactionTypes : undefined,
            user_id: selectedUserId ?? undefined,
            page,
        });
    }, [page, selectedTransactionTypes, selectedCurrencies, dates, selectedUserId]);

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

    const {t} = useLingui();

    return (
        <div className="flex flex-row max-[920px]:flex-col gap-6 w-full my-6">
            <div className="sticky max-w-full min-w-[180px] h-max top-[20px] p-3 flex flex-col gap-2 bg-[var(--grey-700)] rounded-[8px] text-[var(--grey-100)]">
                <div className={'min-[920px]:w-full flex flex-row min-[920px]:flex-col gap-2 items-center justify-evenly'}>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline"
                                className="justify-start w-1/3 min-[920px]:w-full h-8 text-left font-normal rounded-sm border-[var(--grey-400)] bg-transparent hover:bg-[var(--grey-900)] text-white hover:text-white">
                                <CalendarIcon className="sm:mr-2 sm:ml-0 -mr-1 -ml-2 h-4 w-4 " />
                                {format(dates.startDate, "dd/MM/yyyy")}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 bg-white z-[100]">
                            <Calendar className="w-full" mode="single"
                                selected={dates.startDate}
                                onSelect={(date) =>
                                    date && setDates((prev) => ({...prev, startDate: date}))
                                }/>
                        </PopoverContent>
                    </Popover>
                    <Popover>

                        <PopoverTrigger asChild>
                            <Button variant="outline"
                                className="justify-start w-1/3 min-[920px]:w-full h-8 text-left font-normal rounded-sm border-[var(--grey-400)] bg-transparent hover:bg-[var(--grey-900)] text-white hover:text-white">
                                <CalendarIcon className="sm:mr-2 sm:ml-0 -mr-1 -ml-2 h-4 w-4" />
                                {format(dates.endDate, "dd/MM/yyyy")}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 bg-white z-[100]">
                            <Calendar className="w-full" mode="single"
                                selected={dates.endDate}
                                onSelect={(date) =>
                                    date && setDates((prev) => ({...prev, endDate: date}))
                                }/>
                        </PopoverContent>
                    </Popover>

                    <Select value={selectedCurrencies}
                        onValueChange={(value: string) => {
                            setSelectedCurrencies(value);
                            setPage(1);
                        }}>
                        <SelectTrigger
                            className={"h-8! w-1/4 min-[920px]:w-full rounded-xs bg-transparent hover:bg-[var(--grey-900)] data-[placeholder]:text-white placeholder:text-white border-none text-white font-semibold"}>
                            <SelectValue placeholder={t`Currencies`}/>
                        </SelectTrigger>
                        <SelectContent className={"border-none bg-[var(--grey-900)] rounded-md"}>
                            {currencyOptions?.map((currency, index) => (
                                <SelectItem key={index} className={'focus:text-background text-accent rounded-none'} value={currency.label}>
                                    {currency.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className={"min-[920px]:w-full flex flex-row min-[920px]:flex-col items-center justify-between gap-2"}>
                    <Select value={selectedTransactionTypes[0] ?? ""}
                        onValueChange={(val: string) => {
                            setSelectedTransactionTypes(val !== 'null' ? [val] : []);
                            setPage(1);
                        }}>
                        <SelectTrigger className={"h-8! w-1/2 min-[920px]:w-full rounded-xs py-0 bg-transparent hover:bg-[var(--grey-900)] data-[placeholder]:text-white placeholder:text-white border-none text-white font-semibold"}>
                            <SelectValue placeholder={t`All Actions`}/>
                        </SelectTrigger>
                        <SelectContent className="border-none bg-[var(--grey-900)] rounded-md">
                            {transactionTypeOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value ?? 'null'}
                                            className={'focus:text-background text-accent rounded-none'}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={selectedUserId !== undefined ? String(selectedUserId) : "all"}
                        onValueChange={(val) => {
                            setSelectedUserId(val === "all" ? undefined : Number(val));
                            setPage(1);
                        }}>
                        <SelectTrigger
                            className={"h-8! w-1/2 min-[920px]:w-full rounded-xs py-0 bg-transparent hover:bg-[var(--grey-900)] data-[placeholder]:text-white placeholder:text-white border-none text-white font-semibold"}>
                            <SelectValue placeholder={t`All Users`}/>
                        </SelectTrigger>
                        <SelectContent className="border-none bg-[var(--grey-900)] rounded-md">
                            {/* Use a unique, non-empty string for the "All Users" value */}
                            <SelectItem value="all" className={'focus:text-background text-accent rounded-none'}>
                                <Trans>All Users</Trans>
                            </SelectItem>
                            {data?.users?.map((u) => (
                                <SelectItem key={u.id} value={String(u.id)} className={'focus:text-background text-accent rounded-none'}>
                                    {u.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

            </div>
            <div className="flex flex-col w-full">
                <div className={'rounded-[8px] p-6 bg-[var(--grey-700)] w-full h-full'}>
                    <div className={'flex cursor-pointer flex-col py-3 px-4 rounded-[8px] border border-[color:var(--grey-400)] bg-[var(--grey-600)] border-solid'}>
                        <Table className="bg-transparent text-white w-full">
                            <TableHeader className="w-full">
                                <TableRow className={"text-md font-bold text-center !min-w-full w-full h-10 !bg-[var(--grey-600)] !text-[var(--grey-200)] border-none px-1"}>
                                    <TableHead className="w-[25%] h-full !text-[var(--grey-200)] text-center">
                                        <Trans>Time</Trans>
                                    </TableHead>
                                    <TableHead className="w-[25%] h-full !text-[var(--grey-200)] text-center">
                                        <Trans>Amount</Trans>
                                    </TableHead>
                                    <TableHead className="w-[25%] h-full !text-[var(--grey-200)] text-center">
                                        <Trans>Note</Trans>
                                    </TableHead>
                                    <TableHead className="w-[25%] h-full !text-[var(--grey-200)] text-center">
                                        <Trans>Status</Trans>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody className={'cursor-pointer border-none bg-transparent text-white'}>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-4">
                                            <Loading/>
                                        </TableCell>
                                    </TableRow>
                                ) : error || data?.transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-4 text-destructive">
                                            {error ? t`No data available` : t`No history found.`}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    Object.entries(groupedTransactions).map(([date, txs]) => (
                                        <Fragment key={date}>
                                            <TableRow className="text-md w-full bg-[var(--grey-900)] text-white px-1 h-10 border-b border-b-[var(--grey-400)] hover:bg-[var(--grey-900)]">
                                                <TableCell colSpan={4} className="py-0 px-2 font-medium">
                                                    {date}
                                                </TableCell>
                                            </TableRow>

                                            {txs.map((trx) => {
                                                return (
                                                    <TableRow key={trx.id} className={'text-sm text-center h-10 px-1 border-b-[var(--grey-300)] hover:bg-transparent'}>
                                                        <TableCell className={'w-[25%] h-full'}>
                                                            {format(new Date(trx.created_at), "HH:mm")}
                                                        </TableCell>
                                                        <TableCell className={'w-[25%] h-full'}>
                                                            {trx.amount} {currencyList[trx.currency].symbol_native}
                                                        </TableCell>
                                                        <TableCell className="w-[25%] h-full">
                                                            {trx.note}
                                                        </TableCell>
                                                        <TableCell className="w-[25%] h-full">
                                                            {trx.confirmed ? (
                                                                <CheckMarkIcon className="text-green-600 animate-pulse size-5 mx-auto"/>
                                                            ) : (
                                                                <CloseIcon className="text-red-600 animate-pulse size-5 mx-auto"/>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </Fragment>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        {data && data.transactions.length > 0 && (
                            <div className="flex flex-col gap-y-1 justify-between items-center bg-[var(--grey-700)] px-2 pb-3 pt-1 text-white mt-2">
                                {/* Total Deposit row */}
                                <div className="flex flex-row py-2 justify-between w-full border-b border-b-[var(--grey-300)]">
                                    <span className="font-bold">
                                        <Trans>
                                            Total Deposit:
                                        </Trans>
                                    </span>
                                    <span>{data.summary.total_deposit.toFixed(2)}</span>
                                </div>

                                {/* Total Withdrawal row */}
                                <div className="flex flex-row justify-between w-full py-2 border-b border-b-[var(--grey-300)]">
                                    <span className="font-bold">
                                        <Trans>
                                            Total Withdrawal:
                                        </Trans>
                                    </span>
                                    <span>{data.summary.total_withdraw.toFixed(2)}</span>
                                </div>

                                {/* Total row */}
                                <div className="flex flex-row justify-between w-full">
                                    <span className="font-bold">
                                        <Trans>
                                            Total:
                                        </Trans>
                                    </span>
                                    <span>
                                        {(data.summary.total_deposit - data.summary.total_withdraw).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {data && data.transactions.length > 0 && (
                    <div className="p-4">
                        <PaginationComponent
                            totalPages={data.pagination.last_page}
                            currentPage={page}
                            setPage={setPage}/>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentPaymentTable;