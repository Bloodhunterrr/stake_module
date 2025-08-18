import { useEffect, useState } from "react";
import type { User, Wallet } from "@/types/auth";
import DateRangePicker from "@/components/shared/date-picker-range/DatePickerRange";
import MultiSelect from "@/components/shared/multiselect/MultiSelect";
import { useAppSelector } from "@/hooks/rtk";

import WalletIcon  from "@/assets/icons/wallet.svg?react";
import ListIcon  from "@/assets/icons/list.svg?react";
import CalendarIcon  from "@/assets/icons/calendar.svg?react";
import DocumentIcon  from "@/assets/icons/document.svg?react";
import BetTypeIcon  from "@/assets/icons/bet-type.svg?react";
import BigWinsIcon  from "@/assets/icons/big-wins.svg?react";
import CrownIcon  from "@/assets/icons/crown.svg?react";
import ClipBoardIcon  from "@/assets/icons/clip-board.svg?react";
import InfoIcon  from "@/assets/icons/info.svg?react";

import NoDataAvailable from "@/components/shared/v2/no-data-available/NoDataAvailable";
import { formatDateToDMY, formatDate } from "@/utils/formatDate";
import Pagination from "@/components/shared/table-pagination/TablePagination";
import type {Odd, Ticket} from "@/types/sportHistory";
import { LoaderSpinner } from "@/components/shared/Loader";
import { toast } from "react-toastify";
import Modal from "@/components/shared/modal";
import { currencyList } from "@/utils/currencyList";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { useGetSportHistoryMutation } from "@/services/authApi";

const TicketStatuses = (status: number) => {
  switch (status) {
    case 0:
      return <div>Pending</div>;
    case 1:
      return <div>Lost</div>;
    case 3:
      return <div>Won</div>;
    case 4:
      return <div>Returned</div>;
  }
};

const getBadgeClass = (status: number) => {
  switch (status) {
    case 0:
      return "m-badge--warning";
    case 1:
      return "m-badge--danger";
    case 3:
      return "m-badge--success";
    case 4:
      return "m-badge--info";
    default:
      return "m-badge--secondary";
  }
};

