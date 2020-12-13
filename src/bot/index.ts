import dotenv from 'dotenv';

import Discord from 'discord.js';

import { Trigger } from './trigger';
import { Responder } from './responder';

dotenv.config(); // Load .env

const token = process.env.LOGIN_TOKEN;

const client = new Discord.Client();
const trigger = new Trigger({ prefix: '!sb' });

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on('message', async (message) => {
  const command = trigger.triggerOn(message.content);

  if (command !== undefined) {
    const responder = new Responder(command);
    const { message: reply, embed } = await responder.response();

    message.reply(reply, { embed });
  }
});

client.login(token).catch((e) => {
  console.error(`Login failed: ${e}`);
  process.exit(1);
});
