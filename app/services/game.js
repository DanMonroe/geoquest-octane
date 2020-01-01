import Service from '@ember/service';
import {inject as service} from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { timeout } from 'ember-concurrency';
import {task} from 'ember-concurrency-decorators';
import Konva from 'konva';
import { A as emberArray } from '@ember/array';
import { storageFor } from 'ember-local-storage';

export default class GameService extends Service {

  // FLAGS = {
  //   TRAVEL: {
  //     SEA: {value: 1, description: 'Travel by Sea'},
  //     LAND: {value: 2, description: 'Travel by Land'}
  //   },
  //   SPECIAL: {
  //     DOCK: {value: 1, description: 'Dock'}
  //   }
  // };
  //
  // FLAG_TYPE_TRAVEL = 0;
  // FLAG_TYPE_VISIBILITY = 1;

  @service constants;
  @service ('map') mapService;
  @service camera;
  @service sound;
  @service transport;
  @service gameboard;
  @service agent;
  @service ('hex') hexService;
  @service ('fieldOfView') fov;

  @tracked enemyToPlayerDistance = 0;
  @tracked enemyStatus = '';

  @tracked player = null;
  @tracked agents = emberArray();
  @tracked transports = emberArray();


  @tracked gameClockEnabled = true;
  @tracked showTileGraphics = true;
  @tracked showTileHexInfo = true;
  @tracked pathFindingDebug = false;
  @tracked showDebugLayer = true;
  @tracked showFieldOfViewLayer = true;

  gameStorage = storageFor('game')

  saveGame() {
    console.log('Saving game');
    // this.gameStorage.set(
    //   'foo', 'bar2'
    // );
    // let obj = {map: [1,2]}
    // let stringified = JSON.stringify(obj);
    // let encoded = window.btoa(stringified);
    // window.localStorage.setItem('gqmap', encoded);

    // let seenHexesJSON = JSON.stringify(this.mapService.mapSeenHexes);
    if (this.mapService.mapSeenHexes) {
      let seenHexesObj = {}
      this.mapService.mapSeenHexes.forEach((seenHexes, mapIndex) => {
        // console.log(mapIndex);
        // console.log(seenHexes);
        seenHexesObj[`${mapIndex}`] = [...seenHexes]
        // seenHexesObj.mapIndex = [...this.mapService.mapSeenHexes.get(mapIndex)]
      });
      let seenHexesJSON = JSON.stringify(seenHexesObj);
      window.localStorage.setItem('GQseenHexes', seenHexesJSON);
    }

  }

  get describePlayerFlags() {
    let descriptions = [];

    // TODO there is a better way to do this but I'm tired. :)
    if (this.playerHasTravelAbilityFlag(this.constants.FLAGS.TRAVEL.LAND)) {
      descriptions.push(this.constants.FLAGS.TRAVEL.LAND.description)
    }
    if (this.playerHasTravelAbilityFlag(this.constants.FLAGS.TRAVEL.SEA)) {
      descriptions.push(this.constants.FLAGS.TRAVEL.SEA.description)
    }
    return descriptions.join(', ');
  }

  playerHasTravelAbilityFlag(flag) {
    return this.playerHasAbilityFlag(this.constants.FLAG_TYPE_TRAVEL, flag);
  }

  playerHasVisibilityAbilityFlag(flag) {
    return this.playerHasAbilityFlag(this.constants.FLAG_TYPE_VISIBILITY, flag);
  }

  turnOnPlayerTravelAbilityFlag(flag) {
    if (this.player) {
      if(flag && flag.value) {
        flag = flag.value;
      }
      if(flag) {
        this.player.travelFlags |= flag;
      }
    }
  }

  turnOffPlayerTravelAbilityFlag(flag) {
    if (this.player) {
      if (flag && flag.value) {
        flag = flag.value;
      }
      if (flag) {
        this.player.travelFlags &= ~flag;
      }
    }
  }

  playerHasAbilityFlag(type, flag) {
    if (this.player) {
      if (flag && flag.value) {
        flag = flag.value;
      }
      if (flag) {
        switch (type) {
          case this.constants.FLAG_TYPE_TRAVEL:
            return this.player.travelFlags & flag
          case this.constants.FLAG_TYPE_VISIBILITY:
            return this.player.sightFlags & flag
          default:
            return this.player.travelFlags & flag
        }
      }
    }
    return false;
  }

