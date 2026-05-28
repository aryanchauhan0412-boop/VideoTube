import { Like } from "../models/like.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";

const toggleLike = asynchandler(async(req, res) => {
  const {postId} = req.params;

  // This is for unlike post
  const existingLike = await Like.findOne({
    post: postId,
    likeBy: req.user._id
  })

  if(existingLike){
    await Like.findByIdAndDelete(existingLike._id)

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post unliked"))
  }

  // This is for like logic
  const like = await Like.create({
    post: postId,
    likeBy: req.user._id
  })

  return res
  .status(200)
  .json(new ApiResponse(200, {}, "Post liked"))
})

const getLikeCount = asynchandler(async(req, res) => {
  const { postId } = req.params

    const likesCount = await Like.countDocuments({
        post: postId
    })

    return res
    .status(200)
    .json(new ApiResponse(200,{ likesCount },
            "Likes count fetched successfully"
        )
    )
})

const isPostLiked = asynchandler(async (req, res) => {

    const { postId } = req.params

    const liked = await Like.findOne({
        post: postId,
        likedBy: req.user._id
    })

    return res
    .status(200)
    .json(new ApiResponse(200,
            {
                isLiked: !!liked
            },
            "Like status fetched"
        )
    )
})

export {isPostLiked, toggleLike, getLikeCount}