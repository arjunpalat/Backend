const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const userInDB = await User.findById(request.user.toString()).populate(
    "notes"
  );
  if (!request.user || !userInDB) {
    return response.status(401).json({ error: "Unauthorized user" });
  }
  response.status(200).json(userInDB);
});

usersRouter.get("/:id", async (request, response) => {
  const userInDB = await User.findById(request.params.id).populate("notes");
  if (userInDB._id.toString() !== request.user.toString()) {
    return response.status(401).json({ error: "Unauthorized user" });
  }

  response.json(userInDB);
});


module.exports = usersRouter;
