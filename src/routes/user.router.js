import express from "express";
import { getUser, updateUser } from "../controllers/user.controller.js";
import { middleWareToken } from "../config/jwt.js";

const userRouter = express.Router();

userRouter.get("/get-user/:userId", middleWareToken, getUser);
userRouter.put("/update-user/:userId", middleWareToken, updateUser);

export default userRouter;
