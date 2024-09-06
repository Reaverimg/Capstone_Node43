import bcrypt from "bcrypt";
import { createToken } from "../config/jwt.js";
import { responseData } from "../config/response.js";
import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";

const model = initModels(sequelize);

export const signUp = async (req, res) => {
  const { email, pass_word, ho_ten, tuoi } = req.body;

  const existingUser = await model.nguoi_dung.findOne({ where: { email } });
  if (existingUser) {
    return responseData(null, "Email đã tồn tại", 409, res);
  }

  const hashedPassword = bcrypt.hashSync(pass_word, 10);

  await model.nguoi_dung.create({
    email,
    mat_khau: hashedPassword,
    ho_ten,
    tuoi,
  });

  return responseData(null, "Đăng ký thành công", 201, res);
};

export const login = async (req, res) => {
  const { email, pass_word } = req.body;

  const checkEmail = await model.nguoi_dung.findOne({ where: { email } });

  if (!checkEmail) {
    return responseData(null, "Email không tồn tại", 404, res);
  }

  const isPasswordValid = bcrypt.compareSync(pass_word, checkEmail.mat_khau);

  if (!isPasswordValid) {
    return responseData(null, "Mật khẩu không đúng", 401, res);
  }

  const token = createToken({
    userId: checkEmail.nguoi_dung_id,
    email: checkEmail.email,
    hoTen: checkEmail.ho_ten,
  });

  return responseData({ token }, "Đăng nhập thành công", 200, res);
};
