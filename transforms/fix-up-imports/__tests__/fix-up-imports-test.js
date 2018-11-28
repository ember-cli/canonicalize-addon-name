/* global jest describe */
// For debug, run
// node --inspect-brk ./node_modules/.bin/jest --runInBand
'use strict';

const defineTest = require('jscodeshift/dist/testUtils').defineTest;


jest.disableAutomock();

describe('fix-up-imports', () => {
  defineTest(__dirname, 'fix-up-imports', { oldName: 'A', newName: 'B' }, 'basic');
  defineTest(__dirname, 'fix-up-imports', { oldName: 'foo-bar', newName: '@org/foo-bar' }, 'org');
  defineTest(__dirname, 'fix-up-imports', { oldName: 'A', newName: 'B' }, 'exports');
  defineTest(__dirname, 'fix-up-imports', { oldName: 'bar', newName: '@my-bar/x' }, 'kitchen-sink');
});