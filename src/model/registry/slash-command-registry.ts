import { RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";
import { DiscordSlashCommand } from "../commands/discord-slash-command";
import { DecoratorContxt } from "../decorator-contxt";
import { Optional } from "../optional/optional";

type Constructor<T> = {
  new (...args: unknown[]): T;
  readonly prototype: T;
};

// https://stackoverflow.com/questions/47082026/typescript-get-all-implementations-of-interface
export class SlashCommandRegistry {
  private static readonly SLASH_COMMAND_JSON_LIST: RESTPostAPIChatInputApplicationCommandsJSONBody[] =
    [];

  private static readonly SLASH_COMMAND_MAP: Record<
    string,
    DiscordSlashCommand
  > = {};

  public static register<T extends Constructor<DiscordSlashCommand>>(
    target: T,
    context: DecoratorContxt,
  ): T {
    console.log(`Registered slash command class: ${context.name}`);
    const command: DiscordSlashCommand = new target();
    SlashCommandRegistry.SLASH_COMMAND_JSON_LIST.push(command.data.toJSON());
    SlashCommandRegistry.SLASH_COMMAND_MAP[command.data.name] = command;
    return target;
  }

  public static getJsonList(): readonly RESTPostAPIChatInputApplicationCommandsJSONBody[] {
    return SlashCommandRegistry.SLASH_COMMAND_JSON_LIST;
  }

  public static getCommandWithName(
    name: string,
  ): Optional<DiscordSlashCommand> {
    return Optional.of(SlashCommandRegistry.SLASH_COMMAND_MAP[name]);
  }
}
