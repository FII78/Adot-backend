"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMillisToCurrentDate = exports.findIpAddress = void 0;
const moment_1 = __importDefault(require("moment"));
const logger_1 = __importDefault(require("../core/logger"));
function findIpAddress(req) {
    try {
        if (req.headers['x-forwarded-for']) {
            return req.headers['x-forwarded-for'].toString().split(',')[0];
        }
        else if (req.connection && req.connection.remoteAddress) {
            return req.connection.remoteAddress;
        }
        return req.ip;
    }
    catch (e) {
        logger_1.default.error(e);
        return undefined;
    }
}
exports.findIpAddress = findIpAddress;
function addMillisToCurrentDate(millis) {
    return (0, moment_1.default)().add(millis, 'ms').toDate();
}
exports.addMillisToCurrentDate = addMillisToCurrentDate;
//# sourceMappingURL=utils.js.map