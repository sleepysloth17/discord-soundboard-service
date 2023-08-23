import {
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import "dotenv/config";
import "../../app/commands";
import { SlashCommandRegistry } from "../../app/commands/model/slash-command-registry";

const rest: REST = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  const body: readonly RESTPostAPIChatInputApplicationCommandsJSONBody[] =
    SlashCommandRegistry.getJsonList();

  console.log(`Started refreshing ${body.length} application (/) commands.`);

  // The put method is used to fully refresh all commands in the guild with the current set
  rest
    .put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID,
        process.env.DISCORD_GUILD_ID,
      ),
      { body },
    )
    .then(() => console.log("Successfully reloaded application (/) commands"))
    .catch(console.error);
})();
