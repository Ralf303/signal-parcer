import { config } from "dotenv";
import express from "express";
import fs from "fs";
import { Telegraf } from "telegraf";

config();

const bot = new Telegraf(process.env.BOT_TOKEN);

export const start = async () => {
  const app = express();

  app.use(express.json());

  app.post("/", async (req, res) => {
    console.log(req);

    const data = JSON.stringify(req.body, null, 2);
    const fileName = `request_${Date.now()}.txt`;

    fs.writeFile(fileName, data, async (err) => {
      if (err) {
        return res.status(500).send("Error writing file");
      }

      // Отправка файла через бот
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

  app.listen(3000, async () => {
    console.log("Server is running on port 3000");
    bot.telegram.sendMessage("1157591765", "Парсер запущен");
  });
};
