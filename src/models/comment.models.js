import mongoose, {Schema} from "mongoose";

const commentSchema = new Schema({
  content: {
    type: String,
    trim: true,
    required: true
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
}, {timestamps: true})

export const Comment = mongoose.model("Comment", commentSchema)