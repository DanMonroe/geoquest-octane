'use strict';

// How do you upgrade from on old(er) canary version of Octane to the latest?
//     currently at "ember-source": "https://s3.amazonaws.com/builds.emberjs.com/canary/shas/60d9e8aeea8f3fa6d00bdd3480d69efc74fca1e1.tgz",
// rwjblueToday at 1:02 AM
// @DanMonroe npx ember-source-channel-url canary -w


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

    'ember-local-storage': {
      namespace: true, // will use the modulePrefix e.g. 'my-app'
      // namespace: 'customNamespace', // will use 'customNamespace'
      keyDelimiter: '/' // will use / as a delimiter - the default is :
    },

    game: {
      startingMapIndex: 1,
      // startingMapIndex: 2,
      enableGameSounds: false,
      gameClockEnabled: false,
      modalsDuration: 600,  // transition time for drop down modals
      transport: {
        moveQueueEnabled: true,
      },
      board: {
        showTileGraphics: true,
        showTileHexInfo: false,
        showDebugLayer: false,
        showFieldOfViewLayer: false,
        pathFindingDebug: false
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

    ENV.game.startingMapIndex = 1;
    // ENV.game.startingMapIndex = 2;
    ENV.game.gameClockEnabled = false;
    ENV.game.enableGameSounds = false;
    ENV.game.transport.moveQueueEnabled = true;
    ENV.game.board.showTileGraphics = true;
    ENV.game.board.showTileHexInfo = false;
    ENV.game.board.showDebugLayer = false;
    ENV.game.board.showFieldOfViewLayer = true;
    ENV.game.board.pathFindingDebug = false;

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
    ENV['ember-cli-mirage'] = {
      enabled: true
    };
  }

  return ENV;
};
