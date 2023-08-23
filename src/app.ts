import { CacheType, Interaction } from "discord.js";
import "dotenv/config";
import express, { Express } from "express";
import "./commands";
import { SlashCommandRegistry } from "./model/registry/slash-command-registry";
import discordService from "./services/discord-service";
import voiceService from "./services/voice-service";

const port: number = parseInt(process.env.SERVER_PORT);
const app: Express = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/soundboard", (req, res) => {
  // TODO
  res.send("TODO - json list of available sound properties");
});

app.post("/soundboard/:name", (req, res) => {
  voiceService.playAudio(req.params.name).then((triggered: boolean) => {
    res.send(
      triggered
        ? `Audio playback of ${req.params.name} triggered in currently connected voice channel`
        : `No audio playback triggered for ${req.params.name} as not connected to voice channel`,
    );
  });
});

app.delete("/soundboard", (req, res) => {
  res.send("TODO - Stop audio playback of current sound");
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
