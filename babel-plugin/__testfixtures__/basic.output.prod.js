define('b', [exports], function (exports) {
  exports._default = function () {};
});
define('a', ['b'], function (_b) {
  return _b;
});