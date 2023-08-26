import { Optional } from "../../utils/optional";
import { UUID } from "../../utils/uuid";
import { SoundboardItem } from "./soundboard-item";

export interface SoundboardItemService {
  getItems(): Promise<SoundboardItem[]>;
  getItem(id: UUID): Promise<Optional<SoundboardItem>>;
  saveItem(id: UUID, name: string, icon: string): Promise<void>;
}
