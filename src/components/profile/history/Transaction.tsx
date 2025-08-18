import type { User, Wallet } from "@/types/auth";
import DateRangePicker from "@/components/shared/date-picker-range/DatePickerRange";
import MultiSelect from "@/components/shared/multiselect/MultiSelect";
import { useAppSelector } from "@/hooks/rtk";

import { useEffect, useState } from "react";
import WalletIcon  from '@/assets/icons/wallet.svg?react';
import ListIcon  from '@/assets/icons/list.svg?react';
import CalendarIcon  from '@/assets/icons/calendar.svg?react';
import DocumentIcon  from '@/assets/icons/document.svg?react';
import CrownIcon  from '@/assets/icons/crown.svg?react';
import ClipBoardIcon  from '@/assets/icons/clip-board.svg?react';
import CheckMarkIcon  from '@/assets/icons/check-mark.svg?react';
import CloseIcon  from '@/assets/icons/close.svg?react';

import { useGetTransactionHistoryMutation } from "@/services/authApi";
import NoDataAvailable from "@/components/shared/v2/no-data-available/NoDataAvailable";
import { formatDateToDMY, formatDate } from "@/utils/formatDate";
import Pagination from "@/components/shared/table-pagination/TablePagination";
import { LoaderSpinner } from "@/components/shared/Loader";
import { toast } from "react-toastify";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { currencyList } from "@/utils/currencyList";
import type {Transaction} from "@/types/transactionHistory";

