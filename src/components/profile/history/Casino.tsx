
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
import { useGetCasinoHistoryMutation } from "@/services/authApi";
import NoDataAvailable from "@/components/shared/v2/no-data-available/NoDataAvailable";
import { formatDateToDMY, formatDate } from "@/utils/formatDate";
import Pagination from "@/components/shared/table-pagination/TablePagination";
import { LoaderSpinner } from "@/components/shared/Loader";
import { toast } from "react-toastify";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import type {CasinoTransaction} from "@/types/casinoHistory";
import { currencyList } from "@/utils/currencyList";

const CasinoHistory = () => {
    ;
    const isDesktop = useIsDesktop()

    const user: User = useAppSelector(state => state.auth?.user)

    const [dates, setDates] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
        endDate: new Date(),
    });

    const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
    const [page, setPage] = useState(1);

    const handleCopy = (trx: CasinoTransaction) => {
        const formattedText = `
ID: ${trx.id}
Game Name: ${trx.game_name}
Game ID: ${trx.game_id}
Bet Amount: ${trx.details.bet.amount}
Win Amount: ${trx.details.win.amount}
Date: ${formatDate(new Date(trx.created_at))}
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

    const [fetchData, { data, isLoading, error }] = useGetCasinoHistoryMutation();

    useEffect(() => {
            fetchData({
                start_date: formatDateToDMY(dates.startDate),
                end_date: formatDateToDMY(dates.endDate),
                currencies: selectedCurrencies.length > 0 ? selectedCurrencies : undefined,
                page
            });
    } ,[dates, selectedCurrencies, page, fetchData])

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
                : (data?.transactions.length === 0) ? <NoDataAvailable info={("No spins history found.")} />
                    : <div className="BettingHistoryTable casino-section">
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
                                            <div>Game Name</div>
                                        </div>
                                        <div className="DataTableHead-Col">
                                            <DocumentIcon />
                                            <div>Game ID</div>
                                        </div>
                                        <div className="DataTableHead-Col">
                                            <WalletIcon />
                                            <div>Bet Amount</div>
                                        </div>
                                        <div className="DataTableHead-Col">
                                            <CrownIcon />
                                            <div>Win Amount</div>
                                        </div>
                                    </div>
                                    <div className="DataTableHead-Copy"></div>
                                </div>}
                                {data?.transactions?.map((trx: CasinoTransaction) => <>
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
                                                    <span className="DataTableCol-Label"><div>Game Name</div></span>
                                                </div>{trx.game_name}
                                            </div>
                                            <div className="DataTableCol DataTableCol--betType TextOverflow">
                                                <div className="DataTableCol-Th">
                                                    <DocumentIcon />
                                                    <span className="DataTableCol-Label"><div>Game ID</div></span>
                                                </div>
                                                {trx.game_id}
                                            </div>
                                            <div className="DataTableCol DataTableCol--betMoneyBetAmount TextOverflow">
                                                <div className="DataTableCol-Th">
                                                    <WalletIcon />
                                                    <span className="DataTableCol-Label"><div>Bet Amount</div></span>
                                                </div>
                                                {trx.details.bet.amount} {" "}
                                                {/* @ts-ignore */}
                                                {currencyList[trx.currency].symbol_native}
                                            </div>
                                            <div className="DataTableCol DataTableCol--betMoneyPayout TextOverflow">
                                                <div className="DataTableCol-Th">
                                                    <CrownIcon />
                                                    <span className="DataTableCol-Label"><div>Win Amount</div></span>
                                                </div>
                                                {String(trx.details.win.amount) === "0" ? <span className="">
                                                    -
                                                    {/* {trx.details.win.amount} {" "} */}
                                                    {/* @ts-ignore */}
                                                    {/* {currencyList[trx.currency].symbol_native} */}
                                                </span>
                                                : <div className={`m-badge m-badge--success m-badge--s m-gradient-border`}>
                                                    <div className="m-badge-content">
                                                        <div className="m-badge-text">
                                                            {trx.details.win.amount}{" "}
                                                            {/* @ts-ignore */}
                                                            {currencyList[trx.currency].symbol_native}
                                                        </div>
                                                    </div>
                                                </div>}
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

export default CasinoHistory