import { axiosPrivate } from '@/services/apiClient';
import { useAuth } from '@/hooks';
import { AuthContextProps } from '@/types/auth';

export const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

  const refresh = async (): Promise<string> => {
    const response = await axiosPrivate.get('/refreshToken');

    const newAuth: Partial<AuthContextProps['auth']> = {
      accessToken: response.data.accessToken,
      userId: response.data.userId,
      role: response.data.role,
    };

    if (!setAuth) {
      throw new Error('Auth provider is missing');
    }

    setAuth(newAuth);
    return response.data.accessToken;
  };

  return refresh;
};
