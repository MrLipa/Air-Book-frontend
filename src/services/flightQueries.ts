import { useQuery } from 'react-query';
import { sendRequest } from '@/services/request';
import { useAxiosPrivate } from '@/hooks/useAxiosPrivate';

export const useGetAllFlights = () => {
  const axios = useAxiosPrivate();
  return useQuery(['getAllFlights'], () =>
    sendRequest(axios, '/flight/getAllFlights', 'GET', null)
  );
};

export const useSearchFlights = (cityFrom: string, cityTo: string) => {
  const axios = useAxiosPrivate();
  return useQuery(['searchFlights', cityFrom, cityTo], () =>
    sendRequest(axios, '/flight/searchFlights', 'POST', { cityFrom, cityTo })
  );
};

export const useGetFlightsByIds = (flightIds: string[]) => {
  const axios = useAxiosPrivate();
  return useQuery(['getFlightsByIds', flightIds], () =>
    sendRequest(axios, '/flight/getFlightsByIds', 'POST', { flightIds })
  );
};
