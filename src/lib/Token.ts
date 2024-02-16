import { toBigInt, Contract } from "ethers";

export const fetchTokenBalanceWithProvider = async (
  ethersProvider: any,
  { address }: any,
  account: string
) => {
  if (!account || !address || !ethersProvider) {
    return toBigInt(0);
  }
  try {
    const abi = ["function balanceOf(address) view returns (uint256)"];
    const tokenContract = new Contract(address, abi, ethersProvider);
    const balance = await tokenContract.balanceOf(account);
    return balance;
  } catch (error) {}

  return toBigInt(0);
};
