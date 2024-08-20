import { AiOutlineSearch } from "react-icons/ai";
import "./Header.scss";
import { FaMoon } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";

const Headers = () => {
  return (
    <section className="header">
      <div className="logo">
        <span>Aryan's</span>
        <span>Blog</span>
      </div>

      <div className="search--bar">
        <input type="text" placeholder="Search..." />
        <AiOutlineSearch size={"20px"} color="grey" />
      </div>

      <div className="theme-signin-wrapper">
        <button className="theme-toggler-btn btn">
          <FaMoon />
        </button>
        <Link to="/sign-in">
          <button className="signin-btn btn">Sign In</button>
        </Link>
      </div>

      <div className="nav--links">
        <NavLink to="/" className="nav--link">
          Home
        </NavLink>
        <NavLink to="/about" className="nav--link">
          About
        </NavLink>
        <NavLink to="/projects" className="nav--link">
          Projects
        </NavLink>
      </div>
    </section>
  );
};
export default Headers;
