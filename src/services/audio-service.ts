// https://stackoverflow.com/questions/41580798/how-to-play-audio-file-into-channel

import { VoiceConnection, getVoiceConnection } from "@discordjs/voice";

// https://discordjs.guide/voice/#barebones
export class VoiceService {
  // TODO - this will play a sound to a connection

  private getVoiceConnection(): VoiceConnection {
    return getVoiceConnection(process.env.DISCORD_GUILD_ID);
  }
}
