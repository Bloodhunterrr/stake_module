import type {Language} from "./lang";

export interface SkinConfig {
    skinName: string;
    baseUrl: string;
    languages: Array<Language>;
    liveChat: () => void;
}
