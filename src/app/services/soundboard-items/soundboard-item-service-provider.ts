import environment from "../../../environment";
import { JsonSoundboardItemService } from "./implementations/json-soundboard-item-service";
import { MockSoundboardItemService } from "./implementations/mock-soundboard-item-service";
import { SoundboardItemService } from "./soundboard-item-service";

enum SoundboardItemSource {
  MOCK = "MOCK",
  JSON = "JSON",
}

export class SoundboardItemServiceProvider {
  private static readonly SOURCE =
    SoundboardItemSource[environment.soundboardItemSource];

  public static get(): SoundboardItemService {
    switch (SoundboardItemServiceProvider.SOURCE) {
      case SoundboardItemSource.MOCK: {
        return new MockSoundboardItemService();
      }
      case SoundboardItemSource.JSON: {
        return new JsonSoundboardItemService();
      }
    }
    throw new Error(`Unknown item source`);
  }

  private constructor() {}
}
