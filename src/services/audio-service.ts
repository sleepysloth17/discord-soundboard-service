// https://stackoverflow.com/questions/41580798/how-to-play-audio-file-into-channel

import { AudioResource, createAudioResource } from "@discordjs/voice";
import { join } from "path";
import { BehaviorSubject, filter, take } from "rxjs";
import { VoiceConnectionComponent } from "../components/voice-connection-component";
import { Singleton } from "../model/services/singleton";

// https://discordjs.guide/voice/#barebones
@Singleton
export class VoiceService {
  private connectionSubject: BehaviorSubject<VoiceConnectionComponent> =
    new BehaviorSubject(null); // maybe check if it currently has a connection at all?

  public connect(connection: VoiceConnectionComponent): void {
    // VoiceConnectionComponent.createInChannel(connection);

    this.connectionSubject.next(connection);
  }

  public disconnect(): void {
    this.connectionSubject.pipe(take(1), filter(Boolean)).subscribe((c) => {
      c.destroy();
      this.connectionSubject.next(null);
    });
  }

  public playAudio(name: string): void {
    const resource: AudioResource = createAudioResource(
      join(__dirname, name),
      {},
    );

    // const n = Math.random();
    // TODO - check this bad bot
    this.connectionSubject
      .pipe(take(1), filter(Boolean))
      .subscribe((c) => c.play(resource));
  }
}

export default new VoiceService();
