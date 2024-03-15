import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { hexToNumber } from "@metamask/utils";
import { BrowserProvider, InfuraProvider, ethers, formatUnits } from "ethers";
import { fetchTokenBalanceWithProvider } from "../lib/Token";
import { DEFAULT_ADDRESS } from "../lib/Const";

export type Web3Context = {
  loading?: boolean;
  isConnected?: boolean;
  disconnect: () => void;
  providerChainId: number;
  account?: string;
  walletBalance?: any;
  ethersProvider?: any;
  connectWeb3: (callback?: Function) => void;
  clientWalletAddress: string;
  chainList: Array<IChain>

};


type ChainIdType = 1 | 56;
export const ERC20_CHAIN_ID: ChainIdType = 1;
export const BEP20_CHAIN_ID: ChainIdType = 56;
const chainList: Array<IChain> = [
  {
    chainId: ERC20_CHAIN_ID,
    name: "ERC20",
    contractAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    walletAddress: "0x5f94b9ebcc53db66ff1379b3cb631da0b86c6d5d",
    rpc: 'https://mainnet.infura.io/v3/5a3c568fcdd2486397a23e2927739e45',
    logo: "https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png"
  },
  {
    chainId: BEP20_CHAIN_ID,
    name: "BEP20",
    contractAddress: "0x55d398326f99059ff775485246999027b3197955",
    walletAddress: "0x5f94b9ebcc53db66ff1379b3cb631da0b86c6d5d",
    rpc: 'https://bsc-dataseed.binance.org/',
    logo: "https://seeklogo.com/images/B/binance-coin-bnb-logo-CD94CC6D31-seeklogo.com.png"
  }
];

const Web3Context = React.createContext<Web3Context>({
  loading: false,
  isConnected: false,
  connectWeb3: () => { },
  disconnect: () => { },
  clientWalletAddress: '',
  chainList: [],
  providerChainId: ERC20_CHAIN_ID
});

const { ethereum } = window;

export const Web3Provider = ({ children }: any) => {
  const [
    { providerChainId, ethersProvider, account, walletBalance },
    setWeb3State,
  ] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const [clientWalletAddress, setClientWalletAddress] = useState<any>('');
  const setWeb3Provider = useCallback(async (callback?: Function) => {
    try {

      const provider = new BrowserProvider(ethereum!);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setClientWalletAddress(address);
      let chainId: any = await ethereum?.request({ method: "eth_chainId" });
      chainId = hexToNumber(chainId);
      let defaultChain = chainList[0];
      chainList.map((e) => {
        if (e.chainId == chainId) {
          defaultChain = e;
        }
      });

      if (chainId != defaultChain.chainId) {

        await ethereum?.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${defaultChain.chainId!.toString(16)}` }],
        });
        chainId = defaultChain.chainId;
      }
      const balance = await fetchTokenBalanceWithProvider(
        provider,
        { address: defaultChain.contractAddress },
        address
      );

      if (callback) {
        callback({
          clientWalletAddress: address,
          ethersProvider: provider,
          contractAddress: chainList.find(chain => chain.chainId == chainId)?.contractAddress,
          providerChainId: chainId,
          walletBalance: formatUnits(balance, 18),
        } as IWalletProvider);
      }



      setWeb3State({
        account: address,
        providerChainId: chainId,
        ethersProvider: provider,
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

  const connectWeb3 = useCallback(async (callback?: Function) => {

    try {
      setLoading(true);
      if (typeof ethereum !== "undefined") {

        await setWeb3Provider(callback);
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
    // connectWeb3();
  }, []);

  const web3Context = useMemo(
    () => ({
      connectWeb3,
      loading,
      disconnect,
      providerChainId,
      ethersProvider,
      account,
      clientWalletAddress,
      walletBalance,
      isConnected,
      chainList
    }),
    [connectWeb3, loading, disconnect, providerChainId, account, isConnected]
  );

  return (
    <Web3Context.Provider value={web3Context}>{children}</Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);


interface IChain {
  chainId: number;
  name: string;
  rpc: string;
  contractAddress: string;
  walletAddress: string;
  logo: string;
}

export interface IWalletProvider {
  clientWalletAddress: string;
  ethersProvider: BrowserProvider;
  contractAddress: string;
  providerChainId: number;
  walletBalance: string;
}