const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        emun: ['user', 'admin'],
        default: 'user'
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model('User', UserSchema)
