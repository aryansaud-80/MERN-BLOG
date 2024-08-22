import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      setError(false);
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        if (res.status === 400) {
          throw new Error("All fields are required");
        } else if (res.status === 409) {
          throw new Error("User already exists");
        }
        setError(true);
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("SignUp Success", data);
      // notify("SignUp Success", "success");
      navigate("/sign-in");
    } catch (error) {
      setError(true);
      setLoading(false);
      notify(error.message, "error");
    } finally {
      setLoading(false);
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
          This is a Aryan's blog. You can sign up with your email and password
          or with Google.
        </p>
      </div>
      <div className="left">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor={id + "username"}>Your username</label>
            <input
              type="text"
              name="username"
              id={id + "username"}
              placeholder="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

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
            {loading ? "Loading..." : "Sign Up"}
          </button>

          <p className="sign-inPath">
            Have an account? <Link className="link" to="/sign-in">Sign in</Link>
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
export default SignUp;
