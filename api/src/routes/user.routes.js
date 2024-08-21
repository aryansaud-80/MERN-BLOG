import { Router } from "express";
import {signup} from "../controllers/user.controller.js";
import {signin} from "../controllers/user.controller.js";

const router = Router();

router.route("/sign-up").post(signup);
router.route("/sign-in").post(signin);


export default router ;
