import type {Pagination} from "./shared";

export interface SportHistoryReq {
    start_date: string;
    end_date: string;
    currencies?: Array<string>;
    // IgPixel Ticket status are
    // 0 => Pending
    // 1 => Lost
    // 3 => Won
    // 4 => Returned
    status?: Array<string>
    per_page?: number;
    page?: number;
}

export interface SportHistoryResponse {
    tickets:    Ticket[];
    pagination: Pagination;
}

export interface Ticket {
    id:           number;
    betID:        string;
    bet_type:     string;
    status:       number;
    bet_sum:      string;
    win_sum:      string;
    currency:   string;
    details:      Details;
    created_date: Date;
}

export interface Details {
    odds: Odd[];
}

export interface Odd {
    id:          string;
    live:        number;
    market:      Market;
    event:       Event;
    rate:        number;
    cashout:     number;
    cashoutRate: number;
    status:      number;
}

export interface Event {
    inf:       any;
    sport:     string;
    team1:     string;
    team2:     string;
    league:    string;
    country:   string;
    startDate: number;
    startData: number;
}

export interface Market {
    name:          string;
    handicapValue: number;
}