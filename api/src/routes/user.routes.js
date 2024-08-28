import { Router } from "express";
import {
  deleteUser,
  googleAuth,
  signin,
  signOutUser,
  signup,
  updateUser,
} from "../controllers/user.controller.js";
import verifyUser from "../middlewares/verifyUser.middleware.js";

const router = Router();

router.route("/sign-up").post(signup);
router.route("/sign-in").post(signin);
router.route("/google").post(googleAuth);
router.route("/update/:userId").put(verifyUser, updateUser);
router.route("/delete/:userId").delete(verifyUser, deleteUser);
router.route("/sign-out/:userId").post(verifyUser, signOutUser);

export default router;
