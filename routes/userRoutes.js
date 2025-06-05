const userRouter = require("express").Router();
const user = require("../controllers/userController");

userRouter.post("/signupuser", user.signup);
userRouter.post("/loginuser", user.login);

module.exports = userRouter;
