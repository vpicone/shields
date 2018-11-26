'use strict'

const Joi = require('joi')

module.exports = {
  nonNegativeInteger: Joi.number()
    .integer()
    .min(0)
    .required(),

  anyInteger: Joi.number()
    .integer()
    .required(),

  arrayOfStrings: Joi.array()
    .items(Joi.string())
    .allow([])
    .required(),

  objectOfKeyValues: Joi.object()
    .pattern(/./, Joi.alternatives().try(Joi.string(), Joi.boolean()))
    .required(),

  staticBadgeContent: Joi.object({
    label: Joi.string(),
    message: Joi.string().required(),
    color: Joi.string().required(),
  }).required(),
}
