import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const DEV_IP = '172.16.0.74';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

const axiosClient = axios.create({
  baseURL: `http://${DEV_IP}:5000/api`,
  timeout: 10000,
});

axiosClient.interceptors.request.use(async (config) => {
  const token =
    authToken ||
    (await SecureStore.getItemAsync('token'));

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosClient;