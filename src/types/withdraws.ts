export interface WithdrawRequest {
    currency: string,
    price_amount: number,
    crypto_id: number,
    wallet_address: string
}

export interface WithdrawResponse {
    balance: string;
};