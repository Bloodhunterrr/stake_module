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

export interface TransactionRequest {
    start_date?: string;
    end_date?: string;
    type?: string;
    currency?: string | string[];
    user_id ?: number
}

export interface ReportRequest {
    start_date?: string;
    end_date?: string;
    currency?: string | string[];
    search ?: string
}

export interface TransactionResponse {
    success: boolean;
    message: string;
    data  : []
}

export interface ReportResponse {
    success: boolean;
    message: string;
    data  : []
}

export interface MessageRequest {
    type ?: string;
    id ?:string
    receiver_ids ?: string[] | number[] ,
    subject ?: string,
    content ?: string
}

export interface MessageResponse {
    "id": number,
    "subject": string,
    "body": string | string[] | null,
    "created_at": string
}

export interface getSendSingleMessageRequest {
    bet_status? : string,
    bet_type? : string | number | null,
    wallet_name? : string,
    start_date : string,
    end_date : string,
    user_id ?: string,
}


export interface getSendSingleMessageResponse {
    user : User
    filters : {
        "status": string[],
        "betType": string[],
        "wallets": Wallet[]
    },
    children : {
        net_win?: string | number;
        "id": number,
        "name": string,
        "email": string,
        "is_agent": boolean,
        "is_player": boolean,
        "children_count": number,
        "created_at": string,
        "total_played": number,
        "total_stake": number,
        "total_won": number,
        "total_lost": number
        sport_commission ?: number
    }[],
    totals : any
}




export interface SingleMessageResponse {
    "id": number,
    "subject": string,
    "body": string | null,
    "sender": {
        "id": number,
        "name": string,
        "email": string,
        "avatar": string |  null,
        "username": string | null,
        "first_name": null | string,
        "last_name": null | string,
        "phone": null | string,
        "date_of_birth": null | string,
        "gender": null | string,
        "address": null | string,
        "city": null | string,
        "state": null | string,
        "country": null | string,
        "zip_code": null | string
    },
    "created_at": string
}


export interface BlockRequest {
    id : number;
    body: { status: boolean },
}

export interface BlockResponse {
    success: boolean;
    message: string;
    data  : {
        success: boolean;
        message: string;
    }
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
    children_count?: number;
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


export interface CreateUserRequest {
    username: string;
    name: string;
    email: string;
    password?: string;
    wallet_types: string[];
    default_wallet_type: string;
}

export interface CreateUserData {
    message: string;
    user: User;
}

export interface CreateUserResponse {
    success: boolean;
    message: string;
    data: CreateUserData;
}
export interface ChangePasswordRequest {
    user_id: number;
    password: string;
}