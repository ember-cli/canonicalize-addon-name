define('@org/b', [exports], function (exports) {
  exports._default = function () {};
});
define('b', ['@org/b'], function (_orgB) {
  console.warn('Importing from "b" is deprecated. Please update the import to "@org/b".');
  return _orgB;
});