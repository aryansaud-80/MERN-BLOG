import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../app/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import GoogleAuth from "../components/GoogleAuth/GoogleAuth";

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const error = useSelector((state) => state.user.error);
  const loading = useSelector((state) => state.user.loading);

  const dispatch = useDispatch();

  const id = useId();

  const notify = (message, type) => {
    toast(message, {
      type: type,
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Flip,
    });
  };

  const handleResetFormData = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        if (res.status === 400) {
          throw new Error("All fields are required");
        } else if (res.status === 401) {
          throw new Error("Invalid email or password");
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        notify(data.message, "error");
      }
      console.log("SignUp Success", data);

      dispatch(signInSuccess(data));
      // notify("SignIn Success", "success");
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
      notify(error.message, "error");
    } finally {
      handleResetFormData();
    }
  };

  return (
    <section className="auth">
      <div className="right">
        <div className="logo">
          <span>Aryan's</span>
          <span>Blog</span>
        </div>
        <p>
          This is a Aryan's blog. You can sign in with your email and password
          or with Google.
        </p>
      </div>
      <div className="left">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor={id + "email"}>Your email</label>
            <input
              type="email"
              name="email"
              id={id + "email"}
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor={id + "password"}>Your password</label>
            <input
              type="password"
              name="password"
              id={id + "password"}
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Sign In"}
          </button>

          <GoogleAuth />

          <p className="sign-inPath">
            Don't Have an account?
            <Link className="link" to="/sign-up">
              Sign up
            </Link>
          </p>
        </form>
      </div>

      <ToastContainer
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "black",
        }}
      />

      {error && ""}
    </section>
  );
};
export default SignIn;
