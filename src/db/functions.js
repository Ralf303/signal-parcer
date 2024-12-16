import User from "./models.js";

async function getUser(chatId, newUsername) {
  try {
    let user = await User.findOne({ where: { chatId } });

    if (!user) {
      user = await User.create({
        chatId,
        username: newUsername,
        isVerified: false,
      });
    } else {
      if (user.username !== newUsername) {
        user.username = newUsername;
        await user.save();
      }
    }

    return user;
  } catch (error) {
    console.error("Error getting or updating user:", error);
  }
}

export default getUser;
