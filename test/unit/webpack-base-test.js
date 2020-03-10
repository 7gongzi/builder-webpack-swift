const { expect } = require('chai');
const baseConfig = require('../../lib/webpack.base');

describe('webpack.base.js test case', () => {
    it('entry', () => {
        expect(baseConfig.entry.index.indexOf('/test/smoke/template/src/index/index.js') > -1, true);
        expect(baseConfig.entry.search.indexOf('/test/smoke/template/src/search/index.js') > -1, true);
    });
});
