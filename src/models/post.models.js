import mongoose from "mongoose";
// import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const postSchema = new mongoose.Schema({
  caption: {
    type: String, 
    default: "",
    trim: true
  },
  media: {
    type: String, 
    required: true
  },
  mediaType: {
    type: String, 
    enum: ["image", "video"],
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
  // views: {
  //   type: Number,
  //   default: 0
  // },
}, {timestamps: true})

// postSchema.plugin(mongooseAggregatePaginate)

export const Post = mongoose.model("Post", postSchema)