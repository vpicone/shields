'use strict'

const { collectDefinitions } = require('../services')

const definitions = collectDefinitions()

process.stdout.write(JSON.stringify(definitions))
