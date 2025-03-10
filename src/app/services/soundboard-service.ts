import { Optional } from "../utils/optional";
import { UUID } from "../utils/uuid";
import { SoundboardItem } from "./soundboard-items/soundboard-item";
import { SoundboardItemService } from "./soundboard-items/soundboard-item-service";
import { SoundboardItemServiceProvider } from "./soundboard-items/soundboard-item-service-provider";
import voiceService, { VoiceService } from "./voice/voice-service";

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

  public saveItem(id: UUID, name: string, icon: string): Promise<void> {
    return this.soundboardItemService.saveItem(id, name, icon);
  }
}

export default new SoundboardService(
  SoundboardItemServiceProvider.get(),
  voiceService,
);
