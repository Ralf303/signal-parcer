import { Composer } from "telegraf";
import { Keyboard } from "telegram-keyboard";
import { getUser } from "../db/functions.js";
import text from "../../text.js";

const startKeyboard = Keyboard.make([
  [text.buttons.subscribe],
  [text.buttons.unsubscribe],
]);

const verifyKeyboard = Keyboard.make([
  [text.buttons.verify],
  [text.buttons.instruction],
]);

const userRouter = new Composer();

userRouter.start(async (ctx) => {
  try {
    const user = await getUser(ctx.from.id, ctx.from.username);

    if (!user.isVerified) {
      return await ctx.reply(
        `Приветствую,${ctx.from.first_name}!👋🏻

Я RT AI TRADE BOT - 🤖 Искуственный интеллект который анализирует рынок с помощью более чем 300 индикаторов и дает сигналы на рынке бинарных опционов проходимость которых более 85%

Для получения сигналов выполните следующие пункты:
1️⃣ Пройдите регистрацию по данной ссылке👇

https://bin.gd/lp/sure-start/?partner_id=p48422p145496pf7a5

2️⃣ Пополните свой депозит 

3️⃣ Нажмите кнопку “ПРОВЕРИТЬ ID”.Далее отправьте свой ID акаунта в чат

4️⃣ Ожидайте подтверждения вашей заявки`,
        verifyKeyboard.reply()
      );
    }

    await ctx.reply(
      `С возвращением, ${ctx.from.first_name}\n\nПодписка на сигналы: ${
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
      await ctx.replyWithHTML(text.needVerif);
      return;
    }

    await ctx.replyWithHTML(text.subscribed);
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
      await ctx.replyWithHTML(text.needVerif);
      return;
    }

    await ctx.replyWithHTML(text.unverif);
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
