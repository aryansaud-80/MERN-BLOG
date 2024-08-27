import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

const verifyUser = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return next(new ApiError(401, "Unauthorized"));
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return next(new ApiError(401, "Unauthorized by secret"));
    }
    req.user = user;
    next();
  });
};

export default verifyUser;
