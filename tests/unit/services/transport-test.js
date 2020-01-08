import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { Point } from 'geoquest-octane/objects/point';
import { setupMirage } from 'ember-cli-mirage/test-support';
import pushMirageIntoStore from 'geoquest-octane/helpers/push-mirage-into-store';
import scrolltestsmall from 'geoquest-octane/mirage/scenarios/scrolltestsmall';

let store;
let transportService;
let gameService;
let mapService;
let cameraService;

module('Unit | Service | transport', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    transportService = this.owner.lookup('service:transport');
    gameService = this.owner.lookup('service:game');
    mapService = this.owner.lookup('service:map');
    cameraService = this.owner.lookup('service:camera');

    cameraService.scrollContainerWidth = 708;
    cameraService.scrollContainerHeight = 591;

    store = this.owner.lookup('service:store');

    scrolltestsmall(this.server);

    pushMirageIntoStore();

    // map is 17 rows x 17 cols
    let emberDataMap = await store.findRecord('map', 2, {include:'hexRows'});
    mapService.worldMap = emberDataMap.hexGrid;

    mapService.loadLayout(emberDataMap);

    gameService.player = { sightRange: 2 };

  });

  module('Move Player Or Map', function (hooks) {
    test('target in box should move player', function(assert) {
      assert.ok(transportService.shouldMovePlayer(true, false));
    });
    test('target is near edge should move player', function(assert) {
      assert.ok(transportService.shouldMovePlayer(false, true));
    });
  });
  module('Move Player', function (hooks) {

    test('player Move Will Be Inside Sight Range Boundary', function(assert) {
      let col = 2;
      let row = 2;
      assert.notOk(transportService.playerMoveWillBeInsideSightRangeBoundary(mapService.findHexByColRow(col, row)), `outside col ${col}, row ${row}`);
      for(col = 2, row = 3; col < 10; col++, row = 3) {
        assert.ok(transportService.playerMoveWillBeInsideSightRangeBoundary(mapService.findHexByColRow(col, row)), `inside col ${col}, row ${row++}`);
        assert.ok(transportService.playerMoveWillBeInsideSightRangeBoundary(mapService.findHexByColRow(col, row)), `inside col ${col}, row ${row++}`);
        assert.ok(transportService.playerMoveWillBeInsideSightRangeBoundary(mapService.findHexByColRow(col, row)), `inside col ${col}, row ${row++}`);
        assert.notOk(transportService.playerMoveWillBeInsideSightRangeBoundary(mapService.findHexByColRow(col, row)), `outside col ${col}, row ${row++}`);
      }
    });

    test('player Move Will Be Inside Sight Range Boundary after map moved', function(assert) {

      assert.ok(transportService.playerMoveWillBeInsideSightRangeBoundary(mapService.findHexByColRow(4, 4)), `inside col 4, row 4`);
      assert.ok(transportService.playerMoveWillBeInsideSightRangeBoundary(mapService.findHexByColRow(4, 5)), `inside col 4, row 5`);
      assert.notOk(transportService.playerMoveWillBeInsideSightRangeBoundary(mapService.findHexByColRow(4, 6)), `outside col 4, row 6`);

      let currentHex = mapService.findHexByColRow(4, 5);
      let targetHex = mapService.findHexByColRow(4, 6);
      let adjustmentPoint = mapService.distanceInPoint(currentHex, targetHex);

      transportService.camera.adjustMapOffset(adjustmentPoint); // move map

      let movedHex = mapService.findHexByColRow(4, 6);
      console.log('movedHex', movedHex);
      assert.ok(transportService.playerMoveWillBeInsideSightRangeBoundary(mapService.findHexByColRow(4, 6)), `inside col 4, row 6`);
      assert.ok(transportService.playerMoveWillBeInsideSightRangeBoundary(movedHex), `inside ${movedHex.col} ${movedHex.row}`);
      assert.ok(transportService.playerMoveWillBeInsideSightRangeBoundary(targetHex), `inside ${targetHex.col} ${targetHex.col}`);
      assert.notOk(transportService.playerMoveWillBeInsideSightRangeBoundary(mapService.findHexByColRow(4, 7)), `outside col 4, row 7`);
    });

    test('player move is near edge', async function(assert) {
      assert.notOk(transportService.playerMoveIsNearEdge({col: 8, row: 7}), "not near edge - up from center");
      assert.notOk(transportService.playerMoveIsNearEdge({col: 8, row: 9}), "not near edge - down from center");
      assert.notOk(transportService.playerMoveIsNearEdge({col: 6, row: 8}), "not near edge - left from center");
      assert.notOk(transportService.playerMoveIsNearEdge({col: 10, row: 8}), "not near edge - right from center");

      // map is 17 rows x 17 cols
      assert.ok(transportService.playerMoveIsNearEdge({col: 8, row: 2}), "near edge - up within sight range");
      assert.ok(transportService.playerMoveIsNearEdge({col: 8, row: 18}), "near edge - down within sight range");
      assert.ok(transportService.playerMoveIsNearEdge({col: 2, row: 8}), "near edge - left within sight range");
      assert.ok(transportService.playerMoveIsNearEdge({col: 18, row: 8}), "near edge - right within sight range");
    });

    test('player move is within the box of map edge and should move player', async function(assert) {
      const currentHex = mapService.findHexByColRow(6, 4);
// console.log(currentHex, mapService.worldMap);

      // up
      let targetHex = mapService.findHexByColRow(6, 3);
      let adjustmentPoint = mapService.distanceInPoint(currentHex, targetHex);
      let shouldMovePlayer = transportService.playerMoveIsWithinSightRangeOfMapEdge(adjustmentPoint,targetHex);
      assert.ok(shouldMovePlayer, "should Move Player up");

      // down
      targetHex = mapService.findHexByColRow(6, 5);
      adjustmentPoint = mapService.distanceInPoint(currentHex, targetHex);
      shouldMovePlayer = transportService.playerMoveIsWithinSightRangeOfMapEdge(adjustmentPoint,targetHex);
      assert.ok(shouldMovePlayer, "should Move Player down");

      // left
      targetHex = mapService.findHexByColRow(5, 4);
      adjustmentPoint = mapService.distanceInPoint(currentHex, targetHex);
      shouldMovePlayer = transportService.playerMoveIsWithinSightRangeOfMapEdge(adjustmentPoint,targetHex);
      assert.ok(shouldMovePlayer, "should Move Player left");

      // right
      targetHex = mapService.findHexByColRow(7, 4);
      adjustmentPoint = mapService.distanceInPoint(currentHex, targetHex);
      shouldMovePlayer = transportService.playerMoveIsWithinSightRangeOfMapEdge(adjustmentPoint,targetHex);
      assert.ok(shouldMovePlayer, "should Move Player right");
    });

    test('mapAreaAvailableOtherSideOfSightRangeBox', async function(assert) {
      let currentHex = mapService.findHexByColRow(6, 5);

      // down
      let targetHex = mapService.findHexByColRow(6, 6);
      let adjustmentPoint = mapService.distanceInPoint(currentHex, targetHex);
      let mapAreaAvailableOtherSideOfSightRangeBox = transportService.mapAreaAvailableOtherSideOfSightRangeBox(adjustmentPoint, targetHex);
      assert.notOk(mapAreaAvailableOtherSideOfSightRangeBox, "mapAreaAvailableOtherSideOfSightRangeBox - down");

      currentHex = mapService.findHexByColRow(11, 4);
      targetHex = mapService.findHexByColRow(12, 4);
      adjustmentPoint = mapService.distanceInPoint(currentHex, targetHex);
      mapAreaAvailableOtherSideOfSightRangeBox = transportService.mapAreaAvailableOtherSideOfSightRangeBox(adjustmentPoint, targetHex);
      assert.notOk(mapAreaAvailableOtherSideOfSightRangeBox, "mapAreaAvailableOtherSideOfSightRangeBox - right");

    });

  });
  module('Move Map', function (hooks) {
  //   test('player move is within the box of map edge and should move player', async function(assert) {
  //     const currentHex = mapService.findHexByColRow(6, 5);
  // // console.log(currentHex, mapService.worldMap);
  //
  //     // down
  //     let targetHex = mapService.findHexByColRow(6, 6);
  //     assert.notOk(transportService.playerMoveIsNearEdge(targetHex), "not near edge - down");
  //
  //     let adjustmentPoint = mapService.distanceInPoint(currentHex, targetHex);
  //     let shouldMovePlayer = transportService.playerMoveIsWithinSightRangeOfMapEdge(adjustmentPoint,targetHex);
  //
  //     assert.notOk(shouldMovePlayer, "should not Move Player down");
  //   });
  });
});
