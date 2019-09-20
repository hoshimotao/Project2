const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const userSchema = new Schema(
  {
    username: String,
    password: String,
    email: String,
    age: Number,
    posts: [{
      type: Schema.Types.ObjectId, 
      ref: "Feed"
    }],
    picture: String
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;