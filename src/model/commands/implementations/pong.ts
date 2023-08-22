import {
  CacheType,
  ChatInputCommandInteraction,
  InteractionResponse,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommandRegistry } from "../../registry/slash-command-registry";
import { DiscordSlashCommand } from "../discord-slash-command";

@SlashCommandRegistry.register
export class Pong implements DiscordSlashCommand {
  public data: SlashCommandBuilder;

  constructor() {
    this.data = new SlashCommandBuilder()
      .setName("pong")
      .setDescription("Replies with Ping!");
  }

  public execute(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<InteractionResponse<boolean>> {
    return interaction.reply("Ping!");
  }
}
