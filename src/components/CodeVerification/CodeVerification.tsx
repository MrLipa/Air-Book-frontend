import React, { useState, useRef, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NewPassword } from "@/components";

const CODE_REGEX = /^\d{4}$/;

interface CodeVerificationProps {
  sendCode: string;
  email: string;
}

export const CodeVerification: React.FC<CodeVerificationProps> = ({ sendCode, email }) => {
  const codeRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const [code, setCode] = useState("");
  const [validCode, setValidCode] = useState(false);
  const [codeFocus, setCodeFocus] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    codeRef.current?.focus();
  }, []);

  useEffect(() => {
    setValidCode(CODE_REGEX.test(code));
    setErrMsg(""); // reset błędu przy zmianie kodu
  }, [code]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validCode && code === sendCode) {
      setSuccess(true);
      setCode("");
    } else {
      setErrMsg("Incorrect code. Please try again.");
      errRef.current?.focus();
    }
  };

  return (
    <>
      {success ? (
        <NewPassword email={email} />
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h2>Code Verification</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="code">
              Code:
              <FontAwesomeIcon icon={faCheck} className={validCode && code ? "valid" : "hide"} />
              <FontAwesomeIcon icon={faTimes} className={!validCode && code ? "invalid" : "hide"} />
            </label>
            <input
              type="text"
              id="code"
              ref={codeRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              aria-invalid={!validCode}
              aria-describedby="codeHelp"
              onFocus={() => setCodeFocus(true)}
              onBlur={() => setCodeFocus(false)}
            />
            <p id="codeHelp" className={codeFocus && !validCode ? "instructions" : "offscreen"}>
              <FontAwesomeIcon icon={faInfoCircle} /> Enter the 4-digit code sent to your email.
            </p>
            <button disabled={!validCode}>Verify Code</button>
          </form>
        </section>
      )}
    </>
  );
};
