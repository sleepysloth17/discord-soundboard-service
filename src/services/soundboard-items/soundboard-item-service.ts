import { SoundboardItem } from "../../components/soundboard-item";
import { Optional } from "../../model/optional/optional";
import { UUID } from "../../model/uuid/uuid";

export interface SoundboardItemService {
  getItems(): Promise<SoundboardItem[]>;
  getItem(id: UUID): Promise<Optional<SoundboardItem>>;
}
