import mongoose from "mongoose";
import { Post } from "../models/post.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createPost = asynchandler(async (req, res) => {
  console.log(req.file)
  const mediaLocalPath = req.file?.path;

  if(!mediaLocalPath){
    throw new ApiError(400, "Media file is required!");
  }

  const mediaUpload = await uploadOnCloudinary(mediaLocalPath);

  if(!mediaUpload){
    throw new ApiError(400, "Error while uploading the media")
  }

  const mediaType = req.file.mimetype.startsWith("video")
    ? "video"
    : "image";


  // it will create the post in db
  const post = await Post.create({
    owner: req.user._id,
    caption: req.body.caption || "",
    media: mediaUpload.url,
    mediaType
  })

  return res
  .status(201)
  .json(new ApiResponse(200, post, "Post create successfully"))
})

const getAllPost = asynchandler(async (req, res) => {
  const posts = await Post.aggregate([
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "post",
        as: "likes"
      }
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post",
        as: "comments"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner"
      }
    },
    {
      $unwind: "$owner"
    },
    {
      $addFields: {
        likesCount: {
          $size: "$likes"
        },
        commentsCount: {
          $size: "$comments"
        }
      }
    },
    {
      $project: {
        caption: 1,
        media: 1,
        mediaType: 1,
        createdAt: 1,
        likesCount: 1,
        commentsCount: 1,
        owner: {
          _id: "$owner._id",
          username: "$owner.username",
          avatar: "$owner.avatar"
        }
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    }
  ])


  return res
  .status(200)
  .json(new ApiResponse( 200 ,{totalPosts: posts.length}, posts))
})

const getUserPosts = asynchandler(async(req, res) => {
  console.log("NEW GET USER POSTS CONTROLLER RUNNING");
  const {userId} = req.params;

  const posts = await Post.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "post",
        as: "likes"
      }
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post",
        as: "comments"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner"
      }
    },
    {
      $unwind: "$owner"
    },
    {
      $addFields: {
        likesCount: {
          $size: "$likes"
        },
        commentsCount: {
          $size: "$comments"
        }
      }
    },
    {
      $project: {
        caption: 1,
        media: 1,
        mediaType: 1,
        createdAt: 1,
        updatedAt: 1,
        likesCount: 1,
        commentsCount: 1,
        owner: {
          _id: "$owner._id",
          username: "$owner.username",
        }
      }
    }
    ]);
    console.log("final posts", posts);

    return res
    .status(200)
    .json(new ApiResponse( 200 ,{totalPosts: posts.length}, posts))
})

const getPostById = asynchandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(postId)
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner"
      }
    },
    {
      $unwind: "$owner"
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "post",
        as: "likes"
      }
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post",
        as: "comments"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "comments.owner",
        foreignField: "_id",
        as: "commentOwners"
      }
    },
    {
      $addFields: {
        likesCount: {
          $size: "$likes"
        },
        commentsCount: {
          $size: "$comments"
        }
      }
    }
  ]);

  return res.status(200).json(
    new ApiResponse(200, post[0], "Post fetched successfully")
  );
});

const deletePost = asynchandler(async(req, res) => {
  const {postId} = req.params;

  const post = await Post.findById(postId)

  if(!post){
    throw new ApiError(404, "Post Not Found!")
  }

  if(post.owner.toString() !== req.user._id.toString()){
    throw new ApiError(403, "Unauthorized request")
  }

  await Post.findByIdAndDelete(postId);

  return res
  .status(200)
  .json(new ApiResponse(200, "Post deleted successfully"))
})

const editPost = asynchandler( async(req, res) => { 
  // console.log("BODY:", req.body)
  // console.log("FILE:", req.file)
  // console.log("PARAMS:", req.params)

  const {postId} = req.params;

  const post = await Post.findById(postId)

  if(!post){
      throw new ApiError(404, "Post not found")
  }

  if(post.owner.toString() !== req.user._id.toString()){
    throw new ApiError(403, "Unauthorized request")
  }

  const updateFields = {}

  // edit the caption
  if(req.body?.caption){
    updateFields.caption = req.body.caption
  }

  // edit the media
  if(req.file){
    const mediaLocalPath = req.file?.path;
    
    if(!mediaLocalPath){
      throw new ApiError(400, "media file is missing");
    }
    
    const mediaUpload = await uploadOnCloudinary(mediaLocalPath)
    if(!mediaUpload.url){
      throw new ApiError(400, "Error while uploading on media");
    }

    updateFields.media = mediaUpload.url
    
    updateFields.mediaType = req.file.mimetype.startsWith("video")
    ? "video"
    : "image"
  }

  const updatedPost = await Post.findByIdAndUpdate(postId,
    {
      $set: updateFields
    },
    {
      new: true
    }
  )
  console.log(updatedPost);
  return res
  .status(200)
  .json(new ApiResponse(200, updatedPost,"Post updated successfully!" ))
})

export {
  createPost,
  getAllPost,
  getUserPosts,
  deletePost,
  editPost,
  getPostById
}