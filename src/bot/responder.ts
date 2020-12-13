import { EmbedFieldData, MessageEmbed } from 'discord.js';
import { Scratch, Project, User } from 'scratch-stats';
import { Client } from './types';

const Commands = [
  'favorites',
  'following',
  'followers',
  'messages',
  'projects',
];

type Response = {
  message: string;
  embed?: MessageEmbed;
};

class ScratchClient implements Client {
  user(username: string): Promise<User | undefined> {
    return Scratch.user(username);
  }
}

export class Responder {
  private usage = `Usage: <username> (${Commands.join('|')})`;

  private client: Client;

  constructor(private readonly command: string, client?: Client) {
    this.client = client || new ScratchClient();
  }

  async response(): Promise<Response> {
    let response: Response = { message: this.usage };

    const commandPattern = Commands.join('|');

    const pattern = new RegExp(
      `^(?<username>\\S+\)\\s+(?<action>${commandPattern})\\s*(?<extra>.+)?$`
    );

    const matches = this.command.match(pattern);

    if (!matches) {
      return response;
    }

    const { username, action } = matches.groups!;

    const user = await this.client.user(username);

    if (!user) {
      return { message: `Error: the user "${username}" was not found` };
    }

    switch (action) {
      case 'favorites':
        const favorites = (await user.favorites()).slice(0, 5);

        const x: EmbedFieldData[] = favorites.map((f: Project) => ({
          name: f.title,
          value: `views: ${f.views}`,
        }));

        response = {
          message: `${username}'s favorites:`,
          embed: new MessageEmbed({ fields: x }),
        };

        break;
      case 'following':
        const following = (await user.following()).slice(0, 5);

        const z: EmbedFieldData[] = following.map((f: User) => ({
          name: f.username,
          value: f.country || 'Unknown',
        }));

        response = {
          message: `Users ${username} is following:`,
          embed: new MessageEmbed({ fields: z }),
        };
        break;
      case 'followers':
        const followers = (await user.followers()).slice(0, 5);

        const y: EmbedFieldData[] = followers.map((f: User) => ({
          name: f.username,
          value: f.country || 'Unknown',
        }));

        response = {
          message: `${username}'s followers:`,
          embed: new MessageEmbed({ fields: y }),
        };
        break;
      case 'messages':
        const messageCount = await user.messageCount();

        response = {
          message: `Messages waiting for "${username}": ${messageCount}`,
        };

        break;
      case 'projects':
        const projects = await (
          await user.projects({ order: { favorites: 'DESC' } })
        ).slice(0, 5);

        const o: EmbedFieldData[] = projects.map((p: Project) => ({
          name: p.title,
          value: `views: ${p.views}`,
        }));

        response = {
          message: `${username}'s popular projects:`,
          embed: new MessageEmbed({ fields: o }),
        };
        break;
    }

    return response;
  }
}
