import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { FaFacebookF, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { SiMicrosoftazure } from "react-icons/si"; // Dodaj Azure
import { useAuth } from "@/hooks";
import { useToast } from "@/context";
import { ForgetPassword } from "@/components";
import { AuthContextProps, ToastSeverity } from "@/types";
import { axiosPrivate } from "@/services";
import './LoginForum.css';

const FACEBOOK_CLIENT_ID = import.meta.env.VITE_FACEBOOK_CLIENT_ID;
const FACEBOOK_REDIRECT_URI = import.meta.env.VITE_FACEBOOK_REDIRECT_URI;

const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
const LINKEDIN_REDIRECT_URI = import.meta.env.VITE_LINKEDIN_REDIRECT_URI;

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const GITHUB_REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI;

const AZURE_CLIENT_ID = import.meta.env.VITE_AZURE_CLIENT_ID;
const AZURE_REDIRECT_URI = import.meta.env.VITE_AZURE_REDIRECT_URI;
const AZURE_TENANT_ID = import.meta.env.VITE_AZURE_TENANT_ID;

export const LoginForm: React.FC = () => {
  const { setAuth, persist, setPersist } = useAuth() as AuthContextProps;
  const { showToast } = useToast();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/profile";

  const emailRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [forgetPassword, setForgetPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    localStorage.setItem("persist", persist.toString());
  }, [persist]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosPrivate.post(`login`,
        { email, password: pwd },
        { withCredentials: true }
      );

      const { accessToken, userId, role } = response.data;

      setAuth({ accessToken, userId, role });
      setEmail("");
      setPwd("");
      showToast(ToastSeverity.SUCCESS, "Login Success", "Welcome back!");
      navigate(from, { replace: true });
    } catch (error: any) {
      showToast(
        ToastSeverity.ERROR,
        "Login Failed",
        error.response?.status === 401
          ? "Wrong email or password."
          : "Server error. Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePersist = () => setPersist((prev) => !prev);

  if (forgetPassword) return <ForgetPassword />;

  const handleFacebookLogin = () => {
    const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=${encodeURIComponent(FACEBOOK_REDIRECT_URI)}&scope=email&response_type=code&state=xyz123`;
    window.location.href = url;
  };

  const handleLinkedinLogin = () => {
    const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(LINKEDIN_REDIRECT_URI)}&scope=${encodeURIComponent("openid profile email")}&state=xyz123`;
    window.location.href = url;
  };

  const handleGithubLogin = () => {
    const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URI)}&scope=${encodeURIComponent("user:email")}&state=xyz123`;
    window.location.href = url;
  };

  const handleAzureLogin = () => {
    const url = `https://login.microsoftonline.com/${AZURE_TENANT_ID}/oauth2/v2.0/authorize?client_id=${AZURE_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(AZURE_REDIRECT_URI)}&response_mode=query&scope=${encodeURIComponent("openid profile email User.Read")}&state=xyz123`;
    window.location.href = url;
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "1rem",
              color: "#fff",
            }}
          >
            <Card.Body>
              <Card.Title className="mb-4 text-center">Sign In</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    ref={emailRef}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPersist">
                  <Form.Check
                    type="checkbox"
                    label="Trust this device"
                    checked={persist}
                    onChange={togglePersist}
                  />
                </Form.Group>

                <Button variant="light" type="submit" className="w-100" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </Form>

              <div className="mt-3 text-center">
                <Link
                  to="/login"
                  onClick={(e) => {
                    e.preventDefault();
                    setForgetPassword(true);
                  }}
                  className="text-light"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="mt-2 text-center text-light">
                Need an account?{" "}
                <Link to="/register" className="text-light">
                  Sign up
                </Link>
              </div>
              <div className="social-login-row">
                <span className="social-icon facebook" onClick={handleFacebookLogin} style={{ cursor: "pointer" }}>
                  <FaFacebookF size={48} />
                </span>
                <span className="social-icon linkedin" onClick={handleLinkedinLogin} style={{ cursor: "pointer" }}>
                  <FaLinkedinIn size={48} />
                </span>
                <span className="social-icon github" onClick={handleGithubLogin} style={{ cursor: "pointer" }}>
                  <FaGithub size={48} />
                </span>
                <span className="social-icon azure" onClick={handleAzureLogin} style={{ cursor: "pointer" }}>
                  <SiMicrosoftazure size={48} />
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
