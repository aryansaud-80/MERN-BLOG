import { Link } from "react-router-dom";
import "./Footer.scss";
import { FaBlog, FaFacebook, FaInstagram } from "react-icons/fa";
import { FaGithub, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const IconStyle = {
    fontSize: "2.4rem",
    margin: "0 0.8rem",
    color: "#374151",
  };
  return (
    <>
      <footer className="footer">
        <div className="footer--content">
          <div className="right">
            <Link to="/" className="logo-link">
              <div className="logo">
                <span>Aryan's</span>
                <span>Blog</span>
              </div>
            </Link>
          </div>

          <div className="left">
            <div className="about">
              <h1>About</h1>
              <Link to="/projects">Projects</Link>
              <Link to="/about">About Me</Link>
            </div>
            <div className="follow">
              <h1>Follow</h1>
              <Link to="https://github.com/aryansaud-80" target="_blank">
                Github
              </Link>
              <Link
                to="https://www.linkedin.com/in/aryan-saud/"
                target="_blank"
              >
                LinkedIn
              </Link>
            </div>
            <div className="legal">
              <h1>Legal</h1>
              <Link to="/">Privacy Policy</Link>
              <Link to="/">Terms & Service</Link>
            </div>
          </div>
        </div>

        <div className="footer--copyright">
          <p>&copy; 2024 Aryan's Blog</p>

          <div className="social--icons">
            <Link
              to="https://www.facebook.com/aryan.saud.56?mibextid=ZbWKwL"
              target="_blank"
            >
              <FaFacebook style={IconStyle} />
            </Link>
            <Link
              to="https://www.instagram.com/aryan.saud.56?igsh=MW5sYXpwbHZwOGk1MA=="
              target="_blank"
            >
              <FaInstagram style={IconStyle} />
            </Link>
            <Link to="https://github.com/aryansaud-80" target="_blank">
              <FaGithub style={IconStyle} />
            </Link>
            <Link
              to="https://x.com/dev_beginners?t=mu3KY841wKN0iqNheZA-Sg&s=09"
              target="_blank"
            >
              <FaXTwitter style={IconStyle} target="_blank" />
            </Link>
            <Link to="/">
              <FaBlog style={IconStyle} />
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};
export default Footer;
