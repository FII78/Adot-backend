import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import UserRepo from '../../database/repository/UserRepo';
import { ProtectedRequest } from 'app-request';
import { BadRequestError } from '../../core/ApiError';
import validator from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import _ from 'lodash';
import authentication from '../../auth/authentication';

const router = express.Router();

/*-------------------------------------------------------------------------*/
router.use(authentication);
/*-------------------------------------------------------------------------*/

router.get(
  '/my',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findPrivateProfileById(req.user._id);
    if (!user) throw new BadRequestError('User not registered');

    return new SuccessResponse(
      'success',
      _.pick(user, ['firstName', 'lastName','phone','email','phone', 'profilePic', 'role']),
    ).send(res);
  }),
);

router.put(
  '/',
  validator(schema.profile),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findPrivateProfileById(req.user._id);
    if (!user) throw new BadRequestError('User not registered');

    if (req.body.name) user.firstName = req.body.firstName;
    if (req.body.profilePicUrl) user.profilePic = req.body.profilePic;

    await UserRepo.updateInfo(user);

    const data = _.pick(user, ['firstName','lastName', 'profilePic']);

    return new SuccessResponse('Profile updated', data).send(res);
  }),
);

export default router;
