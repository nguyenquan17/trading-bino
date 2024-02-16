import React, { useContext, useState, useEffect } from "react";
import LocalStorage from "../lib/LocalStorage";
import { getProfile } from "../apis/UserApi";
import { TokenSymbol } from "../interfaces/TokenSymbol";
import { ACCOUNT_DEMO, STORE_TOKEN, TOKEN_DEFAULT } from "../lib/Const";
import { isAccountDemo } from "../lib/Utils";
import { Account } from "../interfaces/User";

export type AppContent = {
  isAuthenticated: boolean;
  balance?: number | null;
  user?: any;
  authenticate: (value: any) => void;
  userFetching?: boolean;
  tokenCurrent?: any;
  updateTokenCurrent?: (value: any) => void;
};

const AppContext = React.createContext<AppContent>({
  isAuthenticated: false,
  balance: 0,
  authenticate: () => {},
  userFetching: true,
});

export const AppProvider = ({ children }: any) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [user, setUser] = useState<Account | null>(null);
  const [tokenCurrent, setTokenCurrent] = useState(
    LocalStorage.getJson(STORE_TOKEN, TOKEN_DEFAULT)
  );
  const [userFetching, setUserFetching] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!LocalStorage.get("uid", false) && !isAccountDemo()
  );

  useEffect(() => {
    _initializeToken();
    if (isAccountDemo()) {
      const demoBalance = LocalStorage.get("demo_balance");
      if (demoBalance) {
        setBalance(Number(demoBalance));
      }
      setUser(ACCOUNT_DEMO);
      setUserFetching(false);
    } else {
      if (isAuthenticated && !user) {
        setUserFetching(true);
        getProfile()
          .then((data) => {
            setUser(data?.data);
            setBalance(data?.data?.balance ?? 0);
          })
          .catch((err) => {
            setUser(null);
          })
          .finally(() => {
            setUserFetching(false);
          });
      } else {
        setUserFetching(false);
        setBalance(0);
      }
    }
  }, [isAuthenticated]);

  const _initializeToken = () => {
    const tokenStorage: TokenSymbol = LocalStorage.getJson(
      STORE_TOKEN,
      TOKEN_DEFAULT
    );
    if (tokenStorage) {
      setTokenCurrent(tokenStorage);
    }
  };

  const authenticate = (uid?: string) => {
    const value = !!uid;
    value ? LocalStorage.set("uid", uid) : LocalStorage.remove("uid");
    setIsAuthenticated(value);
  };

  const updateTokenCurrent = (token: TokenSymbol) => {
    LocalStorage.setJson(STORE_TOKEN, token);
    setTokenCurrent(token);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        balance,
        user,
        tokenCurrent,
        updateTokenCurrent,
        authenticate,
        userFetching,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
