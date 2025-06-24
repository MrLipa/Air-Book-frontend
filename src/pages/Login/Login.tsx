import { LoginForm } from "@/components";
import { Navbar } from "@/components";
import { Footer } from "@/components";
import "./Login.css";

export const Login = () => {
  return (
    <>
      <div className="wrapper">
        <Navbar />
        <div className="login-section">
          <LoginForm />
        </div>
      </div>
      <Footer />
    </>
  );
};
