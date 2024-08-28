import { useState } from "react";
import "./User.scss";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOutUserStart, signOutUserSuccess } from "../../app/user/userSlice";
import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const User = ({ currentUser }) => {
  const [profileMenu, setProfileMenu] = useState(false);
  const handleProfileMenu = () => {
    setProfileMenu((prevMenu) => !prevMenu);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  document.addEventListener("click", (e) => {
    if (e.target.closest(".user")) return;
    setProfileMenu(false);
  });

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
    <div className="user">
      <div className="user_logo" onClick={handleProfileMenu}>
        <img
          src={
            currentUser.data.avatar ||
            "https://www.w3schools.com/howto/img_avatar.png"
          }
          alt="user"
        />
      </div>

      <div className={`user-info ${profileMenu && "active"}`}>
        <div>
          <span className="user_name">@{currentUser.data.username}</span>
          <span className="user_email">{currentUser.data.email}</span>
        </div>

        <div>
          <Link to="/dashboard?tab=profile">
            <p>Profile</p>
          </Link>
          <hr />
          <p onClick={handleSignOut}>Sign out</p>
        </div>
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
export default User;
