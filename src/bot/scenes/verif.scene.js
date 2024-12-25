import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import text from "../../../text";

const verifScene = new Scenes.BaseScene("verif");

verifScene.enter(async (ctx) => {
  try {
    await ctx.reply(text.enterCode);
  } catch (error) {
    console.log(error);
  }
});

verifScene.on(message("text"), async (ctx) => {
  try {
    await ctx.scene.leave();

    await ctx.telegram.sendMessage(
      "1157591765",
      `НОВАЯ ЗАЯВКА:\n\nЮзер: @${ctx.from.username}\nid юзера: ${ctx.from.id}\nКод: ${ctx.message.text}`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Подтвердить",
                callback_data: `verify:${ctx.message.text}:${ctx.from.id}`,
              },
            ],
            [
              {
                text: "Отменить",
                callback_data: "cancel",
              },
            ],
          ],
        },
      }
    );

    await ctx.telegram.sendMessage(
      "7391696084",
      `НОВАЯ ЗАЯВКА:\n\nЮзер: @${ctx.from.username}\nid юзера: ${ctx.from.id}\nКод: ${ctx.message.text}`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Подтвердить",
                callback_data: `verify:${ctx.message.text}:${ctx.from.id}`,
              },
            ],
            [
              {
                text: "Отменить",
                callback_data: "cancel",
              },
            ],
          ],
        },
      }
    );

    await ctx.scene.leave();
    await ctx.reply("Заявка отправлена на проверку");
  } catch (error) {
    await ctx.scene.leave();
    console.log(error);
  }
});

export default verifScene;
