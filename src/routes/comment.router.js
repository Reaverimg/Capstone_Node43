import express from "express";
import { getComments, addComment } from "../controllers/comment.controller.js";
import { middleWareToken } from "../config/jwt.js";

const commentRouter = express.Router();

commentRouter.get("/get-comments/:hinh_id", getComments);
commentRouter.post("/add-comment", middleWareToken, addComment);

export default commentRouter;
