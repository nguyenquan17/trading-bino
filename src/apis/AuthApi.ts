import axios from 'axios';

const ERROR = 'An error occurred.';

export const login = async (data: any) => {
  try {
    const response = await axios.post('/v1/login', data);

    return response.data;
  } catch (error: any) {
    console.log(error);
    if (error?.response?.data?.message) {
      throw new Error(error?.response?.data?.message)
    }
    throw new Error(ERROR)
  }
}

export const logout = async () => {
  try {
    const response = await axios.get('/v1/logout');
    return response.data;
  } catch (error: any) {
    if (error?.response?.data?.message) {
      throw new Error(error?.response?.data?.message)
    }
    throw new Error(ERROR)
  }
}

export const register = async (data: any) => {
  try {
    const response = await axios.post('/v1/register', data);
    return response.data;
  } catch (error: any) {
    if (error?.response?.data?.message) {
      throw new Error(error?.response?.data?.message)
    }
    throw new Error(ERROR)
  }
}
