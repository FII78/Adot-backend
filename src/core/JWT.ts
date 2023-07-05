import path from 'path';
import { readFile } from 'fs';
import { promisify } from 'util';
import { sign, verify, Secret, SignOptions, VerifyOptions } from 'jsonwebtoken';
import { InternalError, BadTokenError, TokenExpiredError } from './ApiError';
import Logger from './logger';
/*
 * issuer     — Software organization who issues the token.
 * subject    — Intended user of the token.
 * audience   — Basically identity of the intended recipient of the token.
 * expiresIn  — Expiration time after which the token will be invalid.
 * algorithm  — Encryption algorithm to be used to protect the token.
 */
export class JwtPayload {
  aud: string;
  sub: string;
  iss: string;
  iat: number;
  exp: number;
  prm: string;
  constructor(
    issuer: string,
    audience: string,
    subject: string,
    param: string,
    validity: number,
  ) {
    this.iss = issuer;
    this.aud = audience;
    this.sub = subject;
    this.iat = Math.floor(Date.now() / 1000);
    this.exp = this.iat + validity;
    this.prm = param;
  }
}
async function readPublicKey(): Promise<string> {
  // Read public key from environment variable PUBLIC_KEY
  const publicKey = process.env.PUBLIC_KEY;
  if (!publicKey) {
    throw new Error('PUBLIC_KEY environment variable is not set');
  }
  return publicKey;
}
async function readPrivateKey(): Promise<string> {
  // Read private key from environment variable PRIVATE_KEY
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('PRIVATE_KEY environment variable is not set');
  }
  return privateKey;
}
async function encode(payload: JwtPayload): Promise<string> {
  const privateKey = await readPrivateKey();
  if (!privateKey) throw new InternalError('Token generation failure');
  const signOptions: SignOptions = { algorithm: 'RS256' };
  const secret: Secret = privateKey;
  return new Promise((resolve, reject) => {
    sign({ ...payload }, secret, signOptions, (error, encoded) => {
      if (error) {
        reject(error);
      } else {
        resolve(encoded as string);
      }
    });
  });
}
/**
 * This method checks the token and returns the decoded data when the token is valid in all respects
 */
async function validate(token: string): Promise<JwtPayload> {
  const publicKey = await readPublicKey();
  const verifyOptions: VerifyOptions = {};
  const secretOrPublicKey: Secret | Secret[] = publicKey;
  return new Promise((resolve, reject) => {
    verify(token, secretOrPublicKey, verifyOptions, (error, decoded) => {
      if (error) {
        Logger.debug(error);
        if (error.name === 'TokenExpiredError') {
          reject(new TokenExpiredError());
        } else {
          reject(new BadTokenError());
        }
      } else {
        resolve(decoded as JwtPayload);
      }
    });
  });
}
/**
 * Returns the decoded payload if the signature is valid even if it is expired
 */
async function decode(token: string): Promise<JwtPayload> {
  const publicKey = await readPublicKey();
  const verifyOptions: VerifyOptions = { ignoreExpiration: true };
  const secretOrPublicKey: Secret | Secret[] = publicKey;
  return new Promise((resolve, reject) => {
    verify(token, secretOrPublicKey, verifyOptions, (error, decoded) => {
      if (error) {
        Logger.debug(error);
        reject(new BadTokenError());
      } else {
        resolve(decoded as JwtPayload);
      }
    });
  });
}
export default {
  encode,
  validate,
  decode,
};