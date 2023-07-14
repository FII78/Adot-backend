import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import UserRepo from '../../database/repository/UserRepo';
import { ProtectedRequest } from 'app-request';
import { BadRequestError, NotFoundError } from '../../core/ApiError';
import validator from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import _ from 'lodash';
import authorization from '../../auth/authorization';
import { ObjectId } from 'mongodb';

const router = express.Router();

/*-------------------------------------------------------------------------*/
router.use(authorization);
/*-------------------------------------------------------------------------*/

router.get(
  '/my',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findPrivateProfileById(req.user._id);
    if (!user) throw new BadRequestError('User not registered');

    return new SuccessResponse(
      'success',
      _.pick(user, ['firstName', 'lastName','phone','email', 'profilePic', 'role','savedInsights','stage','title','bio']),
    ).send(res);
  }),
);

router.put(
  '/',
  validator(schema.profile),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findPrivateProfileById(req.user._id);
    if (!user) throw new BadRequestError('User not registered');

    if (req.body.firstName) user.firstName = req.body.firstName;
    if (req.body.lastName) user.lastName = req.body.lastName;
    if (req.body.bio) user.bio = req.body.bio;
    if (req.body.stage) user.stage = req.body.stage;
    if (req.body.title) user.title = req.body.title;
    if (req.body.profilePicUrl) user.profilePic = req.body.profilePic;

    if (req.body.savedInsightId) {
      user.savedInsights.push(req.body.savedInsightId);
    }

    await UserRepo.updateInfo(user);

    const data = _.pick(user, ['firstName', 'lastName', 'profilePic','savedInsights']);

    return new SuccessResponse('Profile updated', data).send(res);
  }),
);

router.delete(
  '/savedInsight/:insightId',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findPrivateProfileById(req.user._id);
    if (!user) throw new BadRequestError('User not registered');
 
    const insightId = req.params.insightId;
    
    const objectId = new ObjectId(insightId);

    const index = user.savedInsights.findIndex((id) => id.equals(objectId));

    if (index === -1) {
      throw new NotFoundError('Insight not found in user\'s saved insights');
    }

    user.savedInsights.splice(index, 1);

    await UserRepo.updateInfo(user);
    const data = _.pick(user, ['firstName', 'lastName', 'profilePic', 'savedInsights']);
    return new SuccessResponse('Insight removed from saved insights', data).send(res);
  }),
);


export default router;
