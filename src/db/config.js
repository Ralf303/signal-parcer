import { config } from "dotenv";
import { Sequelize } from "sequelize";
config();

export default new Sequelize(
  process.env.DATABASE,
  process.env.USER_NAME,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    port: process.env.PORT,
    dialect: "mysql",
    logging: false,
  }
);
