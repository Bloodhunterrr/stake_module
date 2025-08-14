import type {Pagination} from "./shared";

export interface CasinoTransactionReq {
    start_date: string;
    end_date: string;
    currencies?: Array<string>;
    per_page?: number;
    page?: number;
}

export interface CasinoTransactionResponse {
    transactions: CasinoTransaction[];
    pagination:   Pagination;
}

export interface CasinoTransaction {
    id:         string;
    game_id:    number;
    game_name:  string;
    currency:   string;
    details:    Details;
    created_at: Date;
}

export interface Details {
    bet: Bet;
    win: Win;
}

export interface Bet {
    id:     number;
    type:   string;
    amount: number;
}

export interface Win {
    id:     number;
    type:   string;
    amount: string;
}