import { RegisterForm } from "@/components";
import { Navbar } from "@/components";
import { Footer } from "@/components";
import "./Register.css";

export const Register = () => {
  return (
    <>
      <div className="wrapper">
        <Navbar />
        <div className="register-section">
          <RegisterForm />
        </div>
      </div>
      <Footer />
    </>
  );
};
