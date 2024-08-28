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

    return res
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

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(new ApiResponse(200, "User signed in successfully", data));
  }

  throw new ApiError(500, "Error signing in with Google");
});

export const updateUser = asyncHandler(async (req, res) => {
  const id = req.params.userId;

  if (id !== req.user._id) {
    throw new ApiError(403, "You are not authorized to perform this action");
  }

  const { username, email, password, avatar } = req.body;

  const inValid = [username, email, password, avatar].every(
    (field) => field === ""
  );

  if (inValid) {
    throw new ApiError(400, "At least one field is required");
  }

  const user = await User.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        username: username?.trim().toLowerCase(),
        email,
        password,
        avatar,
      },
    }
  );

  if (!user) {
    throw new ApiError(500, "Error updating user");
  }

  const userData = await User.findById(user._id).select("-password");

  const options = {
    httpOnly: true,
    secure: false,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, "User updated successfully", userData));
});

export const deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.userId;

  if (id !== req.user._id) {
    throw new ApiError(403, "You are not authorized to perform this action");
  }

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new ApiError(500, "Error deleting user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "User deleted successfully", null));
});

export const signOutUser = asyncHandler(async (req, res) => { 
  const id = req.user._id;

  if (id !== req.params.userId) {
    throw new ApiError(403, "You are not authorized to perform this action");
  }

  const options = {
    httpOnly: true,
    secure: false,
  };

  return res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User signed out successfully", null));
});
