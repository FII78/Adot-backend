import express from 'express';
import { ProtectedRequest } from 'app-request';
import { AuthFailureError } from '../core/ApiError';
import RoleRepo from '../database/repository/RoleRepo';
import asyncHandler from '../helpers/asyncHandler';

const router = express.Router();

export default router.use(
  asyncHandler(async (req: ProtectedRequest, res, next) => {
    if (!req.user || !req.user.roles || !req.currentRoleCodes)
      throw new AuthFailureError('Permission denied');

    return next();
  }),
);
