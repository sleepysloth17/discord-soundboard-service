import { CacheType, Interaction } from "discord.js";
import "dotenv/config";
import express, { Express } from "express";
import "./app/commands";
import { SlashCommandRegistry } from "./app/commands/model/slash-command-registry";
import soundboardRouter from "./app/routes/soundboard-router";
import discordService from "./app/services/discord-service";

const port: number = parseInt(process.env.SERVER_PORT);
const app: Express = express();

app.get("/", (req, res) => {
  // https://expressjs.com/en/guide/using-template-engines.html
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
