export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    user: User
}

export interface AuthMeResponse {
    user: User
}

export interface User {
    id:              number;
    name:            string;
    email:           string;
    avatar_url:      string;
    username:        string;
    first_name:      string;
    last_name:       string;
    phone:           string;
    date_of_birth:   string;
    gender:          string;
    address:         string;
    city:            string;
    state:           string;
    country:         string;
    zip_code:        string;
    wallets:         Wallet[];
}

export interface Wallet {
    id:             number;
    name:           string;
    slug:           string;
    balance:        string;
    decimal_places: number;
    default:        number;
    meta:           Record<string, any>;
    limits:         WalletLimits;
    deleted_at:     null;
}

export interface WalletLimits {
    id:                        number;
    min_deposit:               number;
    max_deposit:               number;
    min_withdraw:              number;
    max_withdraw:              number;
    can_pay_with_now_payments: boolean;
}

export class Convert {
    public static toUser(json: string): User {
        return JSON.parse(json);
    }

    public static userToJson(value: User): string {
        return JSON.stringify(value);
    }
}

export interface AuthState {
    accessToken: string | null;
    user: any | null;
  }
  