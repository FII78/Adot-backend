"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDynamicKey = exports.DynamicKey = exports.Key = void 0;
var Key;
(function (Key) {
    Key["INSIGHT_LATEST"] = "INSIGHT_LATEST";
})(Key = exports.Key || (exports.Key = {}));
var DynamicKey;
(function (DynamicKey) {
    DynamicKey["TOPICS_SIMILAR"] = "BLOGS_SIMILAR";
    DynamicKey["TOPIC"] = "TOPIC";
})(DynamicKey = exports.DynamicKey || (exports.DynamicKey = {}));
(function (DynamicKey) {
    DynamicKey["INSIGHTS_SIMILAR"] = "INSIGHTS_SIMILAR";
    DynamicKey["INSIGHT"] = "INSIGHT";
})(DynamicKey = exports.DynamicKey || (exports.DynamicKey = {}));
function getDynamicKey(key, suffix) {
    const dynamic = `${key}_${suffix}`;
    return dynamic;
}
exports.getDynamicKey = getDynamicKey;
//# sourceMappingURL=keys.js.map