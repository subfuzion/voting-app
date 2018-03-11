const QueueBase = require('./QueueBase');

// redis timeout is in seconds
const DefaultTimeout = 2;

class Consumer extends QueueBase {
  /**
   * Create a new Consumer with a connection to the queue.
   * @param {object} [config] An object with host, port, and timeout properites.
   */
  constructor(topic, config) {
    super(topic, config);
  }

  get timeout() {
    return this.config && typeof this.config.timeout !== 'undefined' ? this.config.timeout : DefaultTimeout;
  }

  /**
   * Dequeue a message from the front of the queue.
   * This method blocks until it can return a message or until the
   * underlying connection is closed (in which case, it will return null)
   * @return {Promise<*>}
   */
  async receive(timeout) {
    if (typeof timeout === 'undefined') {
      timeout = this.timeout;
    }
    let res = await this.client.blpop(this.topic, timeout);
    // result is an array [ list, value ], e.g., [ "queue", "a" ]
    return Array.isArray(res) && res.length == 2 ? res[1] : res;
  }
}

module.exports = Consumer;

