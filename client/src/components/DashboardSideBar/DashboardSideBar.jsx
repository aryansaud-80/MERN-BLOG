import { FiArrowRight, FiUser } from "react-icons/fi";
import "./DashboardSideBar.scss";

const DashboardSideBar = () => {
  const searchUrlParams = new URLSearchParams(window.location.search);
  const tab = searchUrlParams.get("tab");
  return (
    <div className="side--bar">
      <div className={`profile ${tab === "profile" ? "active" : ""}`}>
        <p>
          <FiUser size="2rem" />
          Profile
        </p>
        <span>{"User"}</span>
      </div>
      <div className="sign-out">
        <FiArrowRight size="2rem" />
        Sign Out
      </div>
    </div>
  );
};
export default DashboardSideBar;
