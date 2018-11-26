'use strict'

const Joi = require('joi')
const { objectOfKeyValues } = require('./validators')

const optionalServiceData = Joi.object({
  label: Joi.string(),
  message: Joi.string()
    .allow('')
    .required(),
  color: Joi.string(),
})

const schema = Joi.object({
  title: Joi.string().required(),
  namedParams: objectOfKeyValues,
  queryParams: objectOfKeyValues,
  pattern: Joi.string(),
  staticExample: optionalServiceData,
  previewUrl: Joi.string(),
  exampleUrl: Joi.string(),
  keywords: Joi.array()
    .items(Joi.string())
    .default([]),
  documentation: Joi.string(), // Valid HTML.
})
  // .rename('query', 'queryParams', { ignoreUndefined: true })
  // .rename('urlPattern', 'pattern', { ignoreUndefined: true })
  .required()

function validateExample(example, index, ServiceClass) {
  const result = Joi.attempt(
    example,
    schema,
    `Example for ${ServiceClass.name} at index ${index}`
  )

  const { namedParams, pattern, staticExample, previewUrl, exampleUrl } = result

  if (staticExample) {
    if (!pattern && !ServiceClass.route.pattern) {
      throw new Error(
        `Static example for ${
          ServiceClass.name
        } at index ${index} does not declare a pattern`
      )
    }
    if (namedParams && exampleUrl) {
      throw new Error(
        `Static example for ${
          ServiceClass.name
        } at index ${index} declares both namedParams and exampleUrl`
      )
    } else if (!namedParams && !exampleUrl) {
      throw new Error(
        `Static example for ${
          ServiceClass.name
        } at index ${index} does not declare namedParams nor exampleUrl`
      )
    }
    if (previewUrl) {
      throw new Error(
        `Static example for ${
          ServiceClass.name
        } at index ${index} also declares a dynamic previewUrl, which is not allowed`
      )
    }
  } else if (!previewUrl) {
    throw Error(
      `Example for ${
        ServiceClass.name
      } at index ${index} is missing required previewUrl or staticExample`
    )
  }

  return result
}

function transformExample(example, index, ServiceClass) {
  const {
    title,
    namedParams,
    queryParams,
    pattern,
    staticExample,
    previewUrl,
    exampleUrl,
    keywords,
    documentation,
  } = validateExample(example, index, ServiceClass)

  let staticExampleData
  if (staticExample) {
    const badgeData = ServiceClass._makeBadgeData({}, staticExample)
    staticExampleData = {
      label: badgeData.text[0],
      message: `${badgeData.text[1]}`,
      color: badgeData.colorscheme || badgeData.colorB,
    }
  }

  return {
    title,
    example: {
      pattern,
      namedParams,
      path: exampleUrl,
      queryParams,
    },
    preview: {
      ...staticExampleData,
      path: previewUrl,
    },
    keywords,
    documentation,
  }
}

module.exports = {
  validateExample,
  transformExample,
}
