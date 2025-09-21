import {useEffect, useState, useMemo, Fragment} from "react";
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

import {format} from "date-fns";
import type {User} from "@/types/auth";
import {CalendarIcon} from "lucide-react";
import {useAppSelector} from "@/hooks/rtk";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {currencyList} from "@/utils/currencyList";
import {formatDateToDMY} from "@/utils/formatDate";
import {Trans, useLingui} from "@lingui/react/macro";
import CloseIcon from "@/assets/icons/close.svg?react";
import Loading from "@/components/shared/v2/loading.tsx";
import type {Transaction} from "@/types/transactionHistory";
import CheckMarkIcon from "@/assets/icons/check-mark.svg?react";
import PaginationComponent from "@/components/shared/v2/pagination";
import {useGetTransactionHistoryMutation} from "@/services/authApi";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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
        <div className="space-y-3">
            <div className=" gap-2 md:gap-4 items-center px-4 md:px-0">
                <div className="flex gap-2 justify-between">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="justify-start text-left font-normal bg-muted rounded-none h-8 text-accent-foreground"
                            >
                                <CalendarIcon className="sm:mr-2 sm:ml-0 -mr-1 -ml-2 h-4 w-4 "/>
                                {format(dates.startDate, "dd/MM/yyyy")}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 bg-white">
                            <Calendar
                                className="w-full"
                                mode="single"
                                selected={dates.startDate}
                                onSelect={(date) =>
                                    date && setDates((prev) => ({...prev, startDate: date}))
                                }
                            />
                        </PopoverContent>
                    </Popover>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="justify-start text-left font-normal bg-muted rounded-none h-8 text-accent-foreground"
                            >
                                <CalendarIcon className="sm:mr-2 sm:ml-0 -mr-1 -ml-2 h-4 w-4"/>
                                {format(dates.endDate, "dd/MM/yyyy")}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 bg-white">
                            <Calendar
                                className="w-full"
                                mode="single"
                                selected={dates.endDate}
                                onSelect={(date) =>
                                    date && setDates((prev) => ({...prev, endDate: date}))
                                }
                            />
                        </PopoverContent>
                    </Popover>

                    <Select
                        value={selectedCurrencies}
                        onValueChange={(value: string) => {
                            setSelectedCurrencies(value);
                            setPage(1); // Reset page on filter change
                        }}
                    >
                        <SelectTrigger
                            className={"h-8! w-full rounded-none py-0 bg-transparent hover:bg-transparent placeholder:text-white! border-none text-accent"}>
                            <SelectValue placeholder={t`Currencies`}/>
                        </SelectTrigger>
                        <SelectContent className="border-none bg-background rounded-none">
                            {currencyOptions?.map((currency, index) => (
                                <SelectItem key={index} className={'focus:text-background text-accent rounded-none'}
                                            value={currency.label}>
                                    {currency.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-2 py-1 justify-between">
                    <Select
                        value={selectedTransactionTypes[0] ?? ""}
                        onValueChange={(val: string) => {
                            setSelectedTransactionTypes(val !== 'null' ? [val] : []);
                            setPage(1);
                        }}
                    >
                        <SelectTrigger
                            className={"h-8! w-full rounded-none py-0 bg-transparent hover:bg-transparent placeholder:text-white! border-none text-accent"}>
                            <SelectValue placeholder={t`All Actions`}/>
                        </SelectTrigger>
                        <SelectContent className="border-none bg-background rounded-none">
                            {transactionTypeOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value ?? 'null'}
                                            className={'focus:text-background text-accent rounded-none'}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={selectedUserId !== undefined ? String(selectedUserId) : "all"}
                        onValueChange={(val) => {
                            setSelectedUserId(val === "all" ? undefined : Number(val));
                            setPage(1);
                        }}
                    >
                        <SelectTrigger
                            className={"h-8! w-full rounded-none py-0 bg-transparent hover:bg-transparent placeholder:text-white! border-none text-accent"}>
                            <SelectValue placeholder={t`All Users`}/>
                        </SelectTrigger>
                        <SelectContent className="border-none bg-background rounded-none">
                            {/* Use a unique, non-empty string for the "All Users" value */}
                            <SelectItem value="all" className={'focus:text-background text-accent rounded-none'}>
                                All Users
                            </SelectItem>
                            {data?.users?.map((u) => (
                                <SelectItem key={u.id} value={String(u.id)}
                                            className={'focus:text-background text-accent rounded-none'}>
                                    {u.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>


            </div>

            <div className={'p-2'}>
                <Table className="bg-popover text-accent-foreground">
                    <TableHeader className="bg-black/10 hidden h-8">
                        <TableRow>
                            <TableHead className="h-8">
                                <Trans>Time</Trans>
                            </TableHead>
                            <TableHead className="h-8">
                                <Trans>Amount</Trans>
                            </TableHead>
                            <TableHead className="h-8 text-center">
                                <Trans>Note</Trans>
                            </TableHead>
                            <TableHead className="h-8 text-center">
                                <Trans>Status</Trans>
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-4">
                                    <Loading/>
                                </TableCell>
                            </TableRow>
                        ) : error || data?.transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-4 text-accent-foreground">
                                    {error ? t`No data available` : t`No history found.`}
                                </TableCell>
                            </TableRow>
                        ) : (
                            Object.entries(groupedTransactions).map(([date, txs]) => (
                                <Fragment key={date}>
                                    <TableRow className="bg-black/80 hover:bg-black/80 text-white h-[30px]">
                                        <TableCell colSpan={4} className="py-0 px-2 font-medium">
                                            {date}
                                        </TableCell>
                                    </TableRow>

                                    {txs.map((trx) => {
                                        return (
                                            <TableRow key={trx.id}
                                                      className={'hover:bg-transparent text-accent text-xs border-b-destructive/80'}>
                                                <TableCell>
                                                    {format(new Date(trx.created_at), "HH:mm")}
                                                </TableCell>
                                                <TableCell className={'text-end'}>
                                                    {trx.amount} {currencyList[trx.currency].symbol_native}
                                                </TableCell>
                                                <TableCell className="text-start text-card">
                                                    {trx.note}
                                                </TableCell>
                                                <TableCell className="flex justify-center">
                                                    {trx.confirmed ? (
                                                        <CheckMarkIcon className="text-green-600 size-5"/>
                                                    ) : (
                                                        <CloseIcon className="text-red-600 size-5"/>
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
                    <div className="flex flex-col justify-between items-center bg-black/10 p-4 text-white">
                        {/* Total Deposit row */}
                        <div className="flex flex-row justify-between w-full">
                            <span className="font-bold">
                              <Trans>Total Deposit:</Trans>
                            </span>
                            <span>{data.summary.total_deposit}</span>
                        </div>

                        {/* Total Withdrawal row */}
                        <div className="flex flex-row justify-between w-full">
                            <span className="font-bold">
                              <Trans>Total Withdrawal:</Trans>
                            </span>
                            <span>{data.summary.total_withdraw}</span>
                        </div>

                        {/* Total row */}
                        <div className="flex flex-row justify-between w-full">
                            <span className="font-bold">
                              <Trans>Total:</Trans>
                            </span>
                            <span>
                              {data.summary.total_deposit - data.summary.total_withdraw}
                            </span>
                        </div>
                    </div>
                )}
            </div>

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

export default AgentPaymentTable;