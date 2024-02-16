import axios from 'axios';

const ERROR = 'Có lỗi xảy ra. Vui lòng liên hệ 18499366003 để được trợ giúp';

export const getProfile = async () => {
  try {
    const response = await axios.get('/v1/profile');
    return response.data;
  } catch (error: any) {
    if (error?.response?.data?.error) {
      throw new Error(error?.response?.data?.error)
    }
    throw new Error(ERROR)
  }
}