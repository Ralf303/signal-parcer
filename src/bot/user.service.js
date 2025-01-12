import { Composer } from "telegraf";
import { Key, Keyboard } from "telegram-keyboard";
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

const inlineKeyboard = Keyboard.inline([
  [Key.url("ПОДПИСАТЬСЯ", "tg://settings")],
  ["✅ПОДПИСАЛСЯ"],
]);

const registInlineKeyboard = Keyboard.inline([
  [Key.url("ЗАРЕГЕСТРИРОВАТЬСЯ", "https://bit.ly/BINARIUM_RU")],
  ["✅Я УЖЕ ЗАРЕГИСТРИРОВАН "],
]);

const userRouter = new Composer();

userRouter.start(async (ctx) => {
  try {
    await ctx.reply(
      `Привет! Чтобы получить доступ к торговому боту RT AI TRADE,нужно быть подписанным на мой канал`,
      inlineKeyboard
    );
  } catch (error) {
    console.log(error);
  }
});

userRouter.action("✅ПОДПИСАЛСЯ", async (ctx) => {
  try {
    await ctx.reply(
      `⚡️Торгуем тут: https://bit.ly/BINARIUM_RU`,
      registInlineKeyboard
    );
    await ctx.deleteMessage();
  } catch (error) {
    console.log(error);
  }
});

userRouter.action("✅Я УЖЕ ЗАРЕГИСТРИРОВАН ", async (ctx) => {
  try {
    await ctx.reply(`🔗Вот ваша ссылка : 
Торговый бот для валютных пар - https://t.me/+JjOnwUyDHhpkNzMx`);
    await ctx.deleteMessage();
  } catch (error) {
    console.log(error);
  }
});
// userRouter.hears(text.buttons.subscribe, async (ctx) => {
//   try {
//     const user = await getUser(ctx.from.id, ctx.from.username);

//     if (user.isSubscribe) {
//       await ctx.reply(text.alreadySubscribed);
//       return;
//     }

//     if (!user.isVerified) {
//       await ctx.replyWithHTML(text.needVerif);
//       return;
//     }

//     await ctx.replyWithHTML(text.subscribed);
//     user.isSubscribe = true;
//     await user.save();
//   } catch (error) {
//     console.log(error);
//   }
// });

// userRouter.hears(text.buttons.unsubscribe, async (ctx) => {
//   try {
//     const user = await getUser(ctx.from.id, ctx.from.username);

//     if (!user.isVerified) {
//       await ctx.replyWithHTML(text.needVerif);
//       return;
//     }

//     await ctx.replyWithHTML(text.unverif);
//     user.isSubscribe = false;
//     await user.save();
//   } catch (error) {
//     console.log(error);
//   }
// });

// userRouter.hears(text.buttons.verify, async (ctx) => {
//   try {
//     await ctx.scene.enter("verif");
//   } catch (error) {
//     console.log(error);
//   }
// });

// userRouter.hears(text.buttons.instruction, async (ctx) => {
//   try {
//     await ctx.replyWithMediaGroup([
//       {
//         type: "photo",
//         media: { source: "./img/photo1.jpg" },
//         caption: `Для начала вам потребуется телефон или компьютер и хорошее интернет соединение,я лично предпочитаю компьютер,но когда не дома торгую с телефона
// Начнем!💰

// 1️⃣Торговая платформа bit.ly/BINARIUM_RU

// Переходим на сайт брокера и регистрируем аккаунт👇

// bit.ly/BINARIUM_RU

// Вводим свою почту,придумываем пароль и выбираем валюту в которой будем пополнять баланс.В моем случае - Российский рубль:

// 2️⃣Далее вводим своё настоящее имя и фамилию (чтобы не было проблем с выводом) и номер вашего телефона.

// 3️⃣Подтверждаем почту (на вашу почту придет письмо по которому нужно перейти) и всё, ваш аккаунт готов к работе!💪🏼

// 4️⃣Осталось только пополнить баланс и отправить свой ID акаунта боту на проверку

// <em>Пополнить баланс можно любым удобным способом будь это карта или крипта</em>

// 5️⃣Находим свой ID акаунта и запоминаем,далее переходим в бота и нажимаем кнопку «ПРОВЕРИТЬ ID” и отправляем его боту

// <em>Далее ожидаем подтверждения от бота и получаем сигналы✅</em>`,
//         parse_mode: "HTML",
//       },
//       {
//         type: "photo",
//         media: { source: "./img/photo2.jpg" },
//       },
//       {
//         type: "photo",
//         media: { source: "./img/photo3.jpg" },
//       },
//     ]);
//   } catch (error) {
//     console.log(error);
//   }
// });

export default userRouter;
