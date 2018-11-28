# Canonicalize Addon Name

Ember-CLI historically has not enforced the Addon name in the `index.js` to be the same as the name in the `package.json`. While we feel that this divergence is uncommon, addons that did not have a canonicalized name would produce code that did not align to the package name. As one can imagine this makes debugging hard and it also makes things like tree shaking harder to achieve. This library intends to provide tooling to addon authors that fall into the uncommon case of diverged names.

## What's In The Box

This library exposes 2 functions:

### `generateDeprecatedAliases`

This function takes a Broccoli tree of AMD modules and generates aliasing the old module path to the new module path. It is is to be used within `treeForAddon` and `treeForAddonSupport`.

#### Example:

```js
const { generateDeprecatedAliases } = require('canonicalize-addon-name');

module.exports = {
  // ...

  treeForAddon() {
    let superResult = this._super.treeForAddon.apply(this, arguments);
    return generateDeprecatedAliases(superResult, 'old-name', 'new-name');
  },
}
```

This allows addon consumers to continue to use the old import paths without breaking the app.

### `command`

This function will return you an Ember CLI command that will allow applications to run a codemod against their code to migrate to the new import paths.

#### Example:

```js
const { command } = require('canonicalize-addon-name');

module.exports = {
  // ...

  includedCommands() {
    return command('command-prefix', 'old-name', 'new-name');
  },
}
```
