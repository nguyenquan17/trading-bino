import axios from 'axios';
import LocalStorage from '../lib/LocalStorage';
import { UserProfile } from './interfaces/UserInterfaces';

const ERROR = 'An error occurred.';

export const getProfile = async () => {
  try {
    const response = await axios.get('/v1/profile/personal-data');
    return response.data;
  } catch (error: any) {
    if (error?.response?.data?.error) {
      throw new Error(error?.response?.data?.error)
    }
    throw new Error(ERROR)
  }
}
export const getCountry = async () => {
  try {
    const response = await axios.get('/v1/country');
    return response.data;
  } catch (error: any) {
    if (error?.response?.data?.error) {
      throw new Error(error?.response?.data?.error)
    }
    throw new Error(ERROR)
  }
}

export const getBalance = async () => {
  try {
    const response = await axios.get('/v1/profile/balance');
    return response.data;
  } catch (error: any) {
    if (error?.response?.data?.error) {
      throw new Error(error?.response?.data?.error)
    }
    throw new Error(ERROR)
  }
}

export const updateProfile = async (data: any) => {
  try {
    delete data.is_agent;
    delete data.is_vip;
    delete data.email_verified;
    delete data.country_id;
    const response = await axios.post('/v1/profile/personal-data', data);
    return response.data;
  } catch (error: any) {
    if (error?.response?.data?.message) {
      throw new Error(error?.response?.data?.message)
    }
    throw new Error(ERROR)
  }
}

export const changeUserPassword = async (data: any) => {
  try {
    const response = await axios.post('/v1/profile/change-password', data);
    return response.data;
  } catch (error: any) {
    if (error?.response?.data?.error) {
      throw new Error(error?.response?.data?.error)
    }
    throw new Error(ERROR)
  }
}
export const emailConfirm = async (data: any) => {
  try {
    const response = await axios.post('/v1/profile/email-confirm', data);
    return response.data;
  } catch (error: any) {
    if (error?.response?.data?.error) {
      throw new Error(error?.response?.data?.error)
    }
    throw new Error(ERROR)
  }
}
export const kyc = async (data: any) => {
  try {
    const response = await axios.post('/v1/profile/kyc', data);
    return response.data;
  } catch (error: any) {
    if (error?.response?.data?.error) {
      throw new Error(error?.response?.data?.error)
    }
    throw new Error(ERROR)
  }
}
export const getDataKyc = async () => {
  try {
    const response = await axios.get('/v1/profile/kyc');
    return response.data;
  } catch (error: any) {
    if (error?.response?.data?.error) {
      throw new Error(error?.response?.data?.error)
    }
    throw new Error(ERROR)
  }
}