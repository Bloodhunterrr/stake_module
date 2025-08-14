

export interface NpCryptosRequest {
    search?: string;
}

export interface NpCryptosResponse {
    cryptos: Crypto[];
}

export interface Crypto {
    id:           number;
    code:         string;
    name:         string;
    wallet_regex: string;
    logo_url:     string;
}
