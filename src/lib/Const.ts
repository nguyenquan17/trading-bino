// import { Account } from "../interfaces/User";

import { TokenSymbol } from "../interfaces/TokenSymbol";

export const STORE_AUTH_TOKEN = "access_token";
export const STORE_UID = "uid";
export const STORE_PAIR = "symbol";
export const STORE_TOKEN = "token";
//trong 30 giay cuoi khong duoc bid
export const IGNORE_BID_SECONDS = 30;

export const STORE_ACCOUNT_TYPE = "account_type";
export type ACCOUNT_TYPE = 'DEMO' | 'MAIN' | 'BONUS' | 'COMMISSION';
export const ACCOUNT_TYPE_DEMO: ACCOUNT_TYPE = 'DEMO';
export const ACCOUNT_TYPE_MAIN: ACCOUNT_TYPE = 'MAIN';
export const ACCOUNT_TYPE_BONUS: ACCOUNT_TYPE = 'BONUS';
export const ACCOUNT_TYPE_COMMISSION: ACCOUNT_TYPE = 'COMMISSION';
export const ACCOUNT_TYPE_DEFAULT: ACCOUNT_TYPE = ACCOUNT_TYPE_DEMO;
export type AccountBalance = {
  type: ACCOUNT_TYPE;
  balance: number;
  id: number
}

interface Map {
  [key: number]: any;
}

export const DEFAULT_NETWORKS: Map = {
  5: {
    chainId: 5,
    decimals: 18,
    logoURI: "",
    address: "",
    name: "Goerli",
    symbol: "KETH",
    mode: "NATIVE",
  },
  97: {
    chainId: 97,
    decimals: 18,
    logoURI: "",
    address: "",
    name: "BNB Testnet",
    symbol: "BNB",
    mode: "NATIVE",
  },
};

export const DEFAULT_CHAIN_ID = process.env.REACT_APP_CHAIN_ID
export const DEFAULT_ADDRESS = process.env.REACT_APP_USDT_TOKEN_ADDRESS; // USDT
