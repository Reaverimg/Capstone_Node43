import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { responseData } from "../config/response.js";

const model = initModels(sequelize);

export const getImages = async (req, res) => {
  try {
    const images = await model.hinh_anh.findAll();
    return responseData(images, "Thành công", 200, res);
  } catch (error) {
    return responseData(null, "Lỗi khi lấy danh sách hình ảnh", 500, res);
  }
};

export const searchImages = async (req, res) => {
  const { name } = req.query;
  const images = await model.hinh_anh.findAll({ where: { ten_hinh: name } });
  return responseData(images, "Thành công", 200, res);
};

export const getImageDetail = async (req, res) => {
  try {
    const { hinh_id } = req.params;
    const image = await model.hinh_anh.findOne({
      where: { hinh_id },
      include: [
        {
          model: model.nguoi_dung,
          as: "nguoi_dung",
          attributes: ["ho_ten", "email"],
        },
      ],
    });

    if (!image) {
      return responseData(null, "Hình ảnh không tồn tại", 404, res);
    }

    return responseData(image, "Thành công", 200, res);
  } catch (error) {
    return responseData(null, "Lỗi khi lấy chi tiết hình ảnh", 500, res);
  }
};

export const getUserSavedImages = async (req, res) => {
  try {
    const { userId } = req.params;

    const savedImages = await model.luu_anh.findAll({
      where: { nguoi_dung_id: userId },
      include: ["hinh"],
    });

    return responseData(savedImages, "Thành công", 200, res);
  } catch (error) {
    return responseData(
      null,
      "Lỗi khi lấy danh sách hình ảnh đã lưu",
      500,
      res
    );
  }
};

export const getImagesCreatedByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }
    if (isNaN(userId)) {
      return res.status(400).json({
        message: "User ID must be a valid number",
      });
    }
    const images = await model.hinh_anh.findAll({
      where: { nguoi_dung_id: userId },
    });

    if (!images.length) {
      return res.status(404).json({
        message: "No images found for this user",
      });
    }
    return responseData(images, "Thành công", 200, res);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const userId = req.user.userId;
    const image = await model.hinh_anh.findOne({ where: { hinh_id: imageId } });
    if (!image) {
      return res.status(404).json({
        message: "Image not found",
      });
    }
    if (image.nguoi_dung_id !== userId) {
      return res.status(403).json({
        message: "You do not have permission to delete this image",
      });
    }
    await model.luu_anh.destroy({ where: { hinh_id: imageId } });
    await model.binh_luan.destroy({ where: { hinh_id: imageId } });
    await model.hinh_anh.destroy({ where: { hinh_id: imageId } });
    return responseData(
      null,
      "Ảnh và các dữ liệu liên quan đã được xóa",
      200,
      res
    );
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const addImage = async (req, res) => {
  try {
    const nguoi_dung_id = req.user.userId;
    const { ten_hinh, duong_dan, mo_ta } = req.body;
    if (!ten_hinh || !duong_dan || !mo_ta) {
      return res.status(400).json({
        message: "Tên hình, đường dẫn và mô tả là bắt buộc",
      });
    }
    await model.hinh_anh.create({
      ten_hinh,
      duong_dan,
      mo_ta,
      nguoi_dung_id,
    });
    return responseData(null, "Ảnh đã được thêm", 201, res);
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi thêm ảnh",
      error: error.message,
    });
  }
};
