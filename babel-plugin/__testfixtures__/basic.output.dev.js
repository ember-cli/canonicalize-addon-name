define('b', [exports], function (exports) {
  exports._default = function () {};
});
define('a', ['b'], function (_b) {
  console.warn('Importing from "a" is deprecated. Please update the import to "b".');
  return _b;
});