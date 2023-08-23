import { SoundboardItem } from "../components/soundboard-item";
import { Optional } from "../model/optional/optional";
import { UUID } from "../model/uuid/uuid";
import { SoundboardItemService } from "./soundboard/soundboard-item-service";
import { SoundboardItemServiceProvider } from "./soundboard/soundboard-item-service-provider";
import voiceService, { VoiceService } from "./voice-service";

export class SoundboardService {
  constructor(
    private readonly soundboardItemService: SoundboardItemService,
    private readonly voiceService: VoiceService,
  ) {}

  public getItems(): Promise<SoundboardItem[]> {
    return this.soundboardItemService.getItems();
  }

  public playSound(id: UUID): Promise<boolean> {
    return this.soundboardItemService
      .getItem(id)
      .then((optional: Optional<SoundboardItem>) =>
        optional
          .map((item: SoundboardItem) => this.voiceService.playAudio(item.path))
          .orElse(Promise.resolve(false)),
      );
  }
}

export default new SoundboardService(
  SoundboardItemServiceProvider.get(),
  voiceService,
);
