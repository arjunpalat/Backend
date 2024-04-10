const usersRouter = require("./users");
const registerRouter = require("./register");
const middleware = require("../utils/middleware");
const getuserRouter = require("./getuser");
const updateuserRouter = require("./updateuser");

const apiRouter = require("express").Router();

apiRouter.use(middleware.tokenExtractor);

apiRouter.use("/users", middleware.userExtractor, usersRouter);
apiRouter.use("/register", registerRouter);
apiRouter.use("/getuser", middleware.userExtractor, getuserRouter);
apiRouter.use("/updateuser", middleware.userExtractor, updateuserRouter);

apiRouter.use(middleware.unknownEndpoint);

module.exports = apiRouter;
