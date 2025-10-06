const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user model
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user model
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
      //   default: "pending",
    },
  },
  { timestamps: true }
);

// ConnectionRequest.find({fromUserId: x, toUserId: y}) will be faster now, because of this index.
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", async function (next) {
  const connectionRequest = this;
  // Check if senderId and receiverId are the same.
  if (this.senderId.toString() === this.receiverId.toString()) {
    throw new Error("You cannot send a connection request to yourself!");
  }
  next(); // This function is like a middleware so always remember to call this next() method.
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