const SportHistory = () => {
  ;
  const isDesktop = useIsDesktop();

  const user: User = useAppSelector((state) => state.auth?.user);
  const [detailsModalData, setDetailsModalData] = useState<Ticket | null>(null);

  const [dates, setDates] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(),
  });

  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const handleCopy = (ticket: Ticket) => {
    const formattedText = `
ID: ${ticket.id}
Bet ID: ${ticket.betID}
Bet Type: ${ticket.bet_type}
Status: ${ticket.status}
Bet Sum: ${ticket.bet_sum}
Win Sum: ${ticket.win_sum}
Date: ${formatDate(new Date(ticket.created_date))}
`.trim();

    navigator.clipboard
      .writeText(formattedText)
      .then(() => toast.success(("Details copied to clipboard")))
      .catch(() => toast.error(("Failed to copy")));
  };

  const handleDatesChange = (range: {
    startDate: Date | null;
    endDate: Date | null;
  }) => {
    if (range.startDate && range.endDate) {
      setDates({
        startDate: range.startDate,
        endDate: range.endDate,
      });
    }
  };

  const currencyOptions = user?.wallets.map((w: Wallet) => ({
    value: w.slug.toUpperCase(),
    label: w.slug.toUpperCase(),
  }));
  const statusOptions = [
    { value: "0", label: ("Pending") },
    { value: "1", label: ("Lost") },
    { value: "3", label: ("Won") },
    { value: "4", label: ("Returned") },
  ];

  const [fetchData, { data, isLoading, error }] = useGetSportHistoryMutation();

  useEffect(() => {
    fetchData({
      start_date: formatDateToDMY(dates.startDate),
      end_date: formatDateToDMY(dates.endDate),
      currencies:
        selectedCurrencies.length > 0 ? selectedCurrencies : undefined,
      status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      page,
    });
  }, [dates, selectedCurrencies, selectedStatuses, page, fetchData]);

  return (
    <>
      <div className="history-page">
        <div className="HistoryFilters">
          <DateRangePicker onChange={handleDatesChange} />

          <MultiSelect
            SvgIcon={WalletIcon}
            options={currencyOptions}
            selected={selectedCurrencies}
            onChange={setSelectedCurrencies}
            placeholder={("All currencies")}
            label={("Currencies")}
          />

          <MultiSelect
            SvgIcon={ListIcon}
            options={statusOptions}
            selected={selectedStatuses}
            onChange={setSelectedStatuses}
            placeholder={("All Statuses")}
            label={("Statuses")}
          />
        </div>

        {isLoading ? (
          <div className="m-info-block m-info-block--medium m-info-block--secondary loader-wrapper">
            <LoaderSpinner />
          </div>
        ) : error ? (
          <NoDataAvailable
            info={
              "data" in error
                ? (error.data as { message?: string })?.message ??
                  ("Something wrong happened. Try again later!")
                : ("Something wrong happened. Try again later!")
            }
          />
        ) : data?.tickets.length === 0 ? (
          <NoDataAvailable info={("No betting history found.")} />
        ) : (
          <div className="BettingHistoryTable sport-section">
            <div className="data-table-wrapper">
              <div className="DataTable">
                {isDesktop && (
                  <div className="DataTableHead">
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
                        <div>Bet ID</div>
                      </div>
                      <div className="DataTableHead-Col">
                        <BetTypeIcon />
                        <div>Bet type</div>
                      </div>
                      <div className="DataTableHead-Col">
                        <BigWinsIcon />
                        <div>Status</div>
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
                  </div>
                )}
                {data?.tickets?.map((ticket: Ticket) => (
                  <>
                    <div
                      key={ticket.id}
                      className="DataTableRow DataTable--last-child"
                    >
                      <div className="DataTableRow-Content">
                        <div className="DataTableCol DataTableCol--createTime TextOverflow">
                          <div className="DataTableCol-Th">
                            <CalendarIcon />
                            <span className="DataTableCol-Label">
                              <div>Date</div> &amp; <div>time</div>
                            </span>
                          </div>
                          {formatDate(new Date(ticket.created_date))}
                        </div>
                        <div className="DataTableCol DataTableCol--betId TextOverflow">
                          <div className="DataTableCol-Th">
                            <DocumentIcon />
                            <span className="DataTableCol-Label">
                              <div>ID</div>
                            </span>
                          </div>
                          {ticket.id}
                        </div>
                        <div className="DataTableCol DataTableCol--transactionId TextOverflow">
                          <div className="DataTableCol-Th">
                            <ListIcon />
                            <span className="DataTableCol-Label">
                              <div>Bet ID</div>
                            </span>
                          </div>
                          {ticket.betID}
                        </div>
                        <div className="DataTableCol DataTableCol--betType TextOverflow">
                          <div className="DataTableCol-Th">
                            <BigWinsIcon />
                            <span className="DataTableCol-Label">
                              <div>Bet type</div>
                            </span>
                          </div>
                          {ticket.bet_type}{ticket.bet_type === "multiple" && ` (${ticket.details.odds.length})`}
                        </div>
                        <div className="DataTableCol DataTableCol--betStatus TextOverflow">
                          <div className="DataTableCol-Th">
                            <BigWinsIcon />
                            <span className="DataTableCol-Label">
                              <div>Status</div>
                            </span>
                          </div>
                          <div
                            className={`m-badge ${getBadgeClass(
                              ticket.status
                            )} m-badge--s m-gradient-border`}
                          >
                            <div className="m-badge-content">
                              <div className="m-badge-text">
                                {TicketStatuses(ticket.status)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="DataTableCol DataTableCol--betMoneyBetAmount TextOverflow">
                          <div className="DataTableCol-Th">
                            <WalletIcon />
                            <span className="DataTableCol-Label">
                              <div>Bet Amount</div>
                            </span>
                          </div>
                          {ticket.bet_sum} {/* @ts-ignore */}
                          {currencyList[ticket.currency].symbol_native}
                        </div>
                        <div className="DataTableCol DataTableCol--betMoneyPayout TextOverflow">
                          <div className="DataTableCol-Th">
                            <CrownIcon />
                            <span className="DataTableCol-Label">
                              <div>Win Amount</div>
                            </span>
                          </div>
                          <span className="">
                            {ticket.win_sum} {/* @ts-ignore */}
                            {currencyList[ticket.currency].symbol_native}
                          </span>
                        </div>
                      </div>
                      <div className="DataTableRow-Copy">
                        <button
                          onClick={() => handleCopy(ticket)}
                          className="m-button m-gradient-border m-button--secondary m-button--s CopyClipboard"
                        >
                          <div className="m-button-content">
                            <span>
                              <ClipBoardIcon />
                              <span className="CopyClipboard-Text">
                                <div>Copy details</div>
                              </span>
                            </span>
                          </div>
                        </button>
                        <button
                          onClick={() => setDetailsModalData(ticket)}
                          className="m-button m-gradient-border m-button--secondary m-button--s InfoBtn"
                        >
                          <div className="m-icon-container">
                            <InfoIcon />
                          </div>
                        </button>
                      </div>
                    </div>
                  </>
                ))}

                {data && (
                  <Pagination
                    currentPage={data.pagination.current_page}
                    totalPages={data.pagination.last_page}
                    onPageChange={setPage}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {detailsModalData && (
        <Modal
          additionalClass="m-modal-betting-history"
          title={
            <div className="BetInfoHeader-Row BetInfoHeader-Row__column">
              <div className="BetInfoHeader-Label">
                <div>Bet ID</div>:
              </div>
              <div className="BetInfoHeader-Text">{detailsModalData.betID}</div>
            </div>
          }
          onClose={() => setDetailsModalData(null)}
        >
          <div className="BetInfoModal">
            <div className="BetInfoHeader">
              <div className="BetInfoHeader-Row BetInfoHeader-Row__full-width">
                <div
                  className={`m-badge ${getBadgeClass(
                    detailsModalData.status
                  )} m-badge--s m-gradient-border`}
                >
                  {" "}
                  {TicketStatuses(detailsModalData.status)}
                </div>

                <div className="BetInfoHeader-Title">
                  {detailsModalData.bet_type} -{" "}
                  {formatDate(new Date(detailsModalData.created_date))}
                </div>
              </div>
              <div
                className="BetInfoHeader-Row BetInfoHeader-Row__row"
                style={{ flex: "1 1 100%" }}
              >
                <div className="BetInfoHeader-Label">
                  <div>ID</div>:
                </div>
                <div className="BetInfoHeader-Text">{detailsModalData.id}</div>
              </div>
            </div>
            <div className="BetInfoModal-Content">
              <div className="BetInfoOutcome">
                {detailsModalData.details.odds.map((detail: Odd) => (
                  <div key={detail.id} className="BetInfoOutcome-Event">
                    <div className="BetInfoOutcome-EventInfo">
                      <div className="BetInfoOutcome-Winner">
                        {detail.market.name}
                      </div>
                      <div className="BetInfoOutcome-Participants">
                        {detail.event.team1} - {detail.event.team2}
                      </div>
                    </div>
                    <div className="BetInfoOutcome-BetOdds">{detail.rate}</div>
                  </div>
                ))}
              </div>

              <div className="BetInfoTable">
                <div className="BetInfoTable-Col">
                  <div className="BetInfoTable-Label">
                    <div>Total odds</div>
                  </div>
                  <div className="BetInfoTable-Value">
                    {detailsModalData.details.odds.reduce(
                      (all, curr) => (all *= curr.rate),
                      1
                    )}
                  </div>
                </div>
                <div className="BetInfoTable-Col">
                  <div className="BetInfoTable-Label">
                    <div>Bet amount</div>
                  </div>
                  <span className="BetInfoTable-Value">
                    {detailsModalData.bet_sum}
                    {/* @ts-ignore */}
                    {currencyList[detailsModalData.currency].symbol_native}
                  </span>
                </div>
                <div className="BetInfoTable-Col">
                  <div className="BetInfoTable-Label">
                    <div>Payout</div>
                  </div>
                  <div className="BetInfoTable-Value BetInfoTable-Value--secondary">
                    {detailsModalData.bet_sum}
                    {/* @ts-ignore */}
                    {currencyList[detailsModalData.currency].symbol_native}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setDetailsModalData(null)}
                className="m-button m-gradient-border m-button--secondary m-button--m BetInfoModal-Btn"
              >
                <div className="m-button-content">
                  <div>Close</div>
                </div>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default SportHistory;
