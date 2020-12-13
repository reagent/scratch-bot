import { Trigger } from './trigger';

describe(`${Trigger.name}`, () => {
  describe('triggerOn()', () => {
    it('is `undefined` when the provided message does not trigger the the command', () => {
      const trigger = new Trigger({ prefix: '!sb' });
      expect(trigger.triggerOn('ok !sb')).toBeUndefined();
    });

    it('is the empty string when the provided message triggers the command but provides no data', () => {
      const trigger = new Trigger({ prefix: '!sb' });
      expect(trigger.triggerOn('!sb')).toEqual('');
    });

    it('returns the string following the triggering command', () => {
      const trigger = new Trigger({ prefix: '!sb' });
      expect(trigger.triggerOn('!sb rebbel16')).toEqual('rebbel16');
    });

    it('allows triggering based on a different prefix', () => {
      const trigger = new Trigger({ prefix: 'hi' });
      expect(trigger.triggerOn('hi guy')).toEqual('guy');
    });
  });
});
