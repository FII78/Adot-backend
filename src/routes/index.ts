import express from 'express';

import signup from './access/signup'; 
import login from './access/login';
import logout from './access/logout';
import token from './access/token';
import credential from './access/credential';
import blog from './blog';
import blogs from './blogs';
import profile from './profile';
import topic from './topic';
import insight from './insight'

const router = express.Router();

/*---------------------------------------------------------*/
// router.use(apikey);
/*---------------------------------------------------------*/
/*---------------------------------------------------------*/
// router.use(permission(Permission.GENERAL));
// /*---------------------------------------------------------*/
router.use('/signup', signup);
router.use('/login', login);
router.use('/logout', logout);
router.use('/token', token);
router.use('/credential', credential);
router.use('/profile', profile);
router.use('/blog', blog);
router.use('/blogs', blogs);
router.use('/topic', topic);
router.use('/insight', insight)

export default router;
