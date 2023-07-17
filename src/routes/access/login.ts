import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import crypto from 'crypto';
import { scrypt, timingSafeEqual } from 'crypto';
import UserRepo from '../../database/repository/UserRepo';
import { BadRequestError, AuthFailureError } from '../../core/ApiError';
import KeystoreRepo from '../../database/repository/KeystoreRepo';
import { createTokens } from '../../auth/authUtils';
import validator from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import { getUserData } from './utils';
import { PublicRequest } from '../../types/app-request';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);
const router = express.Router();

router.post(
  '/basic',
  validator(schema.credential),
  asyncHandler(async (req: PublicRequest, res) => {
    const user = await UserRepo.findByPhone(req.body.phone);
    if (!user) throw new BadRequestError('User not registered');
    if (!user.password) throw new BadRequestError('Credential not set');
    if (!user.isVerified) throw new BadRequestError('User not verified');

    const match = await comparePasswords(req.body.password, user.password, user.salt || '');
    if (!match) throw new AuthFailureError('Authentication failure');

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    await KeystoreRepo.create(user, accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);
    const userData = await getUserData(user);
    
    new SuccessResponse('Login Success', {
      user: userData,
      tokens: tokens,
      profile: user
    }).send(res);
  }),
);

async function comparePasswords(inputPassword: string, storedPassword: string, salt: string): Promise<boolean> {
  const inputPasswordBuffer = Buffer.from(inputPassword, 'utf8');
  const storedPasswordBuffer = Buffer.from(storedPassword, 'hex');
  const derivedKey = await scryptAsync(inputPasswordBuffer, Buffer.from(salt, 'hex'), 64) as Buffer;

  return timingSafeEqual(derivedKey, storedPasswordBuffer);
}

export default router;
