import Joi from 'joi';
import { JoiObjectId, JoiUrlEndpoint } from '../../helpers/validator';

export default {
  topicUrl: Joi.object().keys({
    endpoint: JoiUrlEndpoint().required().max(200),
  }),
  topicId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  topicCreate: Joi.object().keys({
    title: Joi.string().required().min(3).max(500),
    description: Joi.string().required().min(3).max(2000),
    thumbnailImage: Joi.string().required(),
  }),
  topicUpdate: Joi.object().keys({
    title: Joi.string().optional().min(3).max(500),
    description: Joi.string().optional().min(3).max(2000),
    thumbnailImage: Joi.string().optional(),
  }),
};
