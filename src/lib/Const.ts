import { Account } from "../interfaces/User";

export const STORE_AUTH_TOKEN = "authToken";
export const STORE_UID = "uid";
export const STORE_PAIR = "symbol";
export const IGNORE_BID_SECONDS = 30;
export const STORE_TOKEN = "token";
export const TOKEN_DEFAULT = {
  base: "BNB",
  name: "BNB/USDT",
  profit: 80,
  quote: "USDT",
  symbol: "BNBUSDT",
};
export const ACCOUNT_DEMO: Account = {
  email: 'Demo'
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
