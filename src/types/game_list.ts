

export interface GameListResponse {
    games: Game[];
    total: number;
    limit?: number
    offset?: number
}

export interface GameListRequest {
    category_ids?: Array<number>;
    provider_ids?: Array<number>;
    device: 'mobile' | 'desktop',
    limit?: number;
    offset?: number;
    order_by?: 'name' | 'order' | 'created_at' | 'updated_at';
    order_dir?: 'asc' | 'desc';
    search?: string
  }

export interface Game {
    id:            number;
    name:          string;
    slug:          string;
    image:         string;
    image_wide:    null;
    provider_type: string;
    hasDemo:       boolean;
    demoURL:       string;
    label:         null;
    fullscreen:    boolean;
    order:         number;
    popularity:    number;
}