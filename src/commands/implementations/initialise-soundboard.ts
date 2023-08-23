import { AudioResource, createAudioResource } from "@discordjs/voice";
import {
  CacheType,
  ChatInputCommandInteraction,
  GuildMember,
  InteractionReplyOptions,
  InteractionResponse,
  SlashCommandBuilder,
  VoiceBasedChannel,
} from "discord.js";
import { join } from "node:path";
import { first } from "rxjs";
import { VoiceConnectionComponent } from "../../components/voice-connection-component";
import { DiscordSlashCommand } from "../../model/commands/discord-slash-command";
import { Optional } from "../../model/optional/optional";
import { SlashCommandRegistry } from "../../model/registry/slash-command-registry";
import discordService from "../../services/discord-service";

// TODO - maybe factory that takes the args to pass into teh construtor so I can pass discordService?
// TODO - note that it currently initialises discord when I, say, register everything.
// I guess, ideally, it won't do that: register will simply register the data
// So app.ts -> create soundboard map, register -> just get data
@SlashCommandRegistry.register
export class InitialiseSoundboard implements DiscordSlashCommand {
  private static readonly ALLOWED_USER_ID: string = process.env.DISCORD_USER_ID;

  public data: SlashCommandBuilder;

  constructor() {
    this.data = new SlashCommandBuilder()
      .setName("invite")
      .setDescription(
        "Invites the soundboard to the current voice channel, if a member of one",
      );
  }

  public execute(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<InteractionResponse<boolean>> {
    if (interaction.member instanceof GuildMember) {
      const member: GuildMember = interaction.member;
      if (this.isAllowedUser(member)) {
        return interaction.reply(
          Optional.of(member.voice.channel)
            .map((voiceChannel: VoiceBasedChannel) =>
              this.joinChannel(member, voiceChannel),
            )
            .orElse({
              content: "You are not in a voice channel",
              ephemeral: true,
            }),
        );
      } else {
        return interaction.reply("Nope, you can't do that.");
      }
    }

    return interaction.reply({
      content: "There was an error whilst executing this comment",
      ephemeral: true,
    });
  }

  private isAllowedUser(member: GuildMember): boolean {
    return member.id.valueOf() == InitialiseSoundboard.ALLOWED_USER_ID;
  }

  private joinChannel(
    member: GuildMember,
    channel: VoiceBasedChannel,
  ): InteractionReplyOptions {
    const connect: VoiceConnectionComponent =
      VoiceConnectionComponent.createInChannel(channel);
    const resource: AudioResource = createAudioResource(
      join(__dirname, "censor-beep.mp3"),
      {},
    );

    // TODO - handle connecting multiple times to the same one
    connect.play(resource);

    discordService
      .onVoiceState()
      .pipe(
        first(
          ({ oldState, newState }) =>
            oldState.member.id == member.id &&
            oldState.channelId == channel.id &&
            newState.channelId != oldState.channelId,
        ),
      )
      .subscribe(() => {
        // TODO - make sure this happens at some point if for whatever reason the bot doens't leave
        connect.destroy();
      });

    return {
      content: `Soundboard invited to ${channel.name}`,
      ephemeral: true,
    };
  }
}
