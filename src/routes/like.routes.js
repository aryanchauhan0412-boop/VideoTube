import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getLikeCount, isPostLiked, toggleLike } from "../controllers/like.controller.js";

const router = Router();

router.route("/toggle/:postId").post(verifyJWT, toggleLike)

router.route("/count/:postId").get(getLikeCount)

router.route("/isLiked/:postId").get(verifyJWT, isPostLiked)

export default router;