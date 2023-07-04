"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    secrets: {
        jwt: 'digitallibrarydev'
    },
    dbUrl: process.env.MONGODB_URL_DEV ||
        process.env.MONGODB_URL ||
        'mongodb://localhost:27017/adot-dev'
};
//# sourceMappingURL=dev.js.map