import {
  CacheType,
  ChatInputCommandInteraction,
  InteractionResponse,
  SlashCommandBuilder,
} from "discord.js";
import { DiscordSlashCommand } from "../../model/commands/discord-slash-command";
import { SlashCommandRegistry } from "../../model/registry/slash-command-registry";

@SlashCommandRegistry.register
export class Ping implements DiscordSlashCommand {
  public data: SlashCommandBuilder;

  constructor() {
    this.data = new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Replies with Pong!");
  }

  public execute(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<InteractionResponse<boolean>> {
    return interaction.reply("Pong!");
  }
}
