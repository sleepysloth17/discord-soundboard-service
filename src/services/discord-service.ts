import {
  CacheType,
  Channel,
  Client,
  Events,
  GatewayIntentBits,
  Interaction,
  Message,
  TextChannel,
  VoiceState,
} from "discord.js";
import { Observable, Subject } from "rxjs";
import { Singleton } from "../model/services/singleton";

@Singleton
export class DiscordService {
  private static readonly DISCORD_TOKEN: string = process.env.DISCORD_TOKEN;

  private messageCreateSubject: Subject<Message<boolean>> = new Subject();
  private interactionCreateSubject: Subject<Interaction<CacheType>> =
    new Subject();
  private voiceStateSubject: Subject<{
    oldState: VoiceState;
    newState: VoiceState;
  }> = new Subject();

  constructor(private readonly client: Client) {
    client.once(Events.ClientReady, (c: Client<true>) =>
      console.log(`Discord service ready! Logged in as ${c.user.tag}`),
    );
    client.on(Events.MessageCreate, (v) => this.messageCreateSubject.next(v));
    client.on(Events.InteractionCreate, (v) =>
      this.interactionCreateSubject.next(v),
    );
    client.on(Events.VoiceStateUpdate, (oldState, newState) =>
      this.voiceStateSubject.next({ oldState, newState }),
    );
  }

  // To get around the register commands script from causing a login event
  public login(): void {
    this.client.login(DiscordService.DISCORD_TOKEN);
  }

  public onMessage(): Observable<Message<boolean>> {
    return this.messageCreateSubject;
  }

  public onInteraction(): Observable<Interaction<CacheType>> {
    return this.interactionCreateSubject;
  }

  public onVoiceState(): Observable<{
    oldState: VoiceState;
    newState: VoiceState;
  }> {
    return this.voiceStateSubject;
  }

  public sendMessage(message: string): void {
    const channel: Channel =
      this.client.channels.cache.get("831958831042658307");
    if (channel instanceof TextChannel) {
      channel.send(message);
    }
  }
}

export default new DiscordService(
  new Client({
    intents: [
      GatewayIntentBits.Guilds,
      // GatewayIntentBits.GuildPresences,
      // GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildVoiceStates,
    ],
  }),
);
