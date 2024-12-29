import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { Scenes, session, Telegraf } from "telegraf";
import sequelize from "./db/config.js";
import userRouter from "./bot/user.service.js";
import rateLimit from "telegraf-ratelimit";
import paramScene from "./bot/scenes/param.scene.js";
import adminService from "./bot/admin.service.js";
import { getVerifieUsers } from "./db/functions.js";
import { getRandomInt, sleep } from "./bot/utils.js";
import messageScene from "./bot/scenes/message.scene.js";
import verifScene from "./bot/scenes/verif.scene.js";

const stage = new Scenes.Stage([paramScene, messageScene, verifScene]);
config();

const bot = new Telegraf(process.env.BOT_TOKEN);

export const start = async () => {
  const app = express();

  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.post("/", async (req, res) => {
    try {
      const data = req.body;

      const signal = data?.text;

      const now = new Date();
      const dayOfWeek = now.getDay();
      const hour = now.getHours();
      const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
      const isWithinTimeFrame = hour >= 6 && hour <= 22;

      if (signal && isWeekday && isWithinTimeFrame) {
        const text = `НОВЫЙ СИГНАЛ:\n\n${signal}${getRandomInt(1, 5)} минут`;
        await bot.telegram.sendMessage("1157591765", JSON.stringify(data));

        const users = await getVerifieUsers();

        for (const user of users) {
          try {
            await bot.telegram.sendMessage(user.chatId, text);

            await sleep(500);
          } catch (error) {
            continue;
          }
        }
      }

      if (data) {
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

  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
  await sequelize.sync();
  console.log("All models were synchronized successfully.");

  bot.use(session());
  bot.use(stage.middleware());
  bot.use(
    rateLimit({
      window: 1000,
      limit: 5,
    })
  );
  bot.use(userRouter);
  bot.use(adminService);

  bot.launch();
  console.log("Telegram bot launched.");
  await bot.telegram.sendMessage("1157591765", "Парсер запущен");

  app.listen(3000, async () => {
    console.log("Server is running on port 3000");
  });
};
