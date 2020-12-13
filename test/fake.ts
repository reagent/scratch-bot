import { User } from 'scratch-stats';
import { Client } from '../src/bot/types';

export class FakeClient implements Client {
  user(username: string): Promise<User | undefined> {
    return Promise.resolve(undefined);
  }
}
