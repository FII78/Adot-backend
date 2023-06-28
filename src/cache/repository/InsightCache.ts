import Insight from '../../database/model/Insight';
import { DynamicKey, getDynamicKey } from '../keys';
import { addMillisToCurrentDate } from '../../helpers/utils';
import { caching } from '../../config';
import { Types } from 'mongoose';
import { getJson, setJson } from '../query';
import { getListRange, setList } from '../query';


function getKeyForId(insightId: Types.ObjectId) {
    return getDynamicKey(DynamicKey.BLOG, insightId.toHexString());
  }
  
  function getKeyForUrl(insightUrl: string) {
    return getDynamicKey(DynamicKey.INSIGHT, insightUrl);
  }
  
  async function save(insight: Insight) {
    return setJson(
      getKeyForId(insight._id),
      { ...insight },
      addMillisToCurrentDate(caching.contentCacheDuration),
    );
  }
  
  async function fetchById(insightId: Types.ObjectId) {
    return getJson<Insight>(getKeyForId(insightId));
  }
  
  async function fetchByUrl(insightUrl: string) {
    return getJson<Insight>(getKeyForUrl(insightUrl));
  }
  
function getKeyForSimilar(insightId: Types.ObjectId) {
  return getDynamicKey(DynamicKey.INSIGHTS_SIMILAR, insightId.toHexString());
}

async function saveSimilarInsights(insightId: Types.ObjectId, insights: Insight[]) {
  return setList(
    getKeyForSimilar(insightId),
    insights,
    addMillisToCurrentDate(caching.contentCacheDuration),
  );
}

async function fetchSimilarInsights(insightId: Types.ObjectId) {
  return getListRange<Insight>(getKeyForSimilar(insightId));
}

export default {
    save,
    fetchById,
    fetchByUrl,
    saveSimilarInsights,
    fetchSimilarInsights,
};
