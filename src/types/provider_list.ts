export interface ProviderListRequest {
  device: 'mobile' | 'desktop';
  provider_general_codes?: string[];
  routeSlug?: string[];
  category_ids?: number[];
  limit?: number;
  offset?: number;
  order_by?: 'order' | 'name' | 'general_name' | 'created_at' | 'updated_at';
  order_dir?: 'asc' | 'desc';
  search?: string;
}

export interface Provider {
  id: number;
  name: string;
  code: string;
  general_name?: string | null;
  general_code?: string | null;
  logo?: string | null;
  product_type?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProviderListResponse {
  providers: Provider[];
  total: number;
  limit: number;
  offset: number;
}