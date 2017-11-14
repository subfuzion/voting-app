const QueueBase = require('./QueueBase')

class Producer extends QueueBase {
  /**
   * Create a new Producer with a connection to the queue.
   * @param {object} [config] An object with host and port values.
   */
  constructor(topic, config) {
    super(topic, config)
  }

  /**
   * Enqueue a message to the back of the queue.
   * @param message
   * @return {Promise<void>}
   */
  async send(message) {
    await this.client.rpush('queue', message)
  }
}

module.exports = Producer
