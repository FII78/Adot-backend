export enum Key {
  BLOGS_LATEST = 'BLOGS_LATEST',
}

export enum DynamicKey {
  BLOGS_SIMILAR = 'BLOGS_SIMILAR',
  BLOG = 'BLOG',
}
export enum DynamicKey {
  TOPICS_SIMILAR = 'BLOGS_SIMILAR',
  TOPIC = 'TOPIC',
}

export type DynamicKeyType = `${DynamicKey}_${string}`;

export function getDynamicKey(key: DynamicKey, suffix: string) {
  const dynamic: DynamicKeyType = `${key}_${suffix}`;
  return dynamic;
}
