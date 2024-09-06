import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { responseData } from "../config/response.js";

const model = initModels(sequelize);

export const getComments = async (req, res) => {
  try {
    const { hinh_id } = req.params;
    const comments = await model.binh_luan.findAll({
      where: { hinh_id },
    });
    return responseData(comments, "Thành công", 200, res);
  } catch (error) {
    return responseData(null, "Lỗi khi lấy bình luận", 500, res);
  }
};

export const addComment = async (req, res) => {
  try {
    const { nguoi_dung_id, hinh_id, noi_dung } = req.body;

    if (!nguoi_dung_id || !hinh_id || !noi_dung) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const comment = await model.binh_luan.create({
      nguoi_dung_id,
      hinh_id,
      noi_dung,
    });

    return res.status(200).json({ message: "Bình luận thành công", comment });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi khi thêm bình luận", error });
  }
};
