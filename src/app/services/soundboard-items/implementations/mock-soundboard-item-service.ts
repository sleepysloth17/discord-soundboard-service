import { Optional } from "../../../utils/optional";
import { UUID } from "../../../utils/uuid";
import { SoundboardItem } from "../soundboard-item";
import { SoundboardItemService } from "../soundboard-item-service";

export class MockSoundboardItemService implements SoundboardItemService {
  private static readonly mockItem: SoundboardItem = {
    id: UUID.of("16161c71-3f5b-40e9-896e-fdaad4f83ee9").get(),
    icon: "📯",
    name: "Curb your enthusiasm",
    path: "http://localhost:3000/assets/curb.mp3",
  };

  public getItem(id: UUID): Promise<Optional<SoundboardItem>> {
    console.log(`Request for ${id.value}`);
    return Promise.resolve(Optional.of(MockSoundboardItemService.mockItem));
  }

  public getItems(): Promise<SoundboardItem[]> {
    return Promise.resolve([MockSoundboardItemService.mockItem]); // TODO
  }

  public saveItem(id: UUID, name: string, icon: string): Promise<void> {
    console.log(`Saved mocked saving to db: ${id.value}, ${name}, ${icon}`);
    return Promise.resolve();
  }
}
