import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const OAuthFailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, location]);

  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <h2>OAuth login failed</h2>
      <p>
        Sorry, something went wrong while logging in with Facebook.
        <br />
        {location.search && (
          <>
            <strong>Reason:</strong> <code>{new URLSearchParams(location.search).get("reason")}</code>
          </>
        )}
      </p>
      <p>You will be redirected to the login page shortly...</p>
    </div>
  );
};
