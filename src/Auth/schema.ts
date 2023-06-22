import Joi from 'joi';
import { Header } from '../core/utils';

const JoiAuthBearer = Joi.string().required();

export default {
  apiKey: Joi.object()
    .keys({
      [Header.API_KEY]: Joi.string().required(),
    })
    .unknown(true),
  auth: Joi.object()
    .keys({
      authorization: JoiAuthBearer.required(),
    })
    .unknown(true),
};
