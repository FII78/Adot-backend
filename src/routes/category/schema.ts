import Joi from 'joi';
import { JoiObjectId } from '../../helpers/validator';

export default {
  categoryId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  
  pagination: Joi.object().keys({
    pageNumber: Joi.number().required().integer().min(1),
    pageItemCount: Joi.number().required().integer().min(1),
  }),
  createCategory: Joi.object().keys({
    title: Joi.string().required().min(3),
  }),
};
