// https://stackoverflow.com/questions/41580798/how-to-play-audio-file-into-channel

import { createAudioResource, getVoiceConnection } from "@discordjs/voice";
import { VoiceBasedChannel } from "discord.js";
import { BehaviorSubject, filter, firstValueFrom, map, take } from "rxjs";
import { Singleton } from "../../utils/annotations/singleton";
import { VoiceConnectionComponent } from "./voice-connection-component";

interface IDestroy {
  destroy(): void;
}

// https://discordjs.guide/voice/#barebones
// TODO - can we play audio as a specific user instead of the bot?
@Singleton
export class VoiceService {
  private connectionSubject: BehaviorSubject<VoiceConnectionComponent> =
    new BehaviorSubject(null);

  constructor() {}

  /**
   * Return true if a new connection is created, else false.
   * Note for false, a current connection could exist: we just haven't created a new one.
   * TODO - maybe not like this, as is a litte opaque?
   *
   * @returns {boolean} whether or not a new connection was established
   */
  public connect(channel: VoiceBasedChannel): Promise<boolean> {
    return firstValueFrom(
      this.connectionSubject.pipe(
        take(1),
        map((currentConnection: VoiceConnectionComponent) => {
          if (currentConnection?.channel.id != channel.id) {
            this.handleReconnection(
              currentConnection ?? getVoiceConnection(channel.guildId),
              channel,
            );
            return true;
          }
          return false;
        }),
      ),
    );
  }

  private handleReconnection(
    currentConnection: IDestroy,
    channel: VoiceBasedChannel,
  ): void {
    if (currentConnection) {
      console.log("Destorying current exisiting connection");
      currentConnection.destroy();
    }

    console.log(`Connecting to new channel: ${channel.name}`);
    this.connectionSubject.next(
      VoiceConnectionComponent.createInChannel(channel),
    );
  }

  /**
   * Destroy the current connection, if one exists, else do nothing.
   *
   * TODO - I should really disconnect according to the subject and then update that I think e.g trigger that to the new value, and this disconnects from the previous one?
   */
  public disconnect(): void {
    this.connectionSubject.pipe(take(1), filter(Boolean)).subscribe((c) => {
      console.log(`Disconnecting from channel: ${c.channel.name}`);
      c.destroy();
      this.connectionSubject.next(null);
    });
  }

  /**
   * Play the given audio in the current connection, if one exists, else do nothing.
   */
  public playAudio(path: string): Promise<boolean> {
    return firstValueFrom(
      this.connectionSubject.pipe(
        take(1),
        map((connection: VoiceConnectionComponent) => {
          if (!connection) {
            console.log("No connection exists, playback failed");
            return false;
          }

          console.log(`Playing ${path} in channel ${connection.channel.name}`);
          connection.play(createAudioResource(path, {}));
          return true;
        }),
      ),
    );
  }

  /**
   * @returns true if will stop, else false
   */
  public stop(): Promise<boolean> {
    return firstValueFrom(
      this.connectionSubject.pipe(
        take(1),
        map((connection: VoiceConnectionComponent) => {
          return !!connection?.stop();
        }),
      ),
    );
  }
}

export default new VoiceService();
