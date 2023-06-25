import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import { RoleRequest } from 'app-request';
import crypto from 'crypto';
import UserRepo from '../../database/repository/UserRepo';
import { BadRequestError } from '../../core/ApiError';
import User from '../../database/model/User';
import { createTokens } from '../../auth/authUtils';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import { RoleCode } from '../../database/model/Role';
import { getUserData } from './utils';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

const router = express.Router();

router.post(
  '/basic',
  validator(schema.signup),
  asyncHandler(async (req: RoleRequest, res) => {
    const user = await UserRepo.findByEmail(req.body.email);
    if (user) throw new BadRequestError('User already registered');

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    const salt = randomBytes(16).toString('hex');
    const passwordBuffer = Buffer.from(req.body.password, 'utf8');
    const derivedKey = await scryptAsync(passwordBuffer, Buffer.from(salt, 'hex'), 64) as Buffer;

    const passwordHash = derivedKey.toString('hex');

    const { user: createdUser, keystore } = await UserRepo.create(
      {
        name: req.body.name,
        email: req.body.email,
        profilePicUrl: req.body.profilePicUrl,
        password: passwordHash,
        salt: salt,
      } as User,
      accessTokenKey,
      refreshTokenKey,
      RoleCode.LEARNER,
    );
    const tokens = await createTokens(
      createdUser,
      keystore.primaryKey,
      keystore.secondaryKey,
    );
    const userData = await getUserData(createdUser);

    new SuccessResponse('Signup Successful', {
      user: userData,
      tokens: tokens,
    }).send(res);
  }),
);

export default router;
