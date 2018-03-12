// Exponential backoff implementation

const DefaultRetries = 5;
const DefaultStrategy = exponentialStrategy;

/**
 * Create a new instance of Backoff.
 */
class Backoff {
  constructor(func, options) {
    if (typeof func != 'function') throw new Error('arg must be a function: func');
    this.func = func;
    this.options = Object.assign({
      timeFactor: 100,
      retries: DefaultRetries,
      strategy: DefaultStrategy,
      retryIf: undefined
    }, options);
  }

  async connect() {
    let counter = 0;

    let func = this.func;
    let promise = () => {
      return new Promise(async (resolve, reject) => {
        try {
          resolve(func());
        } catch (err) {
          reject(err);
        }
      });
    };

    let options = this.options;
    while (true) {
      try {
        return await promise();
      } catch (err) {
        if (options.retryIf && !options.retryIf(err)) {
          throw err; // failure, unanticipated error
        } else {
          console.warn('retrying to connect...');
          let p = options.strategy(counter, options.retries, options.timeFactor);
          if (p === -1) throw err; // failure, no more retries
          await pause(p);
          counter++;
        }
      }
    }
  }

}

module.exports = Backoff;

/**
 * 
 * @param {int} counter is the retry attempt, from 0 up to maxRetries (exclusive)
 * @param {int} maxRetries is the total number of attempts to try
 * @param {int} factor is the unit multiplier (ex: 100 ms)
 * @return {int} the incremented counter, or -1 when counter exceeds maxRetries
 */
function exponentialStrategy(counter, maxRetries, factor) {
  if (counter < 0) {
    throw new Error(`invalid counter: ${counter} (did you forget to exit a loop?)`);
  }
  if (counter >= maxRetries) {
    return -1;
  }
  let jitter = Math.random();
  return ((2 ^ counter) + jitter) * factor;
}


/**
 * Wait for the specified pause.
 * @param {int} ms 
 */
async function pause(ms) {
  console.warn(`pausing for ${ms} ms...`);
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}