import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { axiosPrivate } from "@/services";
import emailjs from "emailjs-com";
import { CodeVerification } from "@/components";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const generate4DigitCode = () => {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join("");
};

export const ForgetPassword: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [code, setCode] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setErrMsg("");
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await axiosPrivate.get(`/user/get_user_id/${email}`);
      if (!data?.userid) throw new Error("User not found");

      const generatedCode = generate4DigitCode();
      setCode(generatedCode);

      await emailjs.send(
        "service_o04tdit",
        "template_bfgaxzg",
        { email, code: generatedCode },
        "2o2fNoo33ujoejxG5"
      );

      setSuccess(true);
    } catch (err: any) {
      const errorMessage = !err?.response
        ? "No Server Response"
        : err.response?.status === 404
        ? "User not found"
        : "Failed to send reset code. Please try again.";

      setErrMsg(errorMessage);
      errRef.current?.focus();
    }
  };

  if (success) {
    return <CodeVerification sendCode={code} email={email} />;
  }

  return (
    <section>
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>

      <h1>Reset Password</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">
          Email:
          <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
          <FontAwesomeIcon icon={faTimes} className={!validEmail && email ? "invalid" : "hide"} />
        </label>
        <input
          type="email"
          id="email"
          ref={emailRef}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-invalid={!validEmail}
          aria-describedby="emailnote"
          onFocus={() => setEmailFocus(true)}
          onBlur={() => setEmailFocus(false)}
        />
        <p
          id="emailnote"
          className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}
        >
          <FontAwesomeIcon icon={faInfoCircle} /> Enter a valid email address.
        </p>

        <button type="submit" disabled={!validEmail}>
          Send Verification Code
        </button>
      </form>
    </section>
  );
};
