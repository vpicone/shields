'use strict'

const Joi = require('joi')
const { arrayOfStrings, objectOfKeyValues } = require('./validators')

const serviceDefinition = Joi.object({
  category: Joi.string().required(),
  name: Joi.string().required(),
  route: Joi.alternatives()
    .try(
      Joi.object({
        pattern: Joi.string().required(),
        queryParams: arrayOfStrings,
      }),
      Joi.object({
        format: Joi.string().required(),
        queryParams: arrayOfStrings,
      })
    )
    .required(),
  examples: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().required(),
        example: Joi.alternatives()
          .try(
            Joi.object({
              pattern: Joi.string(),
              namedParams: objectOfKeyValues,
              queryParams: objectOfKeyValues,
            }),
            Joi.object({
              path: Joi.string().required(), // URL convertible.
              queryParams: objectOfKeyValues,
            })
          )
          .required(),
        preview: Joi.alternatives()
          .try(
            Joi.object({
              label: Joi.string(),
              message: Joi.string().required(),
              color: Joi.string().required(),
            }).required(),
            Joi.object({
              path: Joi.string().required(), // URL convertible.
            })
          )
          .required(),
        keywords: arrayOfStrings,
        documentation: Joi.string(), // Valid HTML.
      })
    )
    .default([]),
}).required()

function assertValidServiceDefinition(example, message = undefined) {
  Joi.assert(example, serviceDefinition, message)
}

const serviceDefinitionExport = Joi.array()
  .items(
    Joi.object({
      schemaVersion: Joi.equal('0').required(),
      categories: Joi.array()
        .items(
          Joi.object({
            id: Joi.string().required(),
            name: Joi.string().required(),
          })
        )
        .required(),
      services: Joi.array()
        .items(serviceDefinition)
        .required(),
    })
  )
  .required()

function assertValidServiceDefinitionExport(examples, message = undefined) {
  Joi.assert(examples, isDefinitionArray, message)
}

module.exports = {
  serviceDefinition,
  assertValidServiceDefinition,
  serviceDefinitionExport,
  assertValidServiceDefinitionExport,
}
