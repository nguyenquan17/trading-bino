import axios from "axios";

export const fetchTokenList = async () => {
  try {
    const response = await axios.get("/v1/symbol");
    return response.data;
  } catch (error: any) {
    return {
      data: [],
      total: 0,
    };
  }
};

export const deposit = (data: any) => {
  return axios.get("/v1/user/deposit", data);
};
