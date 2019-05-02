import Service from '@ember/service';
import {inject as service} from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';
import Konva from 'konva';

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
    // let pathDistanceToShipHex = this.mapService.findPath(this.mapService.worldMap, this.player.hex, targetHex);
    // transport.playerDistance = pathDistanceToShipHex.length;

    this.updateEnemyOpacityForRangeAndObscurity(transport, targetHex);

    let distance = this.mapService.distanceInHexes(this.player.hex, targetHex);
    transport.playerDistance = distance;
    // console.log('distance/this.sightRange', distance, transport.sightRange);

    if (distance <= transport.sightRange) {
      // if (pathDistanceToShipHex.length <= transport.sightRange) {
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

  // used to find sine and cosine from angle to target
  getTargetAngle(startPoint, targetPoint, weapon) {

    let targetX = targetPoint.x;
    let targetXAdjustment = targetX * (Math.random() * weapon.accuracy);
    let plusOrMinusX = Math.random() < 0.5 ? -1 : 1;
    let adjustedTargetX = targetX + (plusOrMinusX * targetXAdjustment);
    let atan2X = adjustedTargetX - startPoint.x;

    let targetY = targetPoint.y;
    let targetYAdjustment = targetY * (Math.random() * weapon.accuracy);
    let plusOrMinusY = Math.random() < 0.5 ? -1 : 1;
    let adjustedTargetY = targetY + (plusOrMinusY * targetYAdjustment);
    let atan2Y = adjustedTargetY - startPoint.y;

    let angle = Math.atan2(atan2Y, atan2X);
    // let angle = Math.atan2(targetY - startPoint.y, targetX - startPoint.x);  // original - always accurate
    let sin = Math.sin(angle) * weapon.speed; // Y change
    let cos = Math.cos(angle) * weapon.speed; // X change
    let deltaX = Math.abs(cos);
    let deltaY = Math.abs(sin);
    // console.log('angle', angle, 'deltaX', deltaX, 'deltaY', deltaY);

    return {
      angle: angle,
      sin: sin,
      cos: cos,
      deltaX: deltaX,
      deltaY: deltaY,
      maxX: Math.abs(adjustedTargetX - startPoint.x),
      maxY: Math.abs(adjustedTargetY - startPoint.y)
    }
  }

  buildProjectile(weapon, startPoint, targetPoint) {
    let projectile;
    let arrowLenX;
    let arrowLenY;

    let targetAngle = this.getTargetAngle(startPoint, targetPoint, weapon);

    // console.log('building projectile', weapon.type, startPoint.x, startPoint.y, targetAngle);

    switch (weapon.type) {
      case 'cannon':
        projectile = new Konva.Circle({
          x: startPoint.x,
          y: startPoint.y,
          radius: 4,
          fill: 'black',
          draggable: false,
          opacity: 1
        });
        break;
      case 'arrow':
        arrowLenX = targetAngle.cos * 3;
        arrowLenY = targetAngle.sin * 3;
        targetAngle.maxX -= arrowLenX;  // don't go passed target
        targetAngle.maxY -= arrowLenY;

        projectile = new Konva.Arrow({
          points: [
            startPoint.x,
            startPoint.y,
            startPoint.x + arrowLenX,
            startPoint.y + arrowLenY,
          ],
          stroke: '#8e551b',  // brown
          pointerLength: 4,
          pointerWidth: 3,
          strokeWidth: 2
        });
        break;
      default:
        return;
    }


    projectile.damage = weapon.damage;
    projectile.maxX = targetAngle.maxX;
    projectile.maxY = targetAngle.maxY;
    projectile.cos = targetAngle.cos;
    projectile.sin = targetAngle.sin;
    projectile.deltaX = targetAngle.deltaX;
    projectile.deltaY = targetAngle.deltaY;

    return projectile;
  }
  // onPlayerMoved(targetHex) {
    // this.updateEnemyOpacityForRangeAndObscurity(transport, targetHex);
  // }
}
