const QueueBase = require('./QueueBase')

class Consumer extends QueueBase {
  /**
   * Create a new Consumer with a connection to the queue.
   * @param {object} [config] An object with host and port values.
   */
  constructor(topic, config) {
    super(topic, config)
  }

  /**
   * Dequeue a message from the front of the queue.
   * This method blocks until it can return a message or until the
   * underlying connection is closed (in which case, it will return null)
   * @return {Promise<*>}
   */
  async receive() {
    let res = await this.client.blpop('queue', 1)
    // result is an array [ list, value ], e.g., [ "queue", "a" ]
    return Array.isArray(res) && res.length == 2 ? res[1] : res
  }
}

module.exports = Consumer

