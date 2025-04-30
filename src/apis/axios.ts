import axios, { AxiosInstance } from 'axios';

export const baseApi: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_UPBIT_REST_API_URL}`,
  timeout: 10000,
});
