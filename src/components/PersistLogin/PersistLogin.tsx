import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useRefreshToken } from "@/hooks";
import { useAuth } from "@/hooks";
import { AuthContextProps } from "@/types";

export const PersistLogin: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth() as AuthContextProps;

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error("Token refresh failed:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (!auth?.accessToken && persist) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [auth?.accessToken, persist, refresh]);

  if (!persist) {
    return <Outlet />;
  }

  return isLoading ? <p>Loading...</p> : <Outlet />;
};
