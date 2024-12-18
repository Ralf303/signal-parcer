import { config } from "dotenv";
import express from "express";
import fs from "fs";
import cors from "cors";
import { Telegraf } from "telegraf";
import sequelize from "./db/config.js";
import userRouter from "./bot/user.service.js";
import { stringify } from "flatted";
import bodyParser from "body-parser";

config();

const bot = new Telegraf(process.env.BOT_TOKEN);

export const start = async () => {
  const app = express();

  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  // app.use(bodyParser.json());

  app.post("/", async (req, res) => {
    try {
      console.log(req.body);
      const data = req.body;
      const result = await bot.telegram.sendMessage(
        "1157591765",
        JSON.stringify(data, null, 2)
      );
      if (result) {
        res.send("Data received and processed!");
      } else {
        res.status(500).send("Error processing data");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while processing the request.");
    }
  });

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  // await sequelize.authenticate();
  // console.log("Connection has been established successfully.");
  // await sequelize.sync();
  // console.log("All models were synchronized successfully.");

  bot.use(userRouter);

  bot.launch();
  console.log("Telegram bot launched.");
  bot.telegram.sendMessage("1157591765", "Парсер запущен");

  app.listen(3000, async () => {
    console.log("Server is running on port 3000");
  });
};
