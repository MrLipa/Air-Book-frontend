import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { axiosPrivate } from "@/services";
import { RegisterSuccess } from "@/components";
import { useToast } from "@/context";
import { ToastSeverity } from "@/types";
import "./RegisterForum.css";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export const RegisterForm: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("user");

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validEmail || !validPwd || !validMatch || !firstName || !lastName) {
      showToast(ToastSeverity.ERROR, "Invalid Entry", "Please complete all required fields.");
      return;
    }

    setLoading(true);
    try {
      await axiosPrivate.post(`/register`,
        {
          firstName: firstName,
          lastName: lastName,
          email,
          password: pwd,
          role,
        },
        { withCredentials: true }
      );

      showToast(ToastSeverity.SUCCESS, "Registration successful", "You can now log in.");
      setSuccess(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPwd("");
      setMatchPwd("");
      setRole("user");
    } catch (err: any) {
      if (!err?.response) {
        showToast(ToastSeverity.ERROR, "Registration Failed", "No Server Response");
      } else if (err.response?.status === 409) {
        showToast(ToastSeverity.ERROR, "Registration Failed", "Email Already Registered");
      } else {
        showToast(ToastSeverity.ERROR, "Registration Failed", "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) return <RegisterSuccess />;

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
              <Card.Title className="mb-4 text-center">Register</Card.Title>
              <Form onSubmit={handleSubmit}>

                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="None">None</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <div className="d-flex align-items-center gap-2">
                    <Form.Control
                      type="email"
                      ref={emailRef}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocus(true)}
                      onBlur={() => setEmailFocus(false)}
                      required
                      aria-invalid={!validEmail}
                    />
                    <FontAwesomeIcon icon={faCheck} className={validEmail ? "text-success" : "d-none"} />
                    <FontAwesomeIcon icon={faTimes} className={!validEmail && email ? "text-danger" : "d-none"} />
                  </div>
                  {emailFocus && email && !validEmail && (
                    <small className="text-light">
                      <FontAwesomeIcon icon={faInfoCircle} /> Must be a valid email address.
                    </small>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <div className="d-flex align-items-center gap-2">
                    <Form.Control
                      type="password"
                      value={pwd}
                      onChange={(e) => setPwd(e.target.value)}
                      onFocus={() => setPwdFocus(true)}
                      onBlur={() => setPwdFocus(false)}
                      required
                      aria-invalid={!validPwd}
                    />
                    <FontAwesomeIcon icon={faCheck} className={validPwd ? "text-success" : "d-none"} />
                    <FontAwesomeIcon icon={faTimes} className={!validPwd && pwd ? "text-danger" : "d-none"} />
                  </div>
                  {pwdFocus && !validPwd && (
                    <small className="text-light">
                      <FontAwesomeIcon icon={faInfoCircle} /> 8-24 characters, 1 uppercase, 1 lowercase, 1 digit, 1 special (!@#$%).
                    </small>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <div className="d-flex align-items-center gap-2">
                    <Form.Control
                      type="password"
                      value={matchPwd}
                      onChange={(e) => setMatchPwd(e.target.value)}
                      onFocus={() => setMatchFocus(true)}
                      onBlur={() => setMatchFocus(false)}
                      required
                      aria-invalid={!validMatch}
                    />
                    <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "text-success" : "d-none"} />
                    <FontAwesomeIcon icon={faTimes} className={!validMatch && matchPwd ? "text-danger" : "d-none"} />
                  </div>
                  {matchFocus && !validMatch && (
                    <small className="text-light">
                      <FontAwesomeIcon icon={faInfoCircle} /> Must match the first password field.
                    </small>
                  )}
                </Form.Group>

                <Button
                  variant="light"
                  type="submit"
                  className="w-100"
                  disabled={
                    !validEmail || !validPwd || !validMatch || !firstName || !lastName || loading
                  }
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </Button>
              </Form>

              <div className="mt-3 text-center text-light">
                Already registered? <Link to="/login" className="text-light">Sign In</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
