"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtPayload = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const util_1 = require("util");
const jsonwebtoken_1 = require("jsonwebtoken");
const ApiError_1 = require("./ApiError");
const logger_1 = __importDefault(require("./logger"));
/*
 * issuer 		— Software organization who issues the token.
 * subject 		— Intended user of the token.
 * audience 	— Basically identity of the intended recipient of the token.
 * expiresIn	— Expiration time after which the token will be invalid.
 * algorithm 	— Encryption algorithm to be used to protect the token.
 */
class JwtPayload {
    constructor(issuer, audience, subject, param, validity) {
        this.iss = issuer;
        this.aud = audience;
        this.sub = subject;
        this.iat = Math.floor(Date.now() / 1000);
        this.exp = this.iat + validity;
        this.prm = param;
    }
}
exports.JwtPayload = JwtPayload;
async function readPublicKey() {
    return (0, util_1.promisify)(fs_1.readFile)(path_1.default.join(__dirname, '../../keys/public.pem'), 'utf8');
}
async function readPrivateKey() {
    return (0, util_1.promisify)(fs_1.readFile)(path_1.default.join(__dirname, '../../keys/private.pem'), 'utf8');
}
async function encode(payload) {
    const cert = await readPrivateKey();
    if (!cert)
        throw new ApiError_1.InternalError('Token generation failure');
    // @ts-ignore
    return (0, util_1.promisify)(jsonwebtoken_1.sign)({ ...payload }, cert, { algorithm: 'RS256' });
}
/**
 * This method checks the token and returns the decoded data when token is valid in all respect
 */
async function validate(token) {
    const cert = await readPublicKey();
    try {
        // @ts-ignore
        return (await (0, util_1.promisify)(jsonwebtoken_1.verify)(token, cert));
    }
    catch (e) {
        logger_1.default.debug(e);
        if (e && e.name === 'TokenExpiredError')
            throw new ApiError_1.TokenExpiredError();
        // throws error if the token has not been encrypted by the private key
        throw new ApiError_1.BadTokenError();
    }
}
/**
 * Returns the decoded payload if the signature is valid even if it is expired
 */
async function decode(token) {
    const cert = await readPublicKey();
    try {
        // @ts-ignore
        return (await (0, util_1.promisify)(jsonwebtoken_1.verify)(token, cert, {
            ignoreExpiration: true,
        }));
    }
    catch (e) {
        logger_1.default.debug(e);
        throw new ApiError_1.BadTokenError();
    }
}
exports.default = {
    encode,
    validate,
    decode,
};
//# sourceMappingURL=JWT.js.map