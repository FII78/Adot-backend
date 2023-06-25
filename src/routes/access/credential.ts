import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import { RoleRequest } from 'app-request';
import UserRepo from '../../database/repository/UserRepo';
import { BadRequestError } from '../../core/ApiError';
import User from '../../database/model/User';
import validator from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import _ from 'lodash';
import authentication from '../../auth/authentication';
import KeystoreRepo from '../../database/repository/KeystoreRepo';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
const router = express.Router();

//----------------------------------------------------------------
// router.use(authentication, role(RoleCode.ADMIN), authorization);
//----------------------------------------------------------------

router.post(
  '/user/assign',
  validator(schema.credential),
  asyncHandler(async (req: RoleRequest, res) => {
    const user = await UserRepo.findByEmail(req.body.email);
    if (!user) throw new BadRequestError('User do not exists');
    const scryptAsync = promisify(scrypt);

    const salt = randomBytes(16).toString('hex');
    const passwordBuffer = Buffer.from(req.body.password, 'utf8');
    const derivedKey = await scryptAsync(passwordBuffer, salt, 64) as Buffer;

    const passwordHash = derivedKey.toString('hex');
    await UserRepo.updateInfo({
      _id: user._id,
      password: passwordHash,
    } as User);

    await KeystoreRepo.removeAllForClient(user);

    new SuccessResponse(
      'User password updated',
      _.pick(user, ['_id', 'name', 'email']),
    ).send(res);
  }),
);

export default router;