import { config } from "dotenv";
import express from "express";
import fs from "fs";
import cors from "cors";
import { Telegraf } from "telegraf";
import sequelize from "./db/config.js";
import userRouter from "./bot/user.service.js";
import { stringify } from "flatted";

config();

const bot = new Telegraf(process.env.BOT_TOKEN);

export const start = async () => {
  const app = express();

  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.post("/", async (req, res) => {
    console.log(req);

    const data = stringify(req);
    const fileName = `request_${Date.now()}.txt`;

    fs.writeFile(fileName, data, async (err) => {
      if (err) {
        return res.status(500).send("Error writing file");
      }

      await bot.telegram.sendDocument("1157591765", {
        source: fileName,
        filename: fileName,
      });

      res.send("Data saved and file sent!");
    });
  });

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  // await sequelize.authenticate();
  // console.log("Connection has been established successfully.");
  // await sequelize.sync();
  // console.log("All models were synchronized successfully.");

  bot.use(userRouter);

  app.listen(3000, async () => {
    console.log("Server is running on port 3000");
    bot.telegram.sendMessage("1157591765", "Парсер запущен");
  });
  await bot.launch();
};
