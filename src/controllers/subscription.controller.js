import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.models.js"
import { Subscription } from "../models/subscription.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynchandler} from "../utils/asynchandler.js"

const toggleSubscription = asynchandler(async(req, res) => {
  const {channelId} = req.params;

  if(channelId === req.user._id.toString()){
    throw new ApiError(400, "You cannot subscribe to yourself")
}

  if(!channelId){
    throw new ApiError(400, "channel id is missing")
  }

  // check exist subscription
  const subscribed = await Subscription.findOne({
    subscriber: req.user._id,
    channel: channelId
  })

  // unsubscribe
  if(subscribed){
    await Subscription.findByIdAndDelete(
      subscribed._id
    )

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Unsubscribed successfully"))
  }

  // subscribe
  await Subscription.create({
    subscriber: req.user._id,
    channel: channelId
  })

  return res
  .status(200)
  .json(new ApiResponse(200, {}, "Subscribed successfully"))
})

// user follower 
const getUserChannelSubscribers = asynchandler(async(req, res) => {
  const {channelId} = req.params;

  if(!channelId){
    throw new ApiError(400, "channel id is missing")
  }

  const subscribers = await Subscription.find({
    channel: channelId
  }).populate("subscriber", "username fullName")

  return res
  .status(200)
  .json(new ApiResponse(200, subscribers, "Subcribers fetched successfully"))
})

// whom did user is follow
const getSubscribedChannels = asynchandler(async(req, res) => {
  const {subscriberId} = req.params;

  if(!subscriberId){
    throw new ApiError(400,"Subscriber id is missing")
  }

  const subscribedChannels = await Subscription.find({
    subscriber: subscriberId
  }).populate("channel", "username fullName")

  return res
  .status(200)
  .json(new ApiResponse(200, subscribedChannels, "subscribed channels fetched successfully"))
}) 

export {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription
}