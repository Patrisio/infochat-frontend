const path = require('path');
const TsJestTransformer = require('ts-jest-transformer');

class BaseNameTransformer extends TsJestTransformer {
  process(src, filename, config, options) {
    return 'module.exports = ' + JSON.stringify(path.basename(filename)) + ';';
  }
}

module.exports = new BaseNameTransformer();