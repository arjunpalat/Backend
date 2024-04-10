const getuserRouter = require("express").Router();
const User = require("../models/user");

getuserRouter.get("/", async (request, response) => {
  const userInDB = await User.findById(request.user.toString());
  if (!request.user || !userInDB) {
    return response.status(401).json({ error: "Unauthorized user" });
  }
  response.status(200).json(userInDB);
});

module.exports = getuserRouter;
