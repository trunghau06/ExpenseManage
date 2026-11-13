import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const hostUri =
  Constants.expoConfig?.hostUri;

const DEV_IP =
  hostUri?.split(':')[0] ||
  'localhost';

let authToken: string | null = null;

export const setAuthToken = (
  token: string | null
) => {
  authToken = token;
};

const axiosClient = axios.create({
  baseURL: `http://${DEV_IP}:5000/api`,
  timeout: 10000,
});

axiosClient.interceptors.request.use(
  async (config) => {
    const token =
      authToken ||
      (await SecureStore.getItemAsync('token'));

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

export default axiosClient;