const TransactionHistory = () => {
    ;
    const isDesktop = useIsDesktop()

    const user: User = useAppSelector(state => state.auth?.user)

    const [dates, setDates] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
        endDate: new Date(),
    });

    const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([])
    const [page, setPage] = useState(1);

    const handleCopy = (trx: Transaction) => {
        const formattedText = `
ID: ${trx.id}
AMOUNT: ${trx.amount}
ACTION: ${trx.type}
CONFIRMED: ${trx.confirmed}
CANCELLED: ${trx.cancelled}
`.trim();

        navigator.clipboard.writeText(formattedText)
            .then(() => toast.success(('Details copied to clipboard')))
            .catch(() => toast.error(('Failed to copy')));
    };

    const handleDatesChange = (range: { startDate: Date | null; endDate: Date | null }) => {
        if (range.startDate && range.endDate) {
            setDates({
                startDate: range.startDate,
                endDate: range.endDate
            });
        }
    };

    const currencyOptions = user?.wallets.map((w: Wallet) => ({ value: w.slug.toUpperCase(), label: w.slug.toUpperCase() }))

    const trxTypeOptions = [
        {
            value: 'deposit',
            label: ('Deposit')
        },
        {
            value: 'withdraw',
            label: ('Withdraw')
        }
    ]

    const [fetchData, { data, isLoading, error }] = useGetTransactionHistoryMutation();

    useEffect(() => {
            fetchData({
                start_date: formatDateToDMY(dates.startDate),
                end_date: formatDateToDMY(dates.endDate),
                currencies: selectedCurrencies.length > 0 ? selectedCurrencies : undefined,
                action: selectedTypes.length > 0 ? selectedTypes : undefined,
                page
            });
    } ,[dates, selectedCurrencies, selectedTypes, page,fetchData])

    return <div className="history-page">
        <div className="HistoryFilters">
            <DateRangePicker
                onChange={handleDatesChange}
            />

            <MultiSelect
                SvgIcon={WalletIcon}
                options={currencyOptions}
                selected={selectedCurrencies}
                onChange={setSelectedCurrencies}
                placeholder={('All currencies')}
                label={('Currencies')}
            />

            <MultiSelect
                SvgIcon={WalletIcon}
                options={trxTypeOptions}
                selected={selectedTypes}
                onChange={setSelectedTypes}
                placeholder={('All Actions')}
                label={('Actions')}
            />
        </div>

        {isLoading ? <div className="m-info-block m-info-block--medium m-info-block--secondary loader-wrapper">
                    <LoaderSpinner />
                </div>
            : error ? <NoDataAvailable
                info={
                    'data' in error
                        ? (error.data as { message?: string })?.message ?? ("Something wrong happened. Try again later!")
                        : ("Something wrong happened. Try again later!")
                }
            />
                : (data?.transactions.length === 0) ? <NoDataAvailable info={("No transactions found.")} />
                    : <div className="BettingHistoryTable history-section">
                        <div className="data-table-wrapper">
                            <div className="DataTable" >
                                {isDesktop && <div className="DataTableHead">
                                    <div className="DataTableHead-Content">
                                        <div className="DataTableHead-Col">
                                            <CalendarIcon />
                                            <div>Date</div> &amp; <div>time</div>
                                        </div>
                                        <div className="DataTableHead-Col">
                                            <DocumentIcon />
                                            <div>ID</div>
                                        </div>
                                        <div className="DataTableHead-Col">
                                            <ListIcon />
                                            <div>Amount</div>
                                        </div>
                                        <div className="DataTableHead-Col">
                                            <DocumentIcon />
                                            <div>Action</div>
                                        </div>
                                        <div className="DataTableHead-Col">
                                            <WalletIcon />
                                            <div>Confirmed</div>
                                        </div>
                                        <div className="DataTableHead-Col">
                                            <CrownIcon />
                                            <div>Cancelled</div>
                                        </div>
                                    </div>
                                    <div className="DataTableHead-Copy"></div>
                                </div>}
                                {data?.transactions?.map((trx: Transaction) => <>
                                    <div key={trx.id} className="DataTableRow DataTable--last-child">
                                        <div className="DataTableRow-Content">
                                            <div className="DataTableCol DataTableCol--createTime TextOverflow">
                                                <div className="DataTableCol-Th">
                                                    <CalendarIcon />
                                                    <span className="DataTableCol-Label"><div>Date</div> &amp; <div>time</div></span>
                                                </div>
                                                {formatDate(new Date(trx.created_at))}
                                            </div>
                                            <div className="DataTableCol DataTableCol--betId TextOverflow">
                                                <div className="DataTableCol-Th">
                                                    <DocumentIcon />
                                                    <span className="DataTableCol-Label"><div>ID</div></span>
                                                </div>{trx.id}
                                            </div>
                                            <div className="DataTableCol DataTableCol--transactionId TextOverflow">
                                                <div className="DataTableCol-Th">
                                                    <ListIcon />
                                                    <span className="DataTableCol-Label"><div>Amount</div></span>
                                                </div>{trx.amount}{" "}
                                                {/* @ts-ignore */}
                                                {currencyList[trx.currency].symbol_native}
                                            </div>
                                            <div className="DataTableCol DataTableCol--betType TextOverflow">
                                                <div className="DataTableCol-Th">
                                                    <DocumentIcon />
                                                    <span className="DataTableCol-Label"><div>Action</div></span>
                                                </div>
                                                <div className={`m-badge m-badge--${trx.type === 'deposit'  ? 'success': 'danger'} m-badge--s m-gradient-border`}>
                                                    <div className="m-badge-content">
                                                        <div className="m-badge-text">{trx.type.toUpperCase()}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="DataTableCol DataTableCol--betMoneyBetAmount TextOverflow">
                                                <div className="DataTableCol-Th">
                                                    <WalletIcon />
                                                    <span className="DataTableCol-Label"><div>Confirmed</div></span>
                                                </div>
                                                {trx.confirmed}
                                                <div className={`m-badge m-badge--${trx.confirmed ? 'success': 'secondary'} m-badge--s m-gradient-border`}>
                                                        <div className="m-badge-text">{trx.confirmed ? <CheckMarkIcon  className=""/> : <CloseIcon  className=""/>}</div>
                                                </div>
                                            </div>
                                            <div className="DataTableCol DataTableCol--betMoneyPayout TextOverflow">
                                                <div className="DataTableCol-Th">
                                                    <CrownIcon />
                                                    <span className="DataTableCol-Label"><div>Cancelled</div></span>
                                                </div>
                                                <div className={`m-badge m-badge--${trx.cancelled ? 'danger': 'secondary'} m-badge--s m-gradient-border`}>
                                                    <div className="m-badge-content">
                                                        <div className="m-badge-text">{trx.cancelled ? <CheckMarkIcon className=""/> : <CloseIcon  className=""/>}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="DataTableRow-Copy">
                                            <button onClick={() => handleCopy(trx)} className="m-button m-gradient-border m-button--secondary m-button--s CopyClipboard">
                                                <div className="m-button-content">
                                                    <span>
                                                        <ClipBoardIcon />
                                                        <span className="CopyClipboard-Text"><div>Copy details</div></span>
                                                    </span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </>)}

                                {data && (
                                    <Pagination
                                        currentPage={data.pagination.current_page}
                                        totalPages={data.pagination.last_page}
                                        onPageChange={setPage}
                                    />
                                )}
                            </div>
                        </div>
                    </div>}
    </div>
}

export default TransactionHistory