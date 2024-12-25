import { Composer } from "telegraf";
import { Keyboard } from "telegram-keyboard";
import { getUser } from "../db/functions.js";
import text from "../../text.js";

const startKeyboard = Keyboard.make([
  [text.buttons.subscribe],
  [text.buttons.unsubscribe],
  [text.buttons.verify],
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

userRouter.hears(text.buttons.subscribe, async (ctx) => {
  try {
    const user = await getUser(ctx.from.id, ctx.from.username);

    if (user.isSubscribe) {
      await ctx.reply(text.alreadySubscribed);
      return;
    }

    if (!user.isVerified) {
      await ctx.reply(text.needVerif);
      return;
    }

    await ctx.reply(text.subscribed);
    user.isSubscribe = true;
    await user.save();
  } catch (error) {
    console.log(error);
  }
});

userRouter.hears(text.buttons.unsubscribe, async (ctx) => {
  try {
    const user = await getUser(ctx.from.id, ctx.from.username);

    if (!user.isVerified) {
      await ctx.reply(text.needVerif);
      return;
    }

    await ctx.reply(text.unverif);
    user.isSubscribe = false;
    await user.save();
  } catch (error) {
    console.log(error);
  }
});

userRouter.hears(text.buttons.verify, async (ctx) => {
  try {
    await ctx.scene.enter("verif");
  } catch (error) {
    console.log(error);
  }
});

export default userRouter;
