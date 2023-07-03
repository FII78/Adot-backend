import express from 'express';

import signup from './access/signup'; 
import login from './access/login';
import logout from './access/logout';
import token from './access/token';
import profile from './profile';
import topic from './topic';
import insight from './insight'
import category from './category';

const router = express.Router();

router.use('/signup', signup);
router.use('/login', login);
router.use('/logout', logout);
router.use('/token', token);
router.use('/profile', profile);
router.use('/topic', topic);
router.use('/category', category)
router.use('/insight', insight)

export default router;
