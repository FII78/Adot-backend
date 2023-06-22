import { Request, Response, NextFunction } from 'express';

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export default (execution: AsyncFunction) =>
  (req: Request, res: Response, next: (reason?: any) => PromiseLike<never> | void) => {
    execution(req, res, next as NextFunction).catch(next);
  };
