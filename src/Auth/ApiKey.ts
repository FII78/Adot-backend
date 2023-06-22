import express from 'express';
import ApiKeyRepo from '../database/Repository/ApiKeyRepo';
import { ForbiddenError } from '../core/ApiError';
import Logger from '../core/logger';
import { PublicRequest } from 'app-request';
import schema from './schema';
import validator, { ValidationSource } from '../helpers/validator';
import asyncHandler from '../helpers/asyncHandler';
import { Header } from '../core/utils';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

export default router.use(
  validator(schema.apiKey, ValidationSource.HEADER),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const publicRequest = req as PublicRequest;

    const key = publicRequest.headers[Header.API_KEY]?.toString();
    if (!key) throw new ForbiddenError();

    const apiKey = await ApiKeyRepo.findByKey(key);
    if (!apiKey) throw new ForbiddenError();
    Logger.info(apiKey);

    publicRequest.apiKey = apiKey;
    return next();
  }),
);
