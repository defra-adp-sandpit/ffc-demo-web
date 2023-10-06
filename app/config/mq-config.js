const joi = require('joi')

const mqSchema = joi.object({
  messageQueue: {
    host: joi.string(),
    useCredentialChain: joi.bool().default(false),
    type: joi.string(),
    appInsights: joi.object()
  },
  claimQueue: {
    name: joi.string().default('ffc-demo-web-claim'),
    address: joi.string(),
    username: joi.string(),
    password: joi.string()
  }
})

const mqConfig = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    useCredentialChain: process.env.NODE_ENV === 'production',
    type: 'queue',
    appInsights: process.env.NODE_ENV === 'production' ? require('applicationinsights') : undefined
  },
  claimQueue: {
    name: process.env.CLAIM_QUEUE_NAME,
    address: process.env.CLAIM_QUEUE_ADDRESS,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD
  }
}

const mqResult = mqSchema.validate(mqConfig, {
  abortEarly: false
})

// Throw if config is invalid
if (mqResult.error) {
  throw new Error(`The message queue config is invalid. ${mqResult.error.message}`)
}

const claimQueueConfig = { ...mqResult.value.messageQueue, ...mqResult.value.claimQueue }

module.exports = {
  claimQueueConfig
}
