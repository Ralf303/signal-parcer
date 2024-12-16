import { Composer } from "telegraf";
import { Keyboard } from "telegram-keyboard";
import getUser from "../db/functions.js";

const startKeyboard = Keyboard.make([
  ["📝 Подписаться на сигнал"],
  ["📝 Отписаться от сигнала"],
  ["📝 Проверить подписку"],
]);

const userRouter = new Composer();

userRouter.start(async (ctx) => {
  await getUser(ctx.from.id, ctx.from.username);
  await ctx.reply("Welcome", startKeyboard.reply());
});

userRouter.hears("📝 Подписаться", (ctx) => {
  ctx.reply("Вы подписались на рассылку");
});

userRouter.hears("📝 Отписаться", (ctx) => {
  ctx.reply("Вы отписались от рассылки");
});

userRouter.hears("📝 Проверить подписку", (ctx) => {
  ctx.reply("Вы подписаны на рассылку");
});

export default userRouter;
