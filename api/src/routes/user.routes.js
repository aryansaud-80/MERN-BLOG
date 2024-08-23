import { Router } from "express";
import { googleAuth, signin, signup } from "../controllers/user.controller.js";

const router = Router();

router.route("/sign-up").post(signup);
router.route("/sign-in").post(signin);
router.route("/google").post(googleAuth);

export default router;
