import { axiosPrivate } from '@/services/apiClient';
import { useAuth } from '@/hooks';
import { AuthContextProps } from '@/types/auth';

export const useLogout = () => {
  const { setAuth } = useAuth() as AuthContextProps;

  const logout = async () => {
    try {
      setAuth({});
      await axiosPrivate.get('/logout', { withCredentials: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return logout;
};
