import axios, { AxiosResponse } from 'axios';
import LocalStorage from './LocalStorage';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

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
      return axios(error.config);
    } else {
      LocalStorage.remove('uid');
      return Promise.reject(error);
    }
  })
