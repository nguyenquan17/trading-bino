import axios from 'axios';

const ERROR = 'Có lỗi xảy ra. Vui lòng liên hệ 18499366003 để được trợ giúp';

export const login = async (data: any) => {
  try {
    const response = await axios.post('/v1/login', data);
    return response.data;
  } catch (error: any) {
    if (error?.response?.data?.error) {
      throw new Error(error?.response?.data?.error)
    }
    throw new Error(ERROR)
  }
}

export const logout = async () => {
  try {
    const response = await axios.post('/v1/logout');
    return response.data;
  } catch (error: any) {
    if (error?.response?.data?.error) {
      throw new Error(error?.response?.data?.error)
    }
    throw new Error(ERROR)
  }
}

export const register = async (data: any) => {
  try {
    const response = await axios.post('/v1/register', data);
    return response.data;
  } catch (error: any) {
    console.log(error);
    if (error?.response?.data?.error) {
      throw new Error(error?.response?.data?.error)
    }
    throw new Error(ERROR)
  }
}
