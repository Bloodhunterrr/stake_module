import type {Pagination} from "./shared";
import type {User} from "@/types/auth.ts";

export interface TransactionHistoryReq {
    start_date: string;
    end_date: string;
    currencies?: Array<string>;
    action?: Array<string>
    per_page?: number;
    page?: number;
    user_id?: number;
}

export interface TransactionHistoryResponse {
    transactions: Transaction[];
    pagination:   Pagination;
    users:      User[];
    summary:   {
        "total_deposit": number,
        "total_withdraw": number
    }
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
    user_id?:   number;

}
