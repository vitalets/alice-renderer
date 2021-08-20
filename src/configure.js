/**
 * Configuration method.
 */

export const config = {
  /**
   * Disables randomization, all replies does not vary (useful for tests)
   */
  disableRandom: false,
};

/**
 * Configure global options.
 *
 * @param {Object} options
 * @param {Boolean} options.disableRandom
 */
export const configure = (options) => {
  Object.keys(options || {}).forEach((key) => {
    if (config.hasOwnProperty(key)) {
      config[key] = options[key];
    } else {
      throw new Error(`Unknown option: ${key}`);
    }
  });
};
