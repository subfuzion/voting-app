const common = require('./common')
const EventEmitter = require('events').EventEmitter
const Redis = require('ioredis')

class QueueBase extends EventEmitter {
  /**
   * Create a new instance with a connection to the queue.
   * @param {string} topic The queue topic to associate with this instance.
   * @param {object} [config] An object with host and port values.
   */
  constructor(topic, config, ...opts) {
    super()
    this._topic = topic
    this._config = Object.assign({}, common.DefaultConfig, config)
    this._client = new Redis(this.config, ...opts)
    this._isClosed = false

    let that = this
    ;[ 'connect', 'ready', 'error', 'close', 'reconnecting', 'end', '+node', '-node', 'node error' ].forEach(evt => {
      this._client.on(evt, (...args) => {
        that.emit(evt, ...args)
      })
    })
  }

  /**
   * Return false until the quit method has been called, then true.
   * @return {boolean}
   */
  get isClosed() {
    return this._isClosed
  }

  /**
   * Get a copy of the config object.
   * @return {{}}
   */
  get config() {
    return this._config
  }

  /**
   * Get access to the internal queue client.
   * @return {*}
   */
  get client() {
    return this._client
  }

  /**
   * Get the topic associated with this instance.
   * @return {string}
   */
  get topic() {
    return this._topic
  }

  /**
   * Attempt to close client and server ends of the connection gracefully.
   * Calling any other methods will throw 'Connection is closed' errors after this.
   * @return {Promise<*>}
   */
  async quit() {
    this._isClosed = true
    return await this._client.quit()
  }

  /**
   * Forcibly close the connection, if necessary.
   * Calling any other methods will throw 'Connection is closed' errors after this.
   * @param {boolean} flush Should always be true in production.
   * @return {Promise<*>}
   */
  async end(flush) {
    this._isClosed = true
    return await this._client.end(flush)
  }

  /**
   * Ping the queue to confirm the connection works.
   * @return {Promise<string>} Returns 'PONG' if successful.
   */
  async ping() {
    return await this._client.ping()
  }
}

module.exports = QueueBase
