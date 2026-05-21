import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from ".models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asynchandler(async(req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user is already exists: username, email
  // check for images, and avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res 


  const {username, fullName, email, password} = req.body;
  
  if(
    [fullName, email, password, username].some((field) => field?.trim() === "")
  ){
    throw new ApiError(400, "All field are required")
  }

  const existedUser = User.findOne({
    $or: [{username}, { email }]
  })
  
  if(existedUser){
    throw new ApiError(409, "User with email or username is already exist")
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if(!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if(!avatar){
    throw new ApiError(400, "Avatar file is required")
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!createdUser){
    throw new ApiError(500, "Somthing went wrong while registed the user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User register successfully")
  )

})


export {registerUser}