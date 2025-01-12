import { config } from "dotenv";
import { Scenes, session, Telegraf } from "telegraf";
import userRouter from "./bot/user.service.js";
import rateLimit from "telegraf-ratelimit";
import paramScene from "./bot/scenes/param.scene.js";
import adminService from "./bot/admin.service.js";
import messageScene from "./bot/scenes/message.scene.js";
import verifScene from "./bot/scenes/verif.scene.js";

const stage = new Scenes.Stage([paramScene, messageScene, verifScene]);
config();

const bot = new Telegraf(process.env.BOT_TOKEN);

export const start = async () => {
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
};
