import { Router } from "express";
import { addComment, deleteComment, editComment, getPostComments } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:postId").get(getPostComments)
router.route("/add/:postId").post(verifyJWT, addComment)
router.route("/edit/:commentId").patch(verifyJWT, editComment)
router.route("/delete/:commentId").delete(verifyJWT, deleteComment)


export default router;