import express from "express";
import {
  getImages,
  addImage,
  deleteImage,
  searchImages,
  getImageDetail,
  getUserSavedImages,
  getImagesCreatedByUser,
} from "../controllers/image.controller.js";
import { middleWareToken } from "../config/jwt.js";

const imageRouter = express.Router();

imageRouter.get("/get-images", getImages);
imageRouter.get("/search", searchImages);
imageRouter.get("/get-image-detail/:hinh_id", getImageDetail);
imageRouter.get(
  "/get-user-saved-images/:userId",
  middleWareToken,
  getUserSavedImages
);
imageRouter.post("/add-image", middleWareToken, addImage);
imageRouter.get("/get-images-created-by-user/:userId", getImagesCreatedByUser);
imageRouter.delete("/delete-image/:imageId", middleWareToken, deleteImage);

export default imageRouter;
