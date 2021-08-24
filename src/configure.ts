/**
 * Configuration method.
 */

export interface Config extends Record<string, any> {
  disableRandom: boolean;
}

export const config: Config = {
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
export const configure = (options: Partial<Config>): void => {
  Object.keys(options || {}).forEach(key => {
    if (config.hasOwnProperty(key)) {
      config[key] = options[key];
    } else {
      throw new Error(`Unknown option: ${key}`);
    }
  });
};
