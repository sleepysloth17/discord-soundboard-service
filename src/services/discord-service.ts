import {
  CacheType,
  Client,
  Events,
  GatewayIntentBits,
  Interaction,
  Message,
} from "discord.js";
import { Observable, Subject } from "rxjs";
import { Singleton } from "../model/services/singleton";

@Singleton
export class DiscordService {
  private static readonly DISCORD_TOKEN: string = process.env.DISCORD_TOKEN;

  private messageCreateSubject: Subject<Message<boolean>> = new Subject();
  private interactionCreateSubject: Subject<Interaction<CacheType>> =
    new Subject();

  constructor(private readonly client: Client) {
    client.once(Events.ClientReady, (c: Client<true>) =>
      console.log(`Ready! Logged in as ${c.user.tag}`),
    );
    client.on(Events.MessageCreate, (v) => this.messageCreateSubject.next(v));
    client.on(Events.InteractionCreate, (v) =>
      this.interactionCreateSubject.next(v),
    );
    client.login(DiscordService.DISCORD_TOKEN);
  }

  public onMessage(): Observable<Message<boolean>> {
    return this.messageCreateSubject;
  }

  public onInteraction(): Observable<Interaction<CacheType>> {
    return this.interactionCreateSubject;
  }
}

export default new DiscordService(
  new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  }),
);
