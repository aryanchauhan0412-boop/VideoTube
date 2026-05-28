import { Comment } from "../models/comment.models.js";
import { Post } from "../models/post.models.js";
import { asynchandler} from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addComment = asynchandler(async(req, res) => {
  const {postId} = req.params;
  const {content} = req.body;

  if(!content || content.trim() === ""){
    throw new ApiError(400,"Comment content is required")
  }

  const post = await Post.findById(postId)

  if(!post){
    throw new ApiError(404, "Post not found")
  }

  const comment = await Comment.create({
    content, 
    post: postId,
    owner: req.user._id
  })

  return res
  .status(200)
  .json(new ApiResponse(200, comment, "Comment added successfully"))
})

const getPostComments = asynchandler(async(req, res) => {
  const {postId} = req.params;

  const comments = await Comment.find({post: postId}).populate("owner", "username fullName").sort({createdAt: -1})

  console.log(comments.length);
  

  return res
  .status(200)
  .json(new ApiResponse(200, comments, "Comments fetched successfully"))
})


const editComment = asynchandler(async(req, res) => {
  const {commentId} = req.params;
  const {content} = req.body;

  if(!content || content.trim() === ""){
    throw new ApiError(400, "Comment is required!")
  }

  const comment = await Comment.findById(commentId);

  if(!comment){
    throw new ApiError(404, "Comment not found")
  }

  if(comment.owner.toString() !== req.user._id.toString()){
    throw new ApiError(403, "Unauthorized request")
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set : {
        content
      }
    },
    {
      new : true
  }
  )

  return res
  .status(200)
  .json(new ApiResponse(200, updatedComment, "Comment updated Successfully"))

  })

const deleteComment = asynchandler(async(req, res) => {
  const {commentId} = req.params;

  const comment = await Comment.findById(commentId)

  if (!comment) {
      throw new ApiError(404, "Comment not found")
  }

  if(comment.owner.toString() !== req.user._id.toString()){
    throw new ApiError(403, "Unauthorized request")
  }

  await Comment.findByIdAndDelete(commentId)

  return res
  .status(200)
  .json(new ApiResponse(200, {}, "Comment deleted successfully"))


})


export {
  addComment,
  getPostComments,
  editComment,
  deleteComment
}