import { join } from "node:path";
import { SoundboardItem } from "../components/soundboard-item";
import { Optional } from "../model/optional/optional";
import { UUID } from "../model/uuid/uuid";

export class SoundboardItemService {
  private static readonly mockItem: SoundboardItem = {
    id: UUID.of("16161c71-3f5b-40e9-896e-fdaad4f83ee9").get(),
    icon: "📯",
    name: "Curb your enthusiasm",
    path: join(__dirname, "curb.mp3"),
  };

  public getItem(id: UUID): Promise<Optional<SoundboardItem>> {
    console.log(`Request for ${id.value}`);
    return Promise.resolve(Optional.of(SoundboardItemService.mockItem));
  }

  public getItems(): Promise<SoundboardItem[]> {
    return Promise.resolve([SoundboardItemService.mockItem]); // TODO
  }
}

export default new SoundboardItemService();
