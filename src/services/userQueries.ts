import { useQuery } from 'react-query';
import { sendRequest } from '@/services/request';
import { NotificationType } from "@/types";
import { useAxiosPrivate } from '@/hooks/useAxiosPrivate';

export const useGetUserById = (userId: string) => {
  const axios = useAxiosPrivate();
  return useQuery(['getUserById', userId], () =>
    sendRequest(axios, `/user/getUserById/${userId}`, 'GET', null),
    {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30
    }
  );
};

export const useGetFlightsByUserId = (userId: string) => {
  const axios = useAxiosPrivate();
  return useQuery(['getFlightsByUserId', userId], () =>
    sendRequest(axios, `/flight/getFlightsByUserId/${userId}`, 'GET', null)
  );
};

export const useGetNotificationsByUserId = (userId: string) => {
  const axios = useAxiosPrivate();
  return useQuery<NotificationType[]>(
    ['getNotificationsByUserId', userId],
    () => sendRequest(axios, `/user/getNotificationsByUserId/${userId}`, 'GET', null)
  );
};
