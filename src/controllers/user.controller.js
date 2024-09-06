import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { responseData } from "../config/response.js";

const model = initModels(sequelize);

export const getUser = async (req, res) => {
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

    const user = await model.nguoi_dung.findOne({
      where: { nguoi_dung_id: userId },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Thành công",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const userFromToken = req.user.userId;
    if (parseInt(userId) !== userFromToken) {
      return res.status(403).json({
        message: "You do not have permission to update this user's information",
      });
    }
    const { email, ho_ten, tuoi, anh_dai_dien } = req.body;
    if (!email || !ho_ten || !tuoi || !anh_dai_dien) {
      return res.status(400).json({
        message: "All fields (email, ho_ten, tuoi, anh_dai_dien) are required",
      });
    }
    const user = await model.nguoi_dung.findOne({
      where: { nguoi_dung_id: userId },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    await model.nguoi_dung.update(
      { email, ho_ten, tuoi, anh_dai_dien },
      { where: { nguoi_dung_id: userId } }
    );
    return res.status(200).json({
      message: "User information updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
