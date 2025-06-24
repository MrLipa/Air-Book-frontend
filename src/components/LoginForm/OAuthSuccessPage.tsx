import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks";
import { useToast } from "@/context";
import { ToastSeverity } from "@/types";

export const OAuthSuccessPage = () => {
  const { setAuth } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("accessToken");
    const userId = params.get("userId");
    const role = params.get("role");

    if (accessToken && userId && role) {
      if (setAuth) {
        setAuth({ accessToken, userId, role });
        }
        showToast(ToastSeverity.SUCCESS, "Login Success", "Welcome with Facebook!");
        navigate("/profile", { replace: true });
    } else {
        showToast(ToastSeverity.ERROR, "Login failed", "Invalid Facebook OAuth data.");
        navigate("/login", { replace: true });
    }
  }, [location, setAuth, showToast, navigate]);

  return <div>Logging in with Facebook...</div>;
};
