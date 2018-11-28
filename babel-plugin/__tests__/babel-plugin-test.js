/* global jest describe */
// For debug, run
// node --inspect-brk ./node_modules/.bin/jest --runInBand
'use strict';

const globby = require('globby');
const path = require('path');
const fs = require('fs');
const transform = require('babel-core').transform;
const plugin = require('../index').createDeprecatedAliases;
const DEV = process.env.EMBER_ENV === 'development';
jest.disableAutomock();

describe('babel-plugin', () => {
  globby
  .sync('../__testfixtures__/*.input.js', {
    cwd: __dirname,
    absolute: true,
    transform: entry =>
      entry.slice(entry.indexOf('__testfixtures__') + '__testfixtures__'.length + 1),
  }).forEach(file => {
    let outFilePath = file.replace('.input.', `.output.${DEV ? 'dev' : 'prod'}.`);
    let optionsFilePath = file.replace('.input.', '.options.');
    optionsFilePath = optionsFilePath.replace(path.extname(file), '.json');
    let inputContent = fs.readFileSync(path.join(__dirname, `../__testfixtures__/${file}`), 'utf8');
    let outputContent = fs.readFileSync(path.join(__dirname, `../__testfixtures__/${outFilePath}`), 'utf8');
    let options = JSON.parse(fs.readFileSync(path.join(__dirname, `../__testfixtures__/${optionsFilePath}`), 'utf8'));
    test(`Passed ${file}`, () => {
      let transformed = transform(inputContent, {
        plugins: [plugin(options)]
      });
      expect(transformed.code).toEqual(outputContent);
    })
  });
});