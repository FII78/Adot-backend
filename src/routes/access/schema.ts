import Joi from 'joi';
import { JoiAuthBearer } from '../../helpers/validator';

export default {
  credential: Joi.object().keys({
    phone: Joi.string().required(),
    password: Joi.string().required().min(6),
  }),
  refreshToken: Joi.object().keys({
    refreshToken: Joi.string().required().min(1),
  }),
  auth: Joi.object()
    .keys({
      authorization: JoiAuthBearer().required(),
    })
    .unknown(true),
  signup: Joi.object().keys({
    firstName: Joi.string().required().min(3),
    lastName:Joi.string().required().min(3),
    email: Joi.string().email(),
    phone:Joi.string().required().max(14),
    password: Joi.string().required().min(6),
    profilePic: Joi.string().optional(),
    bio: Joi.string(),
    title:Joi.string()
  }),
};
