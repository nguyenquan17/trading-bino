import React, { useContext, useState, useEffect } from "react";
import LocalStorage from "../lib/LocalStorage";
import { getBalance } from "../apis/UserApi";
import { TokenSymbol } from "../interfaces/TokenSymbol";
import {
  ACCOUNT_TYPE, ACCOUNT_TYPE_DEFAULT,
  ACCOUNT_TYPE_DEMO, ACCOUNT_TYPE_MAIN, ACCOUNT_TYPE_COMMISSION, ACCOUNT_TYPE_BONUS, AccountBalance,
  STORE_ACCOUNT_TYPE, STORE_TOKEN
} from "../lib/Const";

import { IAcccountBalanceResponse } from "../apis/interfaces/UserInterfaces";
import { fetchTokenList } from "../apis/AppApi";
import { updateAxiosHeaders } from "../lib/AxiosConfig";

export type AppContent = {
  accountType: ACCOUNT_TYPE;
  accountBalance?: AccountBalance;
  mainAccount?: AccountBalance;
  accountBalances: Map<ACCOUNT_TYPE, AccountBalance>;
  userFetching: boolean;
  tokenCurrent?: TokenSymbol;
  isAuthenticated: boolean;
  tokenList: Array<TokenSymbol>;
  updateTokenCurrent: (value: any) => void;
  updateAccountType: (value: ACCOUNT_TYPE) => void;
  authenticate: (value: any) => void;
  updateAccountBalance: (callback?: Function) => void;
  setMainAccount: (value: AccountBalance) => void,
};



const AppContext = React.createContext<AppContent>({
  accountType: ACCOUNT_TYPE_DEFAULT,
  userFetching: true,
  accountBalances: new Map<ACCOUNT_TYPE, AccountBalance>(),
  isAuthenticated: false,
  authenticate: () => { },
  updateAccountBalance: () => { },
  setMainAccount: () => ({} as AccountBalance),
  updateTokenCurrent: () => { },
  updateAccountType: () => { },
  tokenList: [],
});

export const AppProvider = ({ children }: any) => {
  const [accountBalances, setAccountBalances] = useState<Map<ACCOUNT_TYPE, AccountBalance>>(new Map<ACCOUNT_TYPE, AccountBalance>);
  const [tokenCurrent, setTokenCurrent] = useState<TokenSymbol>(
    LocalStorage.getJson(STORE_TOKEN, null)
  );
  const [mainAccount, setMainAccount] = useState<AccountBalance>();
  const [accountType, setAccountType] = useState<ACCOUNT_TYPE>(LocalStorage.get(STORE_ACCOUNT_TYPE, ACCOUNT_TYPE_DEFAULT));
  const [userFetching, setUserFetching] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenList, setTokenList] = useState<Array<TokenSymbol>>([]);

  useEffect(() => {

    setUserFetching(true);
    updateAccountBalance();
    updateTokenList();
  }, []);

  const updateTokenList = () => {
    fetchTokenList()
      .then((res) => {
        const list: Array<TokenSymbol> = res.data;
        if (!tokenCurrent) {
          updateTokenCurrent(list[0]);
        }
        else {
          //reupdate profit
          for (var i = 0; i < list.length; i++) {
            if (list[i].symbol == tokenCurrent.symbol) {

              updateTokenCurrent(list[i]);
            }
          }
        }
        setTokenList(list);
      })
      .catch();
  }
  const updateAccountBalance = (callback?: any) => {

    getBalance()
      .then((data: any) => {
        const balanceData: IAcccountBalanceResponse = data.data;
        const mapAccountBalances: Map<ACCOUNT_TYPE, AccountBalance> = new Map<ACCOUNT_TYPE, AccountBalance>();
        mapAccountBalances.set(ACCOUNT_TYPE_DEMO, { type: ACCOUNT_TYPE_DEMO, balance: balanceData.demo, id: balanceData.id });
        if (balanceData.auth) {
          mapAccountBalances.set(ACCOUNT_TYPE_MAIN, { type: ACCOUNT_TYPE_MAIN, balance: balanceData.main, id: balanceData.id } as AccountBalance);
          mapAccountBalances.set(ACCOUNT_TYPE_COMMISSION, { type: ACCOUNT_TYPE_COMMISSION, balance: balanceData.commission, id: balanceData.id } as AccountBalance);
          mapAccountBalances.set(ACCOUNT_TYPE_BONUS, { type: ACCOUNT_TYPE_BONUS, balance: balanceData.bonus, id: balanceData.id } as AccountBalance);
        }
        setIsAuthenticated(balanceData.auth);
        if (!balanceData.auth || ![ACCOUNT_TYPE_DEMO, ACCOUNT_TYPE_MAIN, ACCOUNT_TYPE_BONUS].includes(accountType)) {
          setAccountType(ACCOUNT_TYPE_DEFAULT);
        }

        setAccountBalances(mapAccountBalances);

        accountBalances?.forEach((accountBalance) => {
          if (accountBalance.type == ACCOUNT_TYPE_MAIN) {
            setMainAccount(accountBalance);
          }
        });
      })
      .catch((err) => {
        setAccountBalances(new Map<ACCOUNT_TYPE, AccountBalance>());
      })
      .finally(() => {
        setUserFetching(false);
        if (callback)
          callback();
      });
  }
  const authenticate = (token?: string) => {
    const value = !!token;
    value ? LocalStorage.setAccessToken(token) : LocalStorage.removeAccessToken();
    updateAxiosHeaders();
    setIsAuthenticated(value);
  };

  const updateTokenCurrent = (token: TokenSymbol) => {
    LocalStorage.setJson(STORE_TOKEN, token);
    setTokenCurrent(token);
  }

  const updateAccountType = (accountType: ACCOUNT_TYPE) => {
    localStorage.setItem(STORE_ACCOUNT_TYPE, accountType);
    setAccountType(accountType);
  }


  return (
    <AppContext.Provider
      value={{
        authenticate,
        accountType,
        userFetching,
        tokenCurrent,
        updateTokenCurrent,
        updateAccountType,
        accountBalances,
        isAuthenticated,
        mainAccount,
        updateAccountBalance,
        setMainAccount,
        tokenList
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);


