import axios, { AxiosResponse } from 'axios';
import LocalStorage from './LocalStorage';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const updateAxiosHeaders = () => {
  axios.defaults.headers.common['uid'] = LocalStorage.getUid();
  axios.defaults.headers.common['access_token'] = LocalStorage.getAccessToken();
}

updateAxiosHeaders();
// axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    if (error.response.status === 401) {
      await axios
        .get('/refresh')
        .catch((err) => {
          return Promise.reject(err);
        });
      console.log(error.config);
      LocalStorage.removeAccessToken();
      axios.defaults.headers.common['access_token'] = ''
      return axios(error.config);
    } else {
      // LocalStorage.remove('access_token');
      return Promise.reject(error);
    }
  })
