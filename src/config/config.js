import { Sequelize } from "sequelize";

const sequelize = new Sequelize("capstone", "root", "123456", {
  host: "localhost",
  dialect: "mysql",
  port: 3307,
});

export default sequelize;
