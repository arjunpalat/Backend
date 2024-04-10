const bcrypt = require("bcrypt");
const registerRouter = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

registerRouter.post("/", async (request, response) => {
  const { username, name, password, email, agreeToTOS } = request.body;

  if (!name || !username || !password || !email) {
    return response
      .status(400)
      .json({ error: "Name, username, email or password missing" });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response
      .status(400)
      .json({ error: "Username has already been taken", errorField: "username" });
  }
  if (password.length < 7) {
    return response
      .status(400)
      .json({ error: "Password must be more than 6 characters long", errorField: "password"});
  }

  if(!agreeToTOS) {
    return response.status(400)
    .json({error: "Please agree to our Terms and Conditions"})
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUserObject = {
    username,
    name,
    email,
    passwordHash,
    platformUseCase: {
      designer: false,
      hire: false,
      inspiration: false,
      edited: false,
    },
    emailVerified: false,
    avatarUrl: "",
    location: "",
  };

  const user = new User({
    ...newUserObject,
    username: username.toLowerCase(),
    name,
    email,
    passwordHash,
  });

  const savedUser = await user.save();

  const userForToken = {
    username: savedUser.username,
    id: savedUser._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  response.status(200).send({ token, userData: savedUser.toJSON() });
});

module.exports = registerRouter;
