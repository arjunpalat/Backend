const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  emailVerified: Boolean,
  email: String,
  agreeToTOS: Boolean,
  avatarUrl: String,
  location: String,
  platformUseCase: {
    designer: Boolean,
    hire: Boolean,
    inspiration: Boolean,
    edited: Boolean,
  },
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
