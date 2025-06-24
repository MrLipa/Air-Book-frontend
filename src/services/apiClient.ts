import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_BASE_API_URL;

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export default axiosPrivate;
