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

// User Response

interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    pivot: {
        model_type: string;
        model_id: number;
        role_id: number;
    };
}

export interface GetUserResponse {
    id: number;
    name: string;
    email: string;
    avatar_url: string | null;
    username: string;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    date_of_birth: string | null;
    gender: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    zip_code: string | null;
    is_blocked: number;
    is_agent?: boolean;
    breezy_sessions: [];
    roles?: Role[];
    wallets ?: Wallet[];
}

export interface UsersResponse {
        user: GetUserResponse;
        children: User[];
}

export interface UsersRequest {
    user_id?: number;
    search ?: string
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
    is_agent:        boolean;
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
  