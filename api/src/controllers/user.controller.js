import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens");
  }
};

export const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((field) => field === "")) {
    throw new ApiError(400, "All field are required");
  }

  const userExists = await User.findOne({ $or: [{ username }, { email }] });

  if (userExists) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Error creating user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "User created successfully", createdUser));
});

export const signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const passwordMatch = user.comparePassword(password);

  console.log(passwordMatch);

  if (!passwordMatch) {
    throw new ApiError(401, "Invalid password!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select("-password");

  const options = {
    httpOnly: true,
    secure: false,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, "User signed in successfully", loggedInUser));
});

export const googleAuth = asyncHandler(async (req, res) => {
  const { name, email, photoUrl } = req.body;



  const user = await User.findOne({ email });
  if (user) {
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const loginUser = await User.findById(user._id).select("-password");

    const options = {
      httpOnly: true,
      secure: false,
    };

    res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(new ApiResponse(200, "User signed in successfully", loginUser));
  } else {
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const newUser = await User.create({
      username:
        name.toLowerCase().split(" ").join("") +
        Math.random().toString(9).slice(-4),
      email,
      password: generatedPassword,
      avatar: photoUrl,
    });
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      newUser._id
    );

    const data = await User.findById(newUser._id).select("-password ");

    const options = {
      httpOnly: true,
      secure: false,
    };

    res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(new ApiResponse(200, "User signed in successfully", data));
  }

  throw new ApiError(500, "Error signing in with Google");
});
