import { AiOutlineSearch } from "react-icons/ai";
import "./Header.scss";
import { FaMoon } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { RiMenu2Line } from "react-icons/ri";
import { useState } from "react";

const Headers = () => {
  const [menu, setMenu] = useState(false);

  const handleMenu = () => {
    setMenu((prevMenu) => !prevMenu);
  };
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

      <Link to="/search" className="search-btn">
        <button className="btn">
          <AiOutlineSearch />
        </button>
      </Link>

      <div className="theme-signin-wrapper">
        <button className="theme-toggler-btn btn">
          <FaMoon />
        </button>
        <Link to="/sign-in">
          <button className="signin-btn btn">Sign In</button>
        </Link>

        <div className="hamburger-menu" onClick={handleMenu}>
          <RiMenu2Line size="30px" />
        </div>
      </div>

      <div className={`nav--links ${menu ? "active" : ""}`}>
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
