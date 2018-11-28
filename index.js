const Babel = require('broccoli-babel-transpiler');
const path = require('path');
const execa = require('execa');

function generateDeprecatedAliases(tree, oldName, newName) {
  if (oldName === newName) {
    return tree;
  }

  const createDeprecatedAliases = {
    _parallelBabel: {
      requireFile: require.resolve('./babel-plugin/index.js'),
      buildUsing: 'createDeprecatedAliases',
      params: { oldName, newName }
    }
  }

  return new Babel(tree, {
    throwUnlessParallelizable: true,
    plugins: [createDeprecatedAliases]
  });
}

function fixupImportsCommand(prefix, oldName, newName) {
  return {
    name: `${prefix}:fixup-imports`,
    description: `Migrates import statements from "${oldName}/*" to "${newName}/*".`,
    availableOptions: [
      { name: 'path', type: String, description: 'the path to where you want to run the codemod', default: ['app', 'test'] }
    ],
    run(options) {
      let jscodeshiftBin = path.dirname(require.resolve('jscodeshift')) + '/bin/jscodeshift.sh';
      let transformPath = path.join(__dirname, './transforms/fix-up-imports/fix-up-imports.js');
      let paths = typeof options.path === 'string' ? [options.path] : options.path;

      return execa(jscodeshiftBin, ['-t', transformPath, ...paths, `--oldName=${oldName}`, `--newName=${newName}`], {
        stdio: 'inherit',
        env: process.env
      }).catch(e => {
        console.error(e.stack);
        throw e;
      });
    }
  }
}

module.exports = {
  generateDeprecatedAliases,
  command(prefix, oldName, newName) {
    return {
      [`${prefix}:fixup-imports`]: fixupImportsCommand(prefix, oldName, newName)
    }
  }
}
