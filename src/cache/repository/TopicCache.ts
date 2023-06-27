import { getJson, setJson } from '../query';
import { Types } from 'mongoose';
import Topic from '../../database/model/Topics';
import { DynamicKey, getDynamicKey } from '../keys';
import { caching } from '../../config';
import { addMillisToCurrentDate } from '../../helpers/utils';

function getKeyForId(topicId: Types.ObjectId) {
  return getDynamicKey(DynamicKey.TOPIC, topicId.toHexString());
}

function getKeyForUrl(topicUrl: string) {
  return getDynamicKey(DynamicKey.TOPIC, topicUrl);
}

async function save(topic: Topic) {
  return setJson(
    getKeyForId(topic._id),
    { ...topic },
    addMillisToCurrentDate(caching.contentCacheDuration),
  );
}

async function fetchById(blogId: Types.ObjectId) {
  return getJson<Topic>(getKeyForId(blogId));
}

async function fetchByUrl(topicUrl: string) {
  return getJson<Topic>(getKeyForUrl(topicUrl));
}

export default {
  save,
  fetchById,
  fetchByUrl,
};
