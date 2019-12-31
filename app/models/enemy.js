import { BaseAgentModel } from './base-agent';
import {task} from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';
import { isPresent } from '@ember/utils';

// import {attr} from '@ember-data/model';
// import { Point } from '../objects/point'

export default class EnemyModel extends BaseAgentModel {
  // @attr name;
  // @attr({ defaultValue: 1 }) type; // PLAYER:0, ENEMY:1, TRANSPORT:2
  // @attr opacity;
  // @attr hex;
  // @attr startHex;
  // @attr armor;
  // @attr respawnTime;
  // @attr maxPower;
  // @attr healingSpeed;
  // @attr healingPower;
  // @attr agentImage;
  // @attr agentImageSize;
  // @attr sightRange;
  // @attr speed;
  // @attr pursuitSpeed;
  // @attr aggressionSpeed;
  // @attr patrolMethod;
  // @attr patrol;
  // @attr currentWaypoint;
  // @attr state;
  // @attr maxHitPoints;
  // @attr currentHitPoints;
  // @attr currentPower;
  // @attr({ defaultValue: 0 }) travelFlags;
  // @attr({ defaultValue: 0 }) sightFlags;
  // @attr initialFlags;

  // @hasMany('weapon', {async: false}) weapons;

  @task
  *engagePlayer() {
    // and player is still alive
    while(this.state === this.constants.STATE.MISSILE) {
      this.fireProjectile.perform();
      yield timeout(this.aggressionSpeed);
    }
  }

  @task
  *chasePlayer() {
    // and player is still alive
    while(this.state === this.constants.STATE.MISSILE) {
      let pathDistanceToShipHex = this.mapService.findPath(this.mapService.allHexesMap, this.hex, this.game.player.hex, {agent: this});
      // let pathDistanceToShipHex = this.game.mapService.findPath(this.mapService.worldMap, this.hex, this.game.player.hex);

      if (isPresent(pathDistanceToShipHex)) {
        // TODO if pathDistanceToShipHex === 0, switch to MELEE ?
        if  (pathDistanceToShipHex.length > this.sightRange) {
          this.agent.playerOutOfRange(this);
        } else if (pathDistanceToShipHex.length > 1) {  // don't move the enemy on top of ship
          this.game.transport.moveTransportToHex(this, pathDistanceToShipHex[0]);
        }
      } else {
        this.agent.playerOutOfRange(this);
      }
      yield timeout(this.pursuitSpeed);
    }
  }

  @task
  *fireProjectile() {
    console.log('Enemy Fire!');
    // if (this.game.player.boardedTransport === null) {
    // not on ship
    // return;
    // }

    if (!this.weapons || this.weapons.length === 0) {
      // console.log('no weapons');
      return;
    }

    // let weapon = this.weapons[0];
    let weapon = this.weapons.firstObject;
    if (!this.agent.canFireWeapon(this, weapon.poweruse)) {
      // console.log('no power!');
      return
    }

    if (this.agent.fireWeapon.isRunning) {
      // console.log('waiting to reload - 1');
      // yield waitForProperty(this, 'fireWeapon.isIdle');
      // console.log('done waiting - fire!');
      return;
    }

    if (this.hex) {
      let startPoint = this.point;
      let playerTargetHex = this.game.player.hex;
      let targetPoint = playerTargetHex.point;
      // let targetPoint = this.game.mapService.currentLayout.hexToPixel(playerTargetHex);

      yield this.agent.fireWeapon.perform(this, weapon, startPoint, targetPoint);
    }
  }

}
