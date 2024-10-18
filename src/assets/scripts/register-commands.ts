import {
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import "../../app/commands";
import { SlashCommandRegistry } from "../../app/commands/model/slash-command-registry";
import environment from "../../environment";

const rest: REST = new REST().setToken(environment.discordToken);

(async () => {
  const body: readonly RESTPostAPIChatInputApplicationCommandsJSONBody[] =
    SlashCommandRegistry.getJsonList();

  console.log(`Started refreshing ${body.length} application (/) commands.`);

  // The put method is used to fully refresh all commands in the guild with the current set
  rest
    .put(
      Routes.applicationGuildCommands(
        environment.discordClientId,
        environment.discordGuildId,
      ),
      { body },
    )
    .then(() => console.log("Successfully reloaded application (/) commands"))
    .catch(console.error);
})();
