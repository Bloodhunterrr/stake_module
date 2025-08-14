import type {Game} from "./game_list";

export interface PlayRequest {
  device: 'both' | 'mobile' | 'desktop';
  gameID: number;
  language: string;
  exit: string;
  currency: string;
}

export interface SportbookIframeReq {
  currency: string;
}

export interface PlayResponse {
    play_url: string;
    blankMode?: boolean,
    game: Game
}