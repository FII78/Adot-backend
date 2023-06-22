import express, { Router, Request, Response } from 'express';

// Create a new instance of the Express Router
const router: Router = express.Router();

// Define routes and endpoint handlers
router.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

// Export the router
export default router;
