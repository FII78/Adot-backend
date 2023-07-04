"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    secrets: {
        jwt: 'digitallibraryprod'
    },
    dbUrl: process.env.MONGODB_URL_PROD ||
        'mongodb://localhost:27017/adot-prod'
};
//# sourceMappingURL=prod.js.map