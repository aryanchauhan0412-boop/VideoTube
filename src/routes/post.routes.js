import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPost, editPost , deletePost, getAllPost, getUserPosts } from "../controllers/post.controller.js";

const router = Router();

router.route("/").get(getAllPost)

router.route("/user/:userId").get(getUserPosts)

router.route("/createPost").post(
  verifyJWT,
  upload.single("media"),
  createPost
)

router.route("/edit/:postId").patch(
  verifyJWT,
  upload.single("media"),
  editPost
)

router.route("/:postId").delete(
  verifyJWT,
  deletePost
)


export default router;