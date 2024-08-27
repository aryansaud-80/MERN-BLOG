import { Router } from "express";
import { googleAuth, signin, signup, updateUser } from "../controllers/user.controller.js";
import verifyUser from "../middlewares/verifyUser.middleware.js";

const router = Router();

router.route("/sign-up").post(signup);
router.route("/sign-in").post(signin);
router.route("/google").post(googleAuth);
router.route("/update/:userId").put(verifyUser,updateUser);

export default router;
