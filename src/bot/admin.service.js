import { Composer } from "telegraf";
import { getUser } from "../db/functions.js";

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
  const code = ctx.match[1];
  const userId = ctx.match[2];

  const user = await getUser(userId);

  if (!user) {
    return ctx.reply("User not found");
  }

  user.isVerified = true;
  await user.save();

  await ctx.reply("User verified");
  await ctx.deleteMessage();
});

export default adminService;
