import type {Wallet} from "./auth";

export interface SetDefaultWalletRequest {
  currency: string;
}

export interface SetDefaultWalletResponse {
  success: boolean;
  message: string;
  data: {
    wallet: Wallet;
  };
}