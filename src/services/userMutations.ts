import { useMutation, useQueryClient } from 'react-query';
import { sendRequest } from '@/services/request';
import { useAxiosPrivate } from '@/hooks/useAxiosPrivate';
import { useToast } from '@/context/ToastProvider';
import { User, ToastSeverity } from '@/types';

export const usePatchUserByIdMutation = (userId: string) => {
  const axios = useAxiosPrivate();
  const { showToast } = useToast();

  return useMutation(
    (data: Partial<User>) => sendRequest(axios, `/user/patchUserById/${userId}`, 'PATCH', data),
    {
      onSuccess: () => {
        showToast(ToastSeverity.SUCCESS, 'Success', 'User updated successfully');
      },
      onError: () => {
        showToast(ToastSeverity.ERROR, 'Error', 'Failed to update user');
      },
    }
  );
};

export const useDeleteUserByIdMutation = () => {
  const axios = useAxiosPrivate();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation(
    (userId: string) => sendRequest(axios, `/user/deleteUserById/${userId}`, 'DELETE', null),
    {
      onSuccess: () => {
        showToast(ToastSeverity.SUCCESS, 'Success', 'User deleted successfully');
        queryClient.invalidateQueries(['getAllUsers']);
      },
      onError: () => {
        showToast(ToastSeverity.ERROR, 'Error', 'Failed to delete user');
      },
    }
  );
};

export const useCreateNotificationMutation = () => {
  const axios = useAxiosPrivate();
  const { showToast } = useToast();

  return useMutation(
    (data: { userId: string; message: string }) =>
      sendRequest(axios, '/user/createNotification', 'POST', data),
    {
      onSuccess: () => {
        showToast(ToastSeverity.SUCCESS, 'Success', 'Notification sent');
      },
      onError: () => {
        showToast(ToastSeverity.ERROR, 'Error', 'Failed to send notification');
      },
    }
  );
};

export const useCreateReservationMutation = () => {
  const axios = useAxiosPrivate();
  const { showToast } = useToast();

  return useMutation(
    (data: { userId: string; flightId: string }) =>
      sendRequest(axios, '/user/createReservation', 'POST', data),
    {
      onSuccess: () => {
        showToast(ToastSeverity.SUCCESS, 'Success', 'Reservation created');
      },
      onError: () => {
        showToast(ToastSeverity.ERROR, 'Error', 'Failed to create reservation');
      },
    }
  );
};

export const useDeleteReservationMutation = (userId: string) => {
  const axios = useAxiosPrivate();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation(
    (reservationId: string) =>
      sendRequest(axios, `/user/deleteReservationById/${reservationId}`, 'DELETE', null),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['getFlightsByUserId', userId]);
        showToast(ToastSeverity.SUCCESS, 'Success', 'Reservation deleted');
      },
      onError: () => {
        showToast(ToastSeverity.ERROR, 'Error', 'Failed to delete reservation');
      },
    }
  );
};
