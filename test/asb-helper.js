const { ServiceBusClient } = require('@azure/service-bus')

// When calling this within a test script, ensure there is a generous timeout
// for the connections to complete, `10000` should be enough (per queue).
async function clearQueue (config) {
  // There are three queues with potentially three different hosts and
  // credentials, however, atm there is only the single instance. KIS.
  let sbClient
  try {
    const connectionString = `Endpoint=sb://${config.host}/;SharedAccessKeyName=${config.username};SharedAccessKey=${config.password}`
    sbClient = new ServiceBusClient(connectionString)

    const queueAddress = config.address
    const receiver = sbClient.createReceiver(queueAddress, { receiveMode: 'receiveAndDelete' })
    console.log(`Setup to receive messages from '${queueAddress}'.`)

    const batchSize = 10
    let counter = 1
    let messages
    do {
      console.log(`Receiving messages, batch ${counter}.`)
      messages = await receiver.receiveMessages(batchSize, { maxWaitTimeInMs: 1000, maxTimeAfterFirstMessageInMs: 5000 })
      console.log(`Received (and deleted) ${messages.length} messages.`)
      counter++
    } while (messages.length > 0 && messages.length === batchSize)
    await receiver.close()
    console.log(`No more messages in: '${queueAddress}'.`)
  } catch (err) {
    console.log(err)
    throw err
  } finally {
    await sbClient.close()
  }
}

module.exports = {
  clearQueue
}
