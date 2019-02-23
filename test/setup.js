const chai = require('chai');
const sinon = require('sinon');

chai.config.truncateThreshold = 0;

global.assert = chai.assert;
global.sinon = sinon;

afterEach(async () => {
  sinon.restore();
});
