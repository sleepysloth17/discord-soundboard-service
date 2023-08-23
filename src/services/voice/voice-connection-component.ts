import {
  AudioPlayer,
  AudioResource,
  PlayerSubscription,
  VoiceConnection,
  VoiceConnectionState,
  VoiceConnectionStatus,
  createAudioPlayer,
  joinVoiceChannel,
} from "@discordjs/voice";
import { VoiceBasedChannel } from "discord.js";
import { Subject } from "rxjs";

interface VoiceConnectionStateChange {
  status: VoiceConnectionStatus;
  oldState: VoiceConnectionState;
  newState: VoiceConnectionState;
}

// https://discordjs.guide/voice/voice-connections
// https://stackoverflow.com/questions/70415159/can-you-stream-audio-from-a-url-in-a-discord-js-resource
// TODO - make sure that if this leaves accidentally, we rejoin I guess or it self heals if something goes wrong??
export class VoiceConnectionComponent {
  public static createInChannel(
    channel: VoiceBasedChannel,
  ): VoiceConnectionComponent {
    return new VoiceConnectionComponent(
      channel,
      joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      }),
    );
  }

  private readonly connectionChangeSubject: Subject<VoiceConnectionStateChange> =
    new Subject();

  private readonly playerSubscription: PlayerSubscription;

  private constructor(
    public readonly channel: VoiceBasedChannel,
    private readonly connection: VoiceConnection,
    private readonly player: AudioPlayer = createAudioPlayer(),
  ) {
    connection.on(VoiceConnectionStatus.Ready, (o, n) =>
      this.triggerSubject(VoiceConnectionStatus.Ready, o, n),
    );
    connection.on(VoiceConnectionStatus.Connecting, (o, n) =>
      this.triggerSubject(VoiceConnectionStatus.Connecting, o, n),
    );
    connection.on(VoiceConnectionStatus.Destroyed, (o, n) =>
      this.triggerSubject(VoiceConnectionStatus.Destroyed, o, n),
    );
    connection.on(VoiceConnectionStatus.Disconnected, (o, n) =>
      this.triggerSubject(VoiceConnectionStatus.Disconnected, o, n),
    );
    connection.on(VoiceConnectionStatus.Ready, (o, n) =>
      this.triggerSubject(VoiceConnectionStatus.Ready, o, n),
    );
    this.playerSubscription = this.connection.subscribe(player);
  }

  private triggerSubject(
    status: VoiceConnectionStatus,
    oldState: VoiceConnectionState,
    newState: VoiceConnectionState,
  ): void {
    this.connectionChangeSubject.next({ status, oldState, newState });
  }

  public play(resource: AudioResource): void {
    this.player.play(resource);
  }

  public stop(): boolean {
    console.log("Stopping currently playing track");
    return this.player.stop();
  }

  public destroy(): void {
    console.log(`Destorying connection to: ${this.channel.name}`);
    this.connection.destroy();
    this.playerSubscription?.unsubscribe();
  }
}
