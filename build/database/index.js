"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config"));
const logger_1 = __importDefault(require("../core/logger"));
const config_2 = require("../config");
const dbURI = config_1.default.dbUrl;
const option = {
    autoIndex: true,
    minPoolSize: config_2.db.minPoolSize,
    maxPoolSize: config_2.db.maxPoolSize,
    connectTimeoutMS: 60000,
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};
logger_1.default.debug(dbURI);
function setRunValidators() {
    this.setOptions({ runValidators: true });
}
mongoose_1.default.set('strictQuery', true);
// Create the database connection
mongoose_1.default
    .plugin((schema) => {
    schema.pre('findOneAndUpdate', setRunValidators);
    schema.pre('updateMany', setRunValidators);
    schema.pre('updateOne', setRunValidators);
    schema.pre('update', setRunValidators);
})
    .connect(dbURI, option)
    .then(() => {
    logger_1.default.info('Mongoose connection done');
})
    .catch((e) => {
    logger_1.default.info('Mongoose connection error');
    logger_1.default.error(e);
});
// CONNECTION EVENTS
// When successfully connected
mongoose_1.default.connection.on('connected', () => {
    logger_1.default.debug('Mongoose default connection open to ' + dbURI);
});
// If the connection throws an error
mongoose_1.default.connection.on('error', (err) => {
    logger_1.default.error('Mongoose default connection error: ' + err);
});
// When the connection is disconnected
mongoose_1.default.connection.on('disconnected', () => {
    logger_1.default.info('Mongoose default connection disconnected');
});
// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
    mongoose_1.default.connection.close(() => {
        logger_1.default.info('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});
exports.connection = mongoose_1.default.connection;
//# sourceMappingURL=index.js.map