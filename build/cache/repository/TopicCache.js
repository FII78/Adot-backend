"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = require("../query");
const keys_1 = require("../keys");
const config_1 = require("../../config");
const utils_1 = require("../../helpers/utils");
function getKeyForId(topicId) {
    return (0, keys_1.getDynamicKey)(keys_1.DynamicKey.TOPIC, topicId.toHexString());
}
function getKeyForUrl(topicUrl) {
    return (0, keys_1.getDynamicKey)(keys_1.DynamicKey.TOPIC, topicUrl);
}
async function save(topic) {
    return (0, query_1.setJson)(getKeyForId(topic._id), { ...topic }, (0, utils_1.addMillisToCurrentDate)(config_1.caching.contentCacheDuration));
}
async function fetchById(blogId) {
    return (0, query_1.getJson)(getKeyForId(blogId));
}
async function fetchByUrl(topicUrl) {
    return (0, query_1.getJson)(getKeyForUrl(topicUrl));
}
exports.default = {
    save,
    fetchById,
    fetchByUrl,
};
//# sourceMappingURL=TopicCache.js.map