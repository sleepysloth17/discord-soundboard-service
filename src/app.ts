import { CacheType, Interaction } from "discord.js";
import "dotenv/config";
import express, { Express } from "express";
import "./commands";
import { SlashCommandRegistry } from "./commands/slash-command-registry";
import soundboardRouter from "./routes/soundboard-router";
import discordService from "./services/discord-service";

const port: number = parseInt(process.env.SERVER_PORT);
const app: Express = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/soundboard", soundboardRouter);

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
