import { FiArrowRight, FiUser } from "react-icons/fi";
import "./DashboardSideBar.scss";
import { signOutUserStart, signOutUserSuccess } from "../../app/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DashboardSideBar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const searchUrlParams = new URLSearchParams(window.location.search);
  const tab = searchUrlParams.get("tab");
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const handleSignOut = async () => {
    dispatch(signOutUserStart());
    try {
      const res = await fetch(`api/auth/sign-out/${currentUser.data._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = res.json();

      if (!res.ok) {
        notify(data.message, "error");
      } else {
        dispatch(signOutUserSuccess());
        notify(data.message, "success");
        navigate("/sign-in");
      }
    } catch (error) {
      notify(error.message, "error");
    }
  };
  return (
    <div className="side--bar">
      <div className={`profile ${tab === "profile" ? "active" : ""}`}>
        <p>
          <FiUser size="2rem" />
          Profile
        </p>
        <span>{"User"}</span>
      </div>
      <div className="sign-out" onClick={handleSignOut}>
        <FiArrowRight size="2rem" />
        Sign Out
      </div>

      <ToastContainer
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "black",
        }}
      />
    </div>
  );
};
export default DashboardSideBar;
