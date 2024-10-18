import "dotenv/config";

const environment = {
  serverPort: process.env.SERVER_PORT,
  soundboardItemSource: process.env.SOUNDBOARD_ITEM_SOURCE,
  audioDir: process.env.AUDIO_DIR,
  audioBaseUrl: process.env.AUDIO_BASE_URL,
  jsonDatabase: process.env.JSON_DATABASE,
  discordToken: process.env.DISCORD_TOKEN,
  discordClientId: process.env.DISCORD_CLIENT_ID,
  discordGuildId: process.env.DISCORD_GUILD_ID,
  discordUserId: process.env.DISCORD_USER_ID,
};

export default environment;
