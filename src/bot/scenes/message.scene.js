import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { getUsers, getVerifieUsers } from "../../db/functions.js";
import { sleep } from "../utils.js";

const messageScene = new Scenes.BaseScene("message");

messageScene.enter(async (ctx) => {
  await ctx.reply("Введите текст рассылки");
});

messageScene.on(message("text"), async (ctx) => {
  try {
    const { text } = ctx;
    const parse = ctx.entities();
    const target = ctx.session.target;
    await ctx.react("👍");
    let whiteUsers = 0;
    let blackUsers = 0;

    if (target === "all") {
      const users = await getUsers();
      for (const user of users) {
        try {
          await ctx.telegram.sendMessage(user.chatId, text, {
            entities: parse,
          });
          whiteUsers++;
          await sleep(500);
        } catch (error) {
          blackUsers++;
          continue;
        }
      }
    } else if (target === "subscribers") {
      const users = await getVerifieUsers();
      for (const user of users) {
        try {
          await ctx.telegram.sendMessage(user.chatId, text, {
            entities: parse,
          });
          whiteUsers++;
          await sleep(500);
        } catch (error) {
          blackUsers++;
          continue;
        }
      }
    }

    await ctx.reply(
      `Рассылка закончена\n\nУспешно: ${whiteUsers}\nЗабанили бота ${blackUsers}`
    );
    await ctx.scene.leave();
  } catch (error) {
    console.log(error);
  }
});

messageScene.on(message("photo"), async (ctx) => {
  try {
    const { photo, caption } = ctx.message;
    const parse = ctx.entities();
    const target = ctx.session.target;
    await ctx.react("👍");
    let whiteUsers = 0;
    let blackUsers = 0;

    if (target === "all") {
      const users = await getUsers();

      for (const user of users) {
        try {
          await ctx.telegram.sendPhoto(user.chatId, photo[0].file_id, {
            caption,
            caption_entities: parse,
          });
          whiteUsers++;
          await sleep(500);
        } catch (error) {
          blackUsers++;
          continue;
        }
      }
    } else if (target === "subscribers") {
      const users = await getVerifieUsers();
      for (const user of users) {
        try {
          await ctx.telegram.sendPhoto(user.chatId, photo[0].file_id, {
            caption,
            caption_entities: parse,
          });
          whiteUsers++;
          await sleep(500);
        } catch (error) {
          blackUsers++;
          continue;
        }
      }
    }

    await ctx.reply(
      `Рассылка закончена\n\nУспешно: ${whiteUsers}\nЗабанили бота ${blackUsers}`
    );
    await ctx.scene.leave();
  } catch (error) {
    console.log(error);
  }
});
export default messageScene;
