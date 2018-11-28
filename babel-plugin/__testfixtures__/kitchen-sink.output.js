define('@org/b/a/c', [exports, 'x', '@org/j'], function (exports, _x, _orgJ) {
  exports._default = function () {};
  _x + _orgj;
});
define('b/a/c', ['@org/b/a/c'], function (_orgBAC) {
  console.warn('Importing from "b/a/c" is deprecated. Please update the import to "@org/b/a/c".');
  return _orgBAC;
});