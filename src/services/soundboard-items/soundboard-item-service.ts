import { Optional } from "../../model/optional/optional";
import { UUID } from "../../model/uuid/uuid";
import { SoundboardItem } from "./soundboard-item";

export interface SoundboardItemService {
  getItems(): Promise<SoundboardItem[]>;
  getItem(id: UUID): Promise<Optional<SoundboardItem>>;
}
