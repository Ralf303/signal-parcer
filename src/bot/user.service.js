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

userRouter.hears(text.buttons.instruction, async (ctx) => {
  try {
    await ctx.replyWithMediaGroup([
      {
        type: "photo",
        media: { source: "./img/photo1.jpg" },
        caption: `Для начала вам потребуется телефон или компьютер и хорошее интернет соединение,я лично предпочитаю компьютер,но когда не дома торгую с телефона
Начнем!💰

1️⃣Торговая платформа bit.ly/BINARIUM_RU

Переходим на сайт брокера и регистрируем аккаунт👇

bit.ly/BINARIUM_RU

Вводим свою почту,придумываем пароль и выбираем валюту в которой будем пополнять баланс.В моем случае - Российский рубль:

2️⃣Далее вводим своё настоящее имя и фамилию (чтобы не было проблем с выводом) и номер вашего телефона.

3️⃣Подтверждаем почту (на вашу почту придет письмо по которому нужно перейти) и всё, ваш аккаунт готов к работе!💪🏼 

4️⃣Осталось только пополнить баланс и отправить свой ID акаунта боту на проверку

<em>Пополнить баланс можно любым удобным способом будь это карта или крипта</em>

5️⃣Находим свой ID акаунта и запоминаем,далее переходим в бота и нажимаем кнопку «ПРОВЕРИТЬ ID” и отправляем его боту

<em>Далее ожидаем подтверждения от бота и получаем сигналы✅</em>`,
        parse_mode: "HTML",
      },
      {
        type: "photo",
        media: { source: "./img/photo2.jpg" },
      },
      {
        type: "photo",
        media: { source: "./img/photo3.jpg" },
      },
    ]);
  } catch (error) {
    console.log(error);
  }
});

export default userRouter;
