const updateuserRouter = require("express").Router();
const User = require("../models/user");
const cloudinary = require("cloudinary").v2;
const resend = require("resend");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET,
});

updateuserRouter.put("/", async (request, response) => {
  const updates = Object.keys(request.body);
  const allowedUpdates = [
    "location",
    "platformUseCase",
    "avatarUrl",
    "emailVerified",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return response.status(400).send({ error: "Invalid updates!" });
  }

  const userInDB = await User.findById(request.user.toString());
  if (!request.user || !userInDB) {
    return response.status(401).json({ error: "Unauthorized user" });
  }

  if (
    request.body.avatarUrl &&
    request.body.avatarUrl.startsWith("data:image")
  ) {
    const uploadResponse = await cloudinary.uploader.upload(
      request.body.avatarUrl
    );
    request.body.avatarUrl = uploadResponse.url;
  }

  updates.forEach((update) => (userInDB[update] = request.body[update]));
  await userInDB.save();
  if (request.body.platformUseCase && request.body.platformUseCase.edited) {
    const resendInstance = new resend.Resend(process.env.RESEND_API);
    await resendInstance.emails.send({
      from: process.env.RESEND_FROM_MAIL,
      to: [userInDB.email],
      subject: process.env.RESEND_SUBJECT,
      html: process.env.RESEND_HTML,
    });
  }
  response.status(200).json(userInDB);
});

module.exports = updateuserRouter;
