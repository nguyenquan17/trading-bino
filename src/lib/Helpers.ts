import { DEFAULT_NETWORKS } from "./Const";

export const getNetworkName = (chainId: number) => {
  const network = DEFAULT_NETWORKS[chainId];
  if (network) {
    return network.name;
  }
  return "Unknown Network";
};

export const shortAddress = (address: string) => {
  if (address) return address.slice(0, 5) + "..." + address.slice(-3);
  return address;
};

export const formatNumber = (num: number) => {
  return num ? Number(Number(num)?.toFixed(4)) : num;
};

export const convertNullToEmptyString = (obj: any) => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key] === null) {
        obj[key] = "";
      } else if (typeof obj[key] === "object") {
        obj[key] = convertNullToEmptyString(obj[key]);
      }
    }
  }
  return obj;
}