  turnOnPlayerAbilityFlag(type, flag) {
    if (this.player) {
      if (flag && flag.value) {
        flag = flag.value;
      }
      if (flag) {
        switch (type) {
          case this.constants.FLAG_TYPE_TRAVEL:
            this.player.travelFlags |= flag;
            break;
          case this.constants.FLAG_TYPE_VISIBILITY:
            this.player.sightFlags |= flag;
            break;
          default:
            this.player.travelFlags |= flag;
            break;
        }
      }
    }
  }

  turnOffPlayerAbilityFlag(type, flag) {
    if (this.player) {
      if (flag && flag.value) {
        flag = flag.value;
      }
      if (flag) {
        switch (type) {
          case this.constants.FLAG_TYPE_TRAVEL:
            this.player.travelFlags &= ~flag;
            break;
          case this.constants.FLAG_TYPE_VISIBILITY:
            this.player.sightFlags &= ~flag;
            break;
          default:
            this.player.travelFlags &= ~flag;
            break;
        }
      }
    }
  }

  isOnForFlag(sourceFlags, targetFlag) {
    if(targetFlag && targetFlag.value) {
      targetFlag = targetFlag.value;
    }
    return sourceFlags & targetFlag;
  }

  boardTransport(transportName) {
    this.turnOffPlayerTravelAbilityFlag(this.constants.FLAGS.TRAVEL.LAND);
    this.turnOnPlayerTravelAbilityFlag(this.constants.FLAGS.TRAVEL.SEA);
    this.player.boardedTransport = this.transport.findTransportByName(transportName);
  }

  disembarkTransportToHex(targetHex) {
    this.turnOffPlayerTravelAbilityFlag(this.constants.FLAGS.TRAVEL.SEA);
    this.turnOnPlayerTravelAbilityFlag(this.constants.FLAGS.TRAVEL.LAND);
    this.player.boardedTransport = null;
    // this.player.hex = targetHex.mapObject || targetHex;
    this.player.hex = targetHex;
  }

  @task
  *gameClock() {
    while (this.gameClockEnabled === true) {
      yield timeout(1000);
      console.log('game tick');
    }
  }

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
      this.agent.playerInRange(transport);
    }
  }

    // adjust enemy opacity based on range of player and obscured hexes
  updateEnemyOpacityForRangeAndObscurity(transport, targetHex) {
    // console.log('updateEnemyOpacityForRangeAndObscurity', transport);
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
          minDistanceForHit:weapon.minDistanceForHit,
          type: weapon.type,
          x: startPoint.x,
          y: startPoint.y,
          radius: 4,
          fill: 'black',
          draggable: false,
          opacity: 1,
          listening: false
        });
        break;
      case 'arrow':
        arrowLenX = targetAngle.cos * 3;
        arrowLenY = targetAngle.sin * 3;
        targetAngle.maxX -= arrowLenX;  // don't go passed target
        targetAngle.maxY -= arrowLenY;

        projectile = new Konva.Arrow({
          minDistanceForHit:weapon.minDistanceForHit,
          type: weapon.type,
          points: [
            startPoint.x,
            startPoint.y,
            startPoint.x + arrowLenX,
            startPoint.y + arrowLenY,
          ],
          stroke: '#8e551b',  // brown
          pointerLength: 4,
          pointerWidth: 4,
          strokeWidth: 3,
          draggable: false,
          listening: false
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

  onBeforeMovePlayer(targetHex) {
    if (targetHex.actions && targetHex.actions.b) {
      return this.performHexAction(targetHex, targetHex.actions.b.id)  // before
    }
  }
  onAfterMovePlayer(targetHex) {
    if (targetHex.actions && targetHex.actions.a) {
      return this.performHexAction(targetHex, targetHex.actions.a.id)  // after
    }
  }

  performHexAction(targetHex, actionId) {
    switch (actionId) {
      case 1:
        console.log('action 1');
        break;
      case 2:
        console.log('action 2: loadmap after move', targetHex.actions.loadmap);
        this.mapService.loadMap(targetHex.actions.loadmap);
        break;
      case 10:
        console.log('action 10:', targetHex.actions.cache);
        alert(`You found cache ${targetHex.actions.cache}`);
        break;
      default:
        break;
    }
  }
}
