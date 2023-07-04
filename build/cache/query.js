"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expireMany = exports.expire = exports.unwatch = exports.watch = exports.getOrderedSetMemberScore = exports.getOrderedSetRange = exports.removeFromOrderedSet = exports.addToOrderedSet = exports.setOrderedSet = exports.getListRange = exports.addToList = exports.setList = exports.getJson = exports.setJson = exports.delByKey = exports.getValue = exports.setValue = exports.keyExists = exports.TYPES = void 0;
const _1 = __importDefault(require("."));
var TYPES;
(function (TYPES) {
    TYPES["LIST"] = "list";
    TYPES["STRING"] = "string";
    TYPES["HASH"] = "hash";
    TYPES["ZSET"] = "zset";
    TYPES["SET"] = "set";
})(TYPES = exports.TYPES || (exports.TYPES = {}));
async function keyExists(...keys) {
    return (await _1.default.exists(keys)) ? true : false;
}
exports.keyExists = keyExists;
async function setValue(key, value, expireAt = null) {
    if (expireAt)
        return _1.default.pSetEx(key, expireAt.getTime(), `${value}`);
    else
        return _1.default.set(key, `${value}`);
}
exports.setValue = setValue;
async function getValue(key) {
    return _1.default.get(key);
}
exports.getValue = getValue;
async function delByKey(key) {
    return _1.default.del(key);
}
exports.delByKey = delByKey;
async function setJson(key, value, expireAt = null) {
    const json = JSON.stringify(value);
    return await setValue(key, json, expireAt);
}
exports.setJson = setJson;
async function getJson(key) {
    const type = await _1.default.type(key);
    if (type !== TYPES.STRING)
        return null;
    const json = await getValue(key);
    if (json)
        return JSON.parse(json);
    return null;
}
exports.getJson = getJson;
async function setList(key, list, expireAt = null) {
    const multi = _1.default.multi();
    const values = [];
    for (const i in list) {
        values[i] = JSON.stringify(list[i]);
    }
    multi.del(key);
    multi.rPush(key, values);
    if (expireAt)
        multi.pExpireAt(key, expireAt.getTime());
    return await multi.exec();
}
exports.setList = setList;
async function addToList(key, value) {
    const type = await _1.default.type(key);
    if (type !== TYPES.LIST)
        return null;
    const item = JSON.stringify(value);
    return await _1.default.rPushX(key, item);
}
exports.addToList = addToList;
async function getListRange(key, start = 0, end = -1) {
    const type = await _1.default.type(key);
    if (type !== TYPES.LIST)
        return null;
    const list = await _1.default.lRange(key, start, end);
    if (!list)
        return null;
    const data = list.map((entry) => JSON.parse(entry));
    return data;
}
exports.getListRange = getListRange;
async function setOrderedSet(key, items, expireAt = null) {
    const multi = _1.default.multi();
    for (const item of items) {
        item.value = JSON.stringify(item.value);
    }
    multi.del(key);
    multi.zAdd(key, items);
    if (expireAt)
        multi.pExpireAt(key, expireAt.getTime());
    return await multi.exec();
}
exports.setOrderedSet = setOrderedSet;
async function addToOrderedSet(key, items) {
    const type = await _1.default.type(key);
    if (type !== TYPES.ZSET)
        return null;
    for (const item of items) {
        item.value = JSON.stringify(item.value);
    }
    return await _1.default.zAdd(key, items);
}
exports.addToOrderedSet = addToOrderedSet;
async function removeFromOrderedSet(key, ...items) {
    const type = await _1.default.type(key);
    if (type !== TYPES.ZSET)
        return null;
    items = items.map((item) => JSON.stringify(item));
    return await _1.default.zRem(key, items);
}
exports.removeFromOrderedSet = removeFromOrderedSet;
async function getOrderedSetRange(key, start = 0, end = -1) {
    const type = await _1.default.type(key);
    if (type !== TYPES.ZSET)
        return null;
    const set = await _1.default.zRangeWithScores(key, start, end);
    const data = set.map((entry) => ({
        score: entry.score,
        value: JSON.parse(entry.value),
    }));
    return data;
}
exports.getOrderedSetRange = getOrderedSetRange;
async function getOrderedSetMemberScore(key, member) {
    const type = await _1.default.type(key);
    if (type !== TYPES.ZSET)
        return null;
    return await _1.default.zScore(key, JSON.stringify(member));
}
exports.getOrderedSetMemberScore = getOrderedSetMemberScore;
async function watch(key) {
    return await _1.default.watch(key);
}
exports.watch = watch;
async function unwatch() {
    return await _1.default.unwatch();
}
exports.unwatch = unwatch;
async function expire(expireAt, key) {
    return await _1.default.pExpireAt(key, expireAt.getTime());
}
exports.expire = expire;
async function expireMany(expireAt, ...keys) {
    let script = '';
    for (const key of keys) {
        script += `redis.call('pExpireAt', '${key}',${expireAt.getTime()})`;
    }
    return await _1.default.eval(script);
}
exports.expireMany = expireMany;
//# sourceMappingURL=query.js.map