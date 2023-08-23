import { UUID } from "../model/uuid/uuid";

export interface SoundboardItem {
  id: UUID;
  icon: string;
  name: string;
  path: string;
}

export const deserialiseSoundboardItems: (json: unknown) => SoundboardItem[] = (
  json: unknown,
) => {
  if (json instanceof Array) {
    return json.map((item) => ({
      id: UUID.of(item.id).get(),
      icon: item.icon,
      name: item.name,
      path: item.path,
    }));
  }
  throw new Error("Cannot parse json to soundboard items");
};

export const serialiseSoundboardItems: (items: SoundboardItem[]) => object = (
  items: SoundboardItem[],
) => {
  return items.map(serialiseSoundboardItem);
};

export const serialiseSoundboardItem: (item: SoundboardItem) => object = (
  item: SoundboardItem,
) => {
  return {
    id: item.id.value,
    icon: item.icon,
    name: item.name,
    path: item.path,
  };
};
