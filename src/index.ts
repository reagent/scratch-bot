import dotenv from "dotenv";

import Discord from "discord.js";

import { Project } from "./project";

dotenv.config(); // Load .env

const client = new Discord.Client();
const token = process.env.LOGIN_TOKEN;

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on("message", async (message) => {
  const pattern = /^(?:!s)\s*(?<user>\S+)(?<extra>.*)$/;
  const matched = message.content.match(pattern);

  if (matched) {
    const user = matched.groups?.user;
    const extra = matched.groups?.extra;

    if (!user || extra) {
      message.reply("Invalid command, use: !s <username>");
    } else {
      const project = await Project.latestFor(user);

      message.reply(`here's ${user}'s latest project`, {
        embed: {
          title: project.title,
          thumbnail: { url: project.image },
          url: `https://scratch.mit.edu/projects/${project.id}/`,
          fields: [
            { name: "Views", value: project.stats.views },
            { name: "Faves", value: project.stats.favorites },
            { name: "Loves", value: project.stats.loves },
            { name: "Comments", value: project.stats.comments },
          ],
        },
      });
    }
  }
});

client.login(token).catch((e) => {
  console.error(`Login failed: ${e}`);
  process.exit(1);
});
