import mongoose, { Schema } from "mongoose";

const subscriptionSchmea= new Schema(
    {
        // One who is subscribe
        subscriber: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User
        },
        // one whom is subscribing
        channel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User
        }
    }, {
    timestamps: true
})

export const subscription = mongoose.model('subscription', subscriptionSchmea)