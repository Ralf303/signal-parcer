import { Composer } from "telegraf";
import { getUser } from "../db/functions.js";
import { Keyboard } from "telegram-keyboard";
import text from "../../text.js";

const startKeyboard = Keyboard.make([
  [text.buttons.subscribe],
  [text.buttons.unsubscribe],
]);

const adminService = new Composer();

adminService.command("send", async (ctx) => {
  const isAdmin = ctx.from.id == "1157591765" || ctx.from.id == "7391696084";
  if (!isAdmin) {
    return ctx.reply("You are not an admin");
  }
  await ctx.scene.enter("param");
});

adminService.action("cancel", async (ctx) => {
  await ctx.deleteMessage();
});

adminService.action(/verify:(.*):(.*)/, async (ctx) => {
  const userId = ctx.match[2];

  const user = await getUser(userId);

  if (!user) {
    return ctx.reply("User not found");
  }

  user.isVerified = true;
  await user.save();

  await ctx.reply("User verified");
  await ctx.deleteMessage();
  await ctx.telegram.sendMessage(
    userId,
    "Ваша заявка одобрена. Вы можете начать использовать бота, жми /start чтобы обновить кнопки"
  );
});

export default adminService;
