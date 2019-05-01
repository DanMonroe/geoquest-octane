import Service from '@ember/service';
import {inject as service} from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';

export default class GameService extends Service {

  FLAGS = {
    TRAVEL: {
      SEA: 1,
      LAND: 2
    }
  };


  @service ('map') mapService;
  // @service ('game') game;
  @service ('sound') sound;
  @service ('transport') transport;
  @service ('gameboard') gameboard;
  @service ('hex') hexService;

  @tracked enemyToPlayerDistance = 0;
  @tracked enemyStatus = '';

  @tracked player = null;

  // track what attributes the player currently has so that
  // we can know if the player is allowed to move there
  @tracked playerTravelAbilityFlags = 0;

  @tracked gameClockEnabled = true;

  playerHasTravelAbilityFlag(flag) {
    if(flag) {
      return this.playerTravelAbilityFlags & flag
    }
    return false;
  }

  turnOnPlayerTravelAbilityFlag(flag) {
    if(flag) {
      this.playerTravelAbilityFlags |= flag;
    }
  }

  turnOffPlayerTravelAbilityFlag(flag) {
    if(flag) {
      this.playerTravelAbilityFlags &= ~flag;
    }
  }

  boardTransport(transportName) {
    this.turnOffPlayerTravelAbilityFlag(this.FLAGS.TRAVEL.LAND);
    this.turnOnPlayerTravelAbilityFlag(this.FLAGS.TRAVEL.SEA);
    this.player.boardedTransport = this.transport.findTransportByName(transportName);
  }

  disembarkTransportToHex(targetHex) {
    this.turnOffPlayerTravelAbilityFlag(this.FLAGS.TRAVEL.SEA);
    this.turnOnPlayerTravelAbilityFlag(this.FLAGS.TRAVEL.LAND);
    this.player.boardedTransport = null;
    this.player.hex = targetHex;
  }

  @task( function*() {
    while (this.gameClockEnabled === true) {
      yield timeout(1000);
      console.log('game tick');
    }
  }) gameClock;

  onTransportMoved(transport, targetHex) {
    // console.log('onTransportMoved', transport.name);
    let pathDistanceToShipHex = this.mapService.findPath(this.mapService.worldMap, this.player.hex, targetHex);
    // let pathDistanceToShipHex = this.mapService.findPath(this.mapService.worldMap, this.game.player.hex, targetHex);
    transport.playerDistance = pathDistanceToShipHex.length;

    // this.enemyToPlayerDistance = pathDistanceToShipHex.length;

    this.updateEnemyOpacityForRangeAndObscurity(transport, targetHex);

    if (pathDistanceToShipHex.length <= transport.sightRange) {
      transport.playerInRange();
    }
  }

    // adjust enemy opacity based on range of player and obscured hexes
  updateEnemyOpacityForRangeAndObscurity(transport, targetHex) {
    let player = this.player;
    let playerSightRange = player.sightRange;
    let currentOpacity = transport.imageGroup.opacity();
    let returnFieldOfViewHexes = this.gameboard.isFieldOfViewBlockedForHex(player.hex, targetHex/**, sortedByDistanceNeighbors**/);
    // console.log('returnFieldOfViewHexes', returnFieldOfViewHexes, player, player.sightRange, this.enemyToPlayerDistance);
    let playerSightBlocked = this.hexService.arrayOfHexesIncludesHex(returnFieldOfViewHexes.blocked, targetHex)
    if (currentOpacity > 0) {  // allows for partial obscurity (like fog/eather)
      if (playerSightBlocked) {
        transport.imageGroup.to({opacity: 0});
      } else if (transport.playerDistance > playerSightRange) {
      // } else if (this.enemyToPlayerDistance > playerSightRange) {
        transport.imageGroup.to({opacity: 0});
      }
    } else if (transport.playerDistance <= playerSightRange) {
    // } else if (this.enemyToPlayerDistance <= playerSightRange) {
      if (!playerSightBlocked) {
        transport.imageGroup.to({opacity: 1});
      }
    }
  }

  onPlayerMoved(targetHex) {
    // this.updateEnemyOpacityForRangeAndObscurity(transport, targetHex);
  }
}
