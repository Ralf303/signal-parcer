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
      if (newUsername && user.username !== newUsername) {
        user.username = newUsername;
        await user.save();
      }
    }

    return user;
  } catch (error) {
    console.error("Error getting or updating user:", error);
  }
}

async function verifyUser(chatId) {
  try {
    const user = await User.findOne({ where: { chatId } });

    if (user) {
      user.isVerified = true;
      await user.save();
    }
  } catch (error) {
    console.error("Error verifying user:", error);
  }
}

async function getVerifieUsers() {
  try {
    const users = await User.findAll({ where: { isVerified: true } });
    return users;
  } catch (error) {
    console.error("Error sending message to all users:", error);
  }
}

async function getUsers() {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    console.error("Error sending message to all users:", error);
  }
}

export { getUser, verifyUser, getVerifieUsers, getUsers };
