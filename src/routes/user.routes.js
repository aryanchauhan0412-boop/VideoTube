import { Router } from "express";
import { getUserChannelProfile, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1
    },
    {
      name: "coverImage",
      maxCount: 1
    }
  ]),
  registerUser
)

router.route("/login").post(loginUser)

// secure route
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)


router.route("/c/:username").get(verifyJWT, getUserChannelProfile)



// router.route("/test").post(
//   upload.single("avatar"),
//   (req, res) => {
//     console.log(req.file);

//     res.json({
//       success: true,
//       file: req.file
//     });
//   }
// )



export default router;