import { project, user } from 'scratch-stats/dist/test/factories';

import { Responder } from './responder';
import { FakeClient } from '../../test/fake';

describe(`${Responder.name}`, () => {
  const usage =
    'Usage: <username> (favorites|following|followers|messages|projects)';

  describe('response()', () => {
    const client = new FakeClient();

    it('returns the usage information when no command is given', async () => {
      const responder = new Responder('', client);
      const response = await responder.response();

      expect(response).toEqual({
        message: usage,
      });
    });

    it('returns the usage infoormation when the command contains only the username', async () => {
      const responder = new Responder('rebbel16', client);
      const response = await responder.response();

      expect(response).toEqual({
        message: usage,
      });
    });

    it('returns an error message when the provided user does not exist', async () => {
      jest.spyOn(client, 'user').mockResolvedValueOnce(undefined);

      const responder = new Responder('rebbel16 favorites', client);
      const response = await responder.response();

      expect(response).toEqual({
        message: `Error: the user "rebbel16" was not found`,
      });

      expect(client.user).toHaveBeenLastCalledWith('rebbel16');
    });

    it("returns the user's favorites", async () => {
      const foundUser = user();

      const stats = {
        views: 420,
        loves: 0,
        favorites: 0,
        comments: 0,
        remixes: 0,
      };

      jest
        .spyOn(foundUser, 'favorites')
        .mockResolvedValueOnce([project({ title: 'Title', stats })]);

      jest.spyOn(client, 'user').mockResolvedValueOnce(foundUser);

      const responder = new Responder('rebbel16 favorites', client);
      const response = await responder.response();

      expect(response).toEqual({
        message: `rebbel16's favorites:`,
        embed: expect.objectContaining({
          fields: [{ inline: false, name: 'Title', value: 'views: 420' }],
        }),
      });
    });
  });
});
