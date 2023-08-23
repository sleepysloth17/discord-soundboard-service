import { CacheType, Interaction } from "discord.js";
import "dotenv/config";
import express, { Express } from "express";
import "./commands";
import { SlashCommandRegistry } from "./model/registry/slash-command-registry";
import voiceService from "./services/audio-service";
import discordService from "./services/discord-service";

const port: number = parseInt(process.env.SERVER_PORT);
const app: Express = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
  voiceService.playAudio("censor-beep.mp3");
  // discordService.sendMessage("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}, logging into discord`);

  discordService.login();
  discordService
    .onInteraction()
    .subscribe((interaction: Interaction<CacheType>) => {
      if (!interaction.isChatInputCommand()) return;
      SlashCommandRegistry.getCommandWithName(
        interaction.commandName,
      ).ifPresent((cmd) => cmd.execute(interaction));
    });
});

// console.log(generateDependencyReport());
