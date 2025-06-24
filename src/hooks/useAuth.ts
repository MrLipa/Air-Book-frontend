import { useContext, useDebugValue } from 'react';
import { AuthContext } from '@/context';
import { AuthContextProps } from '@/types/auth';

export const useAuth = (): Partial<AuthContextProps> => {
  const context = useContext(AuthContext) as Partial<AuthContextProps>;

  useDebugValue(context.auth, (auth) => (auth ? 'Logged In' : 'Logged Out'));

  return context;
};
