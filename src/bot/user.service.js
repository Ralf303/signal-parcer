import { Composer } from "telegraf";
import { Keyboard } from "telegram-keyboard";
import { getUser } from "../db/functions.js";

const startKeyboard = Keyboard.make([
  ["📝 Подписаться на сигналы"],
  ["📝 Отписаться от сигналов"],
  ["📝 Пройти верефикацию"],
]);

const userRouter = new Composer();

userRouter.start(async (ctx) => {
  try {
    const user = await getUser(ctx.from.id, ctx.from.username);
    await ctx.reply(
      `Добро пожаловать ${ctx.from.first_name}\n\nПодписка на сигналы: ${
        user.isSubscribe ? "✅" : "❌"
      }\nВерефикация: ${user.isVerified ? "✅" : "❌"}`,
      startKeyboard.reply()
    );
  } catch (error) {
    console.log(error);
  }
});

userRouter.hears("📝 Подписаться на сигналы", async (ctx) => {
  try {
    const user = await getUser(ctx.from.id, ctx.from.username);

    if (user.isSubscribe) {
      await ctx.reply("Вы уже подписаны на рассылку");
      return;
    }

    if (!user.isVerified) {
      await ctx.reply("Для подписки на рассылку необходимо пройти верефикацию");
      return;
    }

    await ctx.reply("Вы подписались на рассылку");
    user.isSubscribe = true;
    await user.save();
  } catch (error) {
    console.log(error);
  }
});

userRouter.hears("📝 Отписаться от сигналов", async (ctx) => {
  try {
    const user = await getUser(ctx.from.id, ctx.from.username);

    if (!user.isVerified) {
      await ctx.reply("Для начала необходимо пройти верефикацию");
      return;
    }

    await ctx.reply("Вы отписались от рассылки");
    user.isSubscribe = false;
    await user.save();
  } catch (error) {
    console.log(error);
  }
});

userRouter.hears("📝 Пройти верефикацию", async (ctx) => {
  try {
    await ctx.scene.enter("verif");
  } catch (error) {
    console.log(error);
  }
});

export default userRouter;
