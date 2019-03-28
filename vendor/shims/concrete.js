(function() {
  function vendorModule() {
    'use strict';

    return {
      'default': self['concrete'],
      __esModule: true,
    };
  }

  define('concrete', [], vendorModule);
})();
