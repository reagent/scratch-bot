type Options = {
  prefix: string;
};

export class Trigger {
  private pattern: RegExp;

  constructor(private readonly options: Options) {
    this.pattern = new RegExp(`^${this.options.prefix}\\s*(?<command>.+)?$`);
  }

  triggerOn(message: string): string | undefined {
    const matches = message.match(this.pattern);

    if (!matches) {
      return;
    }

    return matches.groups!.command || '';
  }
}
