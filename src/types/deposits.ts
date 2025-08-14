

export interface DepositRequest {
    price_amount: number,
    currency: string
}

export interface DepositResponse {
    invoice_url: string;
    payment_id:  null;
  };