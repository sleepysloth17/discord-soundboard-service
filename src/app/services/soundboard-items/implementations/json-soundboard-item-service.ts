import * as fs from "fs";
import { join } from "node:path";
import { Optional } from "../../../utils/optional";
import { UUID } from "../../../utils/uuid";
import {
  SoundboardItem,
  deserialiseSoundboardItems,
  serialiseSoundboardItems,
} from "../soundboard-item";
import { SoundboardItemService } from "../soundboard-item-service";

export class JsonSoundboardItemService implements SoundboardItemService {
  private static readonly JSON_LOCATION: string = join(
    __dirname,
    "../../../../assets/sound-database.json",
  );

  private items: Record<string, SoundboardItem> = {};

  constructor() {
    this.loadJsonMap().then(
      (itemMap: Record<string, SoundboardItem>) => (this.items = itemMap),
    );
  }

  private loadJsonMap(): Promise<Record<string, SoundboardItem>> {
    return this.loadItemsFromJSON().then((items: SoundboardItem[]) => {
      console.log(`Loading ${items.length} items`);
      return items.reduce(
        (map: Record<string, SoundboardItem>, current: SoundboardItem) => {
          // console.log(current);
          map[current.id.value] = current;
          return map;
        },
        {},
      );
    });
  }

  private loadItemsFromJSON(): Promise<SoundboardItem[]> {
    return new Promise((resolve, reject) => {
      fs.readFile(
        JsonSoundboardItemService.JSON_LOCATION,
        { encoding: "utf-8" },
        (err, data) => {
          if (err) {
            console.log("ERR reading json file");
            reject([]);
          } else {
            resolve(deserialiseSoundboardItems(JSON.parse(data)));
          }
        },
      );
    });
  }

  public getItem(id: UUID): Promise<Optional<SoundboardItem>> {
    return Promise.resolve(Optional.of(this.items[id.value]));
  }

  public getItems(): Promise<SoundboardItem[]> {
    return Promise.resolve(Object.values(this.items)); // TODO
  }

  public saveItem(id: UUID, name: string, icon: string): Promise<void> {
    console.log(`Saving item with ${id}, ${name}, ${icon}`);
    return this.updateAndReloadJson(id, name, icon).then(() => {
      this.loadJsonMap().then(
        (itemMap: Record<string, SoundboardItem>) => (this.items = itemMap),
      );
    });
  }

  private updateAndReloadJson(
    id: UUID,
    name: string,
    icon: string,
  ): Promise<void> {
    return this.loadItemsFromJSON().then((values: SoundboardItem[]) => {
      values.push({
        id,
        icon,
        name,
        path: `http://localhost:3000/assets/${id.value}.mp3`,
      });
      return new Promise((resolve, reject) => {
        fs.writeFile(
          JsonSoundboardItemService.JSON_LOCATION,
          JSON.stringify(serialiseSoundboardItems(values)),
          (err) => {
            if (err) {
              console.log("ERR writing json file");
              reject();
            } else {
              resolve();
            }
          },
        );
      });
    });
  }
}
