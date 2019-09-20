const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedSchema = new Schema(
  {
    photo: String,
    caption: String,
    like: String,
    comment: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

const Feed = mongoose.model("Feed", feedSchema);

module.exports = Feed;
