import express, { Request, Response, NextFunction } from 'express';
import { ProtectedRequest } from 'app-request';
import { AuthFailureError } from '../core/ApiError';
import RoleRepo from '../database/Repository/RoleRepo';
import asyncHandler from '../helpers/asyncHandler';

const router = express.Router();

export default router.use(
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const protectedRequest = req as ProtectedRequest;

    if (!protectedRequest.user || !protectedRequest.user.roles || !protectedRequest.currentRoleCodes)
      throw new AuthFailureError('Permission denied');

    const roles = await RoleRepo.findByCodes(protectedRequest.currentRoleCodes);
    if (roles.length === 0) throw new AuthFailureError('Permission denied');

    let authorized = false;

    for (const userRole of protectedRequest.user.roles) {
      if (authorized) break;
      for (const role of roles) {
        if (userRole._id.equals(role._id)) {
          authorized = true;
          break;
        }
      }
    }

    if (!authorized) throw new AuthFailureError('Permission denied');

    return next();
  }),
);
