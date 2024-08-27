import { useState } from "react";
import "./User.scss";
import { Link } from "react-router-dom";
import { persistor } from "../../app/store";
import { useNavigate } from "react-router-dom";

const User = ({ currentUser }) => {
  const [profileMenu, setProfileMenu] = useState(false);
  const handleProfileMenu = () => {
    setProfileMenu((prevMenu) => !prevMenu);
  };

  const navigate = useNavigate();

  document.addEventListener("click", (e) => {
    if (e.target.closest(".user")) return;
    setProfileMenu(false);
  });

  const handleSignOut = () => {
    // localStorage.removeItem("persist:root");
    persistor.purge();
    navigate("/sign-in");
    window.location.reload();
  };
  return (
    <div className="user">
      <div className="user_logo" onClick={handleProfileMenu}>
        <img src={currentUser.data.avatar||"https://www.w3schools.com/howto/img_avatar.png"}alt="user" />
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
    </div>
  );
};
export default User;
