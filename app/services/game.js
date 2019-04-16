import Service from '@ember/service';
import {inject as service} from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';

export default class GameService extends Service {

  @service ('map') mapService;
  @service ('transport') transport;
  @service ('gameboard') gameboard;
  @service ('hex') hexService;

  @tracked enemyToPlayerDistance = 0;
  @tracked enemyStatus = '';

  @tracked gameClockEnabled = true;

  @task( function*() {
    while (this.gameClockEnabled === true) {
      yield timeout(1000);
      console.log('game tick');
    }
  }) gameClock;

  onTransportMoved(transport, targetHex) {
    let shipHex = this.transport.transportHexes[0];
    let pathDistanceToShipHex = this.mapService.findPath(this.mapService.worldMap, shipHex, targetHex);
    transport.playerDistance = pathDistanceToShipHex.length;

    this.enemyToPlayerDistance = pathDistanceToShipHex.length;
    this.enemyStatus = pathDistanceToShipHex.length <= transport.sightRange ? 'Fight' : 'Patrol';

    this.updateEnemyOpacityForRangeAndObscurity(transport, targetHex);
  }

    // adjust enemy opacity based on range of player and obscured hexes
  updateEnemyOpacityForRangeAndObscurity(transport, targetHex) {
    let player = this.transport.players.objectAt(0);
    let playerSightRange = player.sightRange;
    let currentOpacity = transport.imageObj.opacity();
    let returnFieldOfViewHexes = this.gameboard.isFieldOfViewBlockedForHex(player.hex, targetHex/**, sortedByDistanceNeighbors**/);
    let playerSightBlocked = this.hexService.arrayOfHexesIncludesHex(returnFieldOfViewHexes.blocked, targetHex)
    if (currentOpacity > 0) {  // allows for partial obscurity (like fog/eather)
      if (playerSightBlocked) {
        transport.imageObj.to({opacity: 0});
      } else if (this.enemyToPlayerDistance > playerSightRange) {
        transport.imageObj.to({opacity: 0});
      }
    } else if (this.enemyToPlayerDistance <= playerSightRange) {
      if (!playerSightBlocked) {
        transport.imageObj.to({opacity: 1});
      }
    }
  }

}
