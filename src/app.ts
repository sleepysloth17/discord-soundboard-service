import {
  CacheType,
  Client,
  Events,
  GatewayIntentBits,
  Interaction,
  Message,
} from "discord.js";
import "dotenv/config";
import "./model/commands";
import { SlashCommandRegistry } from "./model/registry/slash-command-registry";

const token: string = process.env.DISCORD_TOKEN;
// Create a new client instance
const client: Client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c: Client<true>) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, (message: Message<boolean>) => {
  console.log(message.content);
});

client.on(Events.InteractionCreate, (interaction: Interaction<CacheType>) => {
  if (!interaction.isChatInputCommand()) return;
  SlashCommandRegistry.getCommandWithName(interaction.commandName).ifPresent(
    (cmd) => cmd.execute(interaction),
  );
});

// Log in to Discord with your client's token
client.login(token);
