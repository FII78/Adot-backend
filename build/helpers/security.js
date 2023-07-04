"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictIpAddress = void 0;
const ApiError_1 = require("../core/ApiError");
const utils_1 = require("./utils");
function restrictIpAddress(req, ipAddress) {
    if (ipAddress === '*')
        return;
    const ip = (0, utils_1.findIpAddress)(req);
    if (!ip)
        throw new ApiError_1.ForbiddenError('IP Address Not Recognised');
    if (ipAddress !== ip)
        throw new ApiError_1.ForbiddenError('Permission Denied');
}
exports.restrictIpAddress = restrictIpAddress;
//# sourceMappingURL=security.js.map