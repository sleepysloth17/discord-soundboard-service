import { CacheType, Interaction } from "discord.js";
import "dotenv/config";
import express, { Express } from "express";
import path from "path";
import "./app/commands";
import { SlashCommandRegistry } from "./app/commands/model/slash-command-registry";
import soundboardRouter from "./app/routes/soundboard-router";
import discordService from "./app/services/discord-service";

const port: number = parseInt(process.env.SERVER_PORT);
const app: Express = express();

// TODO - CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

app.use("/soundboard", soundboardRouter);
app.use("/assets", express.static(path.join(__dirname, "./assets/audio"))); // https://expressjs.com/en/starter/static-files.html

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
