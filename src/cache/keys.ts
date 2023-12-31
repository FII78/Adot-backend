export enum Key {
  INSIGHT_LATEST = 'INSIGHT_LATEST',
}

export enum DynamicKey {
  TOPICS_SIMILAR = 'BLOGS_SIMILAR',
  TOPIC = 'TOPIC',
}
export enum DynamicKey {
  INSIGHTS_SIMILAR = 'INSIGHTS_SIMILAR',
  INSIGHT = 'INSIGHT',
}
export type DynamicKeyType = `${DynamicKey}_${string}`;

export function getDynamicKey(key: DynamicKey, suffix: string) {
  const dynamic: DynamicKeyType = `${key}_${suffix}`;
  return dynamic;
}
