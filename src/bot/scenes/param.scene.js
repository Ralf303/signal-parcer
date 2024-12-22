import { Scenes } from "telegraf";

const paramScene = new Scenes.BaseScene("param");

paramScene.enter(async (ctx) => {
  try {
    await ctx.reply("Кому будем делать рассылку?", {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Всем", callback_data: "all" },
            { text: "Подписчикам", callback_data: "subscribers" },
          ],
          [{ text: "Отмена", callback_data: "cancel" }],
        ],
      },
    });
  } catch (error) {
    console.log(error);
  }
});

paramScene.action("all", async (ctx) => {
  try {
    await ctx.deleteMessage();
    ctx.session.target = "all";
    await ctx.scene.enter("message");
  } catch (error) {
    console.log(error);
  }
});

paramScene.action("subscribers", async (ctx) => {
  try {
    await ctx.deleteMessage();
    ctx.session.target = "subscribers";
    await ctx.scene.enter("message");
  } catch (error) {
    console.log(error);
  }
});

paramScene.action("cancel", async (ctx) => {
  try {
    await ctx.scene.leave();
    await ctx.deleteMessage();
    await ctx.reply("Отменено");
  } catch (error) {
    console.log(error);
  }
});

export default paramScene;
