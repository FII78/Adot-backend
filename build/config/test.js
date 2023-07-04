"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    secrets: {
        jwt: 'digitallibrarytest'
    },
    dbUrl: process.env.MONGODB_URL_TEST ||
        'mongodb://localhost:27017/adot-test'
};
//# sourceMappingURL=test.js.map