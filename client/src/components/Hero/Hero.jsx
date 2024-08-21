import { Link } from "react-router-dom";
import "./Hero.scss";

const Hero = () => {
  return (
    <div className="hero">
      <h1>Welcome to my Blog</h1>
      <p>
        Here you'll find a variety of articles and tutorials on topics such as
        web development, software engineering, and programming languages.
      </p>
      <Link to="/search" className="allPost">View all posts</Link>
    </div>
  );
};
export default Hero;
