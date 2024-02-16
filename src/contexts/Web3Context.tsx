import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { hexToNumber } from "@metamask/utils";
import { BrowserProvider, formatUnits } from "ethers";
import { fetchTokenBalanceWithProvider } from "../lib/Token";
import { DEFAULT_ADDRESS } from "../lib/Const";

export type Web3Context = {
  loading?: boolean;
  isConnected?: boolean;
  disconnect: () => void;
  providerChainId?: number;
  account?: string;
  walletBalance?: any;
  ethersProvider?: any;
  connectWeb3: () => void;
};

const Web3Context = React.createContext<Web3Context>({
  loading: false,
  isConnected: false,
  connectWeb3: () => {},
  disconnect: () => {},
});

const { ethereum } = window;

export const Web3Provider = ({ children }: any) => {
  const [
    { providerChainId, ethersProvider, account, walletBalance },
    setWeb3State,
  ] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const setWeb3Provider = useCallback(async () => {
    try {
      const provider = new BrowserProvider(ethereum!);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const chainId: any = await ethereum?.request({ method: "eth_chainId" });

      const balance = await fetchTokenBalanceWithProvider(
        provider,
        { address: DEFAULT_ADDRESS },
        address
      );

      setWeb3State({
        account: address,
        ethersProvider: provider,
        providerChainId: hexToNumber(chainId),
        walletBalance: formatUnits(balance, 18),
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const isConnected = useMemo(
    () => !!account && !!providerChainId && !!ethereum,
    [account, providerChainId, ethereum]
  );

  const disconnect = () => {
    setWeb3State({});
  };

  const connectWeb3 = useCallback(async () => {
    try {
      setLoading(true);
      if (typeof ethereum !== "undefined") {
        await ethereum.request({ method: "eth_requestAccounts" });
        await setWeb3Provider();
        ethereum.on("accountsChanged", async (accounts: any) => {
          if (!accounts?.length) {
            disconnect();
          } else {
            setLoading(true);
            await setWeb3Provider();
            setLoading(false);
          }
        });
        ethereum.on("chainChanged", async () => {
          setLoading(true);
          await setWeb3Provider();
          setLoading(false);
        });
      } else {
        await setWeb3Provider();
      }
    } catch (error) {
      console.error(error);
      disconnect();
    } finally {
      setLoading(false);
    }
  }, [disconnect]);

  useEffect(() => {
    connectWeb3();
  }, []);

  const web3Context = useMemo(
    () => ({
      connectWeb3,
      loading,
      disconnect,
      providerChainId,
      ethersProvider,
      account,
      walletBalance,
      isConnected,
    }),
    [connectWeb3, loading, disconnect, providerChainId, account, isConnected]
  );

  return (
    <Web3Context.Provider value={web3Context}>{children}</Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
