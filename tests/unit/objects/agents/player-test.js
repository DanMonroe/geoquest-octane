import { module, test } from 'qunit';
import { Player } from 'geoquest-octane/objects/agents/player';

let player = {};

module('Unit | Object | player', function(hooks) {

  hooks.beforeEach(() => {
  });

  test('healthPercentage at full health is 100', function(assert) {
      let agent = new Player({player:{ maxHitPoints:20, currentHitPoints:20}});
      assert.equal(agent.healthPercentage, 100);
  });

  test('healthPercentage at 80%', function(assert) {
      let agent = new Player({player:{maxHitPoints:20, currentHitPoints:16}});
      assert.equal(agent.healthPercentage, 80);
  });

  test('healthPercentage at 0 with no current hitpoints or <= 0 hitpoints', function(assert) {
      let agent = new Player({player:{maxHitPoints:20}});
      assert.equal(agent.healthPercentage, 0);
  });

  test('healthPercentage at 0 with  hitpoints <= 0', function(assert) {
      let agent = new Player({player:{currentHitPoints: -1, maxHitPoints:20}});
      assert.equal(agent.healthPercentage, 0);
  });

  test('healthPercentage at 100 with hitpoints > 100%', function(assert) {
      let agent = new Player({player:{ currentHitPoints: 25, maxHitPoints:20}});
      assert.equal(agent.healthPercentage, 100);
  });

});
