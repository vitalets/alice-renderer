/**
 * Configuration method.
 */

const config = {
  /**
   * Disables randomization, all replies does not vary (useful for tests)
   */
  disableRandom: false,
};

/**
 * Configure global options.
 * @param {Object} options
 * @param {Boolean} options.disableRandom
 */
const configure = options => {
  Object.assign(config, options);
};

module.exports = {
  configure,
  config,
};
