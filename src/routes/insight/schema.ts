import Joi from 'joi';
import { JoiObjectId, JoiUrlEndpoint } from '../../helpers/validator';

export default {
  insightUrl: Joi.object().keys({
    endpoint: JoiUrlEndpoint().required().max(200),
  }),
  
  insightCreate: Joi.object().keys({
    title: Joi.string().required().min(3).max(500),
    content: Joi.string().required().min(3),
    stage: Joi.string().required().max(50000),
    referance: Joi.string().optional(),
    reviewer:Joi.string().required(),
    topic: Joi.string().required(),
    category: Joi.string().required()
  }),
  insightUpdate: Joi.object().keys({
    title: Joi.string().optional().min(3).max(500),
    content: Joi.string().optional().min(3),
    stage: Joi.string().optional().max(50000),
    referance: Joi.string().optional(),
  }),
  insightId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  insightStage: Joi.object().keys({
    stage: Joi.string().required(),
  }),
  pagination: Joi.object().keys({
    pageNumber: Joi.number().required().integer().min(1),
    pageItemCount: Joi.number().required().integer().min(1),
  }),
  requiredId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
};
