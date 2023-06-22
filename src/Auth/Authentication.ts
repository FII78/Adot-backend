import express from 'express';
import { ProtectedRequest } from 'app-request';
import UserRepo from '../database/Repository/UserRepo';
import {
  AuthFailureError,
  AccessTokenError,
  TokenExpiredError,
} from '../core/ApiError';
import JWT from '../core/JWT';
import KeystoreRepo from '../database/Repository/KeystoreRepo';
import { Types } from 'mongoose';
import { getAccessToken, validateTokenData } from './AuthUtils';
import validator, { ValidationSource } from '../helpers/validator';
import schema from './schema';
import asyncHandler from '../helpers/asyncHandler';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

export default router.use(
  validator(schema.auth, ValidationSource.HEADER),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const protectedRequest = req as ProtectedRequest;

    protectedRequest.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase

    try {
      const payload = await JWT.validate(protectedRequest.accessToken);
      validateTokenData(payload);

      const user = await UserRepo.findById(new Types.ObjectId(payload.sub));
      if (!user) throw new AuthFailureError('User not registered');
      protectedRequest.user = user;

      const keystore = await KeystoreRepo.findforKey(protectedRequest.user, payload.prm);
      if (!keystore) throw new AuthFailureError('Invalid access token');
      protectedRequest.keystore = keystore;

      return next();
    } catch (e) {
      if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
      throw e;
    }
  }),
);
