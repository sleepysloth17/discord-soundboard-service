import { CacheType, Interaction } from "discord.js";
import "dotenv/config";
import "./commands";
import { SlashCommandRegistry } from "./model/registry/slash-command-registry";
import discordService from "./services/discord-service";

discordService
  .onInteraction()
  .subscribe((interaction: Interaction<CacheType>) => {
    if (!interaction.isChatInputCommand()) return;
    SlashCommandRegistry.getCommandWithName(interaction.commandName).ifPresent(
      (cmd) => cmd.execute(interaction),
    );
  });
