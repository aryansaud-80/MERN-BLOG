import mongoose from "mongoose";
const { Schema, model } = mongoose;
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { FaUsersCog } from "react-icons/fa";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: "https://www.w3schools.com/howto/img_avatar.png",
    },

    refreshToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function () {
  if (!this.isModified("password")) return null;
  this.password = bcrypt.hashSync(this.password, 10);
});

userSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.$set.password) {
    const hashedPassword = bcrypt.hashSync(update.$set.password, 10);
    this.setUpdate({ ...update, password: hashedPassword });
  }

  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const User = model("User", userSchema);
