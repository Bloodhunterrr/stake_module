
export interface Routes {
    id:            number;
    name:          string;
    slug:          string;
    icon:          string;
    description?:   null;
    is_active:     boolean;
    is_sportbook:  boolean;
    order:         number;
    subcategories: Subcategory[];
    providers: Provider[];
}

export interface Provider {
    id:   number;
    name: string;
    code: string;
    logo: string;
}

export interface Subcategory {
    id:                       number;
    name:                     string;
    slug:                     string;
    icon:                     string;
    description?:              string;
    category_id:              number;
    is_active:                boolean;
    order:                    number;
    show_on_landing_page:     boolean;
    landing_page_game_number: number;
    landing_page_game_row_number: number;
    show_on_landing_page_mobile_as_slider: boolean;
    landing_mobile_page_game_row_number: number;
    categorySlug?: string
}

export class Convert {
    public static toRoutes(json: string): Routes[] {
        return JSON.parse(json);
    }

    public static routesToJson(value: Routes[]): string {
        return JSON.stringify(value);
    }
}

export interface Main {
    routes: Array<Routes>
}