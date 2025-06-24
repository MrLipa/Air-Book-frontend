import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { axiosPrivate } from "@/services";
import { RegisterSuccess } from "@/components";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

interface EmailProps {
  email: string;
}

export const NewPassword: React.FC<EmailProps> = ({ email }) => {
  const errRef = useRef<HTMLParagraphElement>(null);
  const [pwd, setPwd] = useState(""), [validPwd, setValidPwd] = useState(false), [pwdFocus, setPwdFocus] = useState(false);
  const [matchPwd, setMatchPwd] = useState(""), [validMatch, setValidMatch] = useState(false), [matchFocus, setMatchFocus] = useState(false);
  const [errMsg, setErrMsg] = useState(""), [success, setSuccess] = useState(false);

  useEffect(() => { setValidPwd(PWD_REGEX.test(pwd)); setValidMatch(pwd === matchPwd); }, [pwd, matchPwd]);
  useEffect(() => { setErrMsg(""); }, [pwd, matchPwd]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axiosPrivate.get<{ userid: number }>(`/user/get_user_id/${email}`);
      await axiosPrivate.put(`/user/${res.data.userid}`, { password: pwd }, { headers: { "Content-Type": "application/json" } });
      setPwd(""); setMatchPwd(""); setSuccess(true);
    } catch (err: any) {
      if (!err?.response) setErrMsg("No Server Response");
      else if (err.response?.status === 404) setErrMsg("User not found.");
      else setErrMsg("Password update failed.");
      errRef.current?.focus();
    }
  };

  return success ? <RegisterSuccess /> : (
    <section>
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="password">Password:
          <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
          <FontAwesomeIcon icon={faTimes} className={!validPwd && pwd ? "invalid" : "hide"} />
        </label>
        <input type="password" id="password" value={pwd} onChange={(e) => setPwd(e.target.value)} required aria-invalid={!validPwd} aria-describedby="pwdnote" onFocus={() => setPwdFocus(true)} onBlur={() => setPwdFocus(false)} />
        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
          <FontAwesomeIcon icon={faInfoCircle} /> 8 to 24 characters. <br /> Must include uppercase and lowercase letters, a number and a special character. <br /> Allowed: <span>! @ # $ %</span>
        </p>

        <label htmlFor="confirm_pwd">Confirm Password:
          <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
          <FontAwesomeIcon icon={faTimes} className={!validMatch && matchPwd ? "invalid" : "hide"} />
        </label>
        <input type="password" id="confirm_pwd" value={matchPwd} onChange={(e) => setMatchPwd(e.target.value)} required aria-invalid={!validMatch} aria-describedby="confirmnote" onFocus={() => setMatchFocus(true)} onBlur={() => setMatchFocus(false)} />
        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
          <FontAwesomeIcon icon={faInfoCircle} /> Must match the first password field.
        </p>

        <button disabled={!validPwd || !validMatch}>Change Password</button>
      </form>
    </section>
  );
};
