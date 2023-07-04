"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const keys_1 = require("../keys");
const utils_1 = require("../../helpers/utils");
const config_1 = require("../../config");
const query_1 = require("../query");
const query_2 = require("../query");
function getKeyForId(insightId) {
    return (0, keys_1.getDynamicKey)(keys_1.DynamicKey.INSIGHT, insightId.toHexString());
}
function getKeyForUrl(insightUrl) {
    return (0, keys_1.getDynamicKey)(keys_1.DynamicKey.INSIGHT, insightUrl);
}
async function save(insight) {
    return (0, query_1.setJson)(getKeyForId(insight._id), { ...insight }, (0, utils_1.addMillisToCurrentDate)(config_1.caching.contentCacheDuration));
}
async function fetchById(insightId) {
    return (0, query_1.getJson)(getKeyForId(insightId));
}
async function fetchByUrl(insightUrl) {
    return (0, query_1.getJson)(getKeyForUrl(insightUrl));
}
function getKeyForSimilar(insightId) {
    return (0, keys_1.getDynamicKey)(keys_1.DynamicKey.INSIGHTS_SIMILAR, insightId.toHexString());
}
async function saveSimilarInsights(insightId, insights) {
    return (0, query_2.setList)(getKeyForSimilar(insightId), insights, (0, utils_1.addMillisToCurrentDate)(config_1.caching.contentCacheDuration));
}
async function fetchSimilarInsights(insightId) {
    return (0, query_2.getListRange)(getKeyForSimilar(insightId));
}
exports.default = {
    save,
    fetchById,
    fetchByUrl,
    saveSimilarInsights,
    fetchSimilarInsights,
};
//# sourceMappingURL=InsightCache.js.map