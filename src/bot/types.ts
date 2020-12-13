import { User } from 'scratch-stats';

export interface Client {
  user(username: string): Promise<User | undefined>;
}
