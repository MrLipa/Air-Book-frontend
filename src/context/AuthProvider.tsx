import { createContext, useState, useEffect, useMemo, FC } from "react";
import { AuthContextType, AuthProviderProps } from "@/types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<object>({});

  const [persist, setPersist] = useState<boolean>(() => {
    const stored = localStorage.getItem("persist");
    return stored === null ? true : stored === "true" || stored === "1";
  });

  useEffect(() => {
    localStorage.setItem("persist", persist.toString());
  }, [persist]);

  const contextValue = useMemo(() => ({ auth, setAuth, persist, setPersist }), [auth, persist]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
