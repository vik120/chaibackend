import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String,
      required: true,
    },
    thumbnail: {
        type: string,
        required: true
    },
    title: {
        type: string,
        required: true
    },
    description: {
        type: string,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    duration: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    owner: {
          type: Schema.Types.ObjectId,
          ref: "User"
      }
  },
  {
    timestamps: true,
  },
);

videoSchema.plugin(mongooseAggregatePaginate) 

export const Video = mongoose.model("Video", videoSchema);
