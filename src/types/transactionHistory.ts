import type {Pagination} from "./shared";

export interface TransactionHistoryReq {
    start_date: string;
    end_date: string;
    currencies?: Array<string>;
    action?: Array<string>
    per_page?: number;
    page?: number;
}

export interface TransactionHistoryResponse {
    transactions: Transaction[];
    pagination:   Pagination;
}

export interface Transaction {
    id:         number;
    type:       string;
    amount:     string;
    currency:   string;
    note:       string;
    confirmed:  boolean;
    cancelled:  boolean;
    created_at: Date;
}
