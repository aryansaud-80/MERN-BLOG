import { AiFillGoogleCircle } from "react-icons/ai";
import "./GoogleAuth.scss";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../../assets/firebase.config";
import { signInSuccess } from "../../app/user/userSlice";

const GoogleAuth = () => {
  const buttonStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    padding: "0.8rem 1rem",
  };

  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const result = await signInWithPopup(auth, provider);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photoUrl: result.user.photoURL,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <button style={buttonStyle} type="button" onClick={handleGoogleClick}>
        <AiFillGoogleCircle size={"28px"} color="black" />
        <span
          style={{
            marginLeft: "1rem",
          }}
        >
          Sign in with Google
        </span>
      </button>
    </>
  );
};
export default GoogleAuth;
