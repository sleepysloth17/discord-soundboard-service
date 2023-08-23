import * as fs from "fs";
import { join } from "node:path";
import { Optional } from "../../../utils/optional";
import { UUID } from "../../../utils/uuid";
import { SoundboardItem, deserialiseSoundboardItems } from "../soundboard-item";
import { SoundboardItemService } from "../soundboard-item-service";

export class JsonSoundboardItemService implements SoundboardItemService {
  private static readonly JSON_LOCATION: string = join(
    __dirname,
    "../../../assets/sound-database.json",
  );

  private readonly items: Record<string, SoundboardItem> = {};

  constructor() {
    this.items = deserialiseSoundboardItems(
      JSON.parse(
        fs.readFileSync(JsonSoundboardItemService.JSON_LOCATION, "utf-8"),
      ),
    ).reduce((map: Record<string, SoundboardItem>, current: SoundboardItem) => {
      map[current.id.value] = current;
      return map;
    }, {});
  }

  public getItem(id: UUID): Promise<Optional<SoundboardItem>> {
    return Promise.resolve(Optional.of(this.items[id.value]));
  }

  public getItems(): Promise<SoundboardItem[]> {
    return Promise.resolve(Object.values(this.items)); // TODO
  }
}
