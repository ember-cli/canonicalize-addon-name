define('@org/b', [exports], function (exports) {
  exports._default = function () {};
});
define('b', ['@org/b'], function (_orgB) {
  return _orgB;
});