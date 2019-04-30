'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'geoquest-octane',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
        EMBER_NATIVE_DECORATOR_SUPPORT: true,
        EMBER_METAL_TRACKED_PROPERTIES: true,
        EMBER_GLIMMER_ANGLE_BRACKET_NESTED_LOOKUP: true,
        EMBER_GLIMMER_ANGLE_BRACKET_BUILT_INS: true,
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    game: {
      enableGameSounds: true,
      gameClockEnabled: false,
      board: {
        showTileGraphics: true,
        showTileHexInfo: false,
        showDebugLayer: false,
        showFieldOfViewLayer: false
      }
    }
  // {Q:-1, R:-1, S:0}, {Q:-2, R:-2, S:0}, {Q:2, R:-1, S:-1}, {Q:4, R:-4, S:0}, {Q:2, R:-5, S:3}

  // Q: 2,
          // R: 1,
          // S: -3
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV.game.gameClockEnabled = false;
    ENV.game.enableGameSounds = false;
    ENV.game.board.showTileGraphics = true;
    ENV.game.board.showTileHexInfo = true;
    ENV.game.board.showDebugLayer = true;
    ENV.game.board.showFieldOfViewLayer = true;

  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {

  }

  return ENV;
};
