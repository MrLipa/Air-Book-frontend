import { useEffect } from 'react';
import { axiosPrivate } from '@/services';
import { useRefreshToken } from '@/hooks';
import { useAuth } from '@/hooks';
import { AuthContextProps } from '@/types/auth';

let refreshPromise: Promise<string> | null = null;

export const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth() as AuthContextProps;

  useEffect(() => {
    // Request interceptor
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        config.withCredentials = true;
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth?.accessToken || ''}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;

        if (
          (error?.response?.status === 403 || error?.response?.status === 500) &&
          !prevRequest?.sent
        ) {
          prevRequest.sent = true;

          try {
            if (!refreshPromise) {
              refreshPromise = refresh();
              refreshPromise.finally(() => {
                refreshPromise = null;
              });
            }
            const newAccessToken = await refreshPromise;

            prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            prevRequest.withCredentials = true;
            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth?.accessToken, refresh]);

  return axiosPrivate;
};
