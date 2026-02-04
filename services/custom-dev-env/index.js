/* eslint-env node */

'use strict'

const path = require('node:path')

// Run the PDS + PLC dev script (built from packages/dev-env/custom/run-pds-plc.ts)
require(path.join(
  __dirname,
  '../../packages/dev-env/dist/custom/run-pds-plc.js',
))
