import { BaseAgentModel } from './base-agent';
// import {attr} from '@ember-data/model';
// import { Point } from '../objects/point'

export default class TransportModel extends BaseAgentModel {
  // @attr name;
  // @attr({ defaultValue: 2 }) type; // PLAYER:0, ENEMY:1, TRANSPORT:2
  // @attr opacity;
  // @attr startHex;
  // @attr agentImage;
  // @attr agentImageSize;
  // @attr siteRange;
  // @attr opacity;
  // @attr armor;
  // @attr maxPower;
  // @attr respawnTime;
  // @attr healingSpeed;
  // @attr healingPower;
  // @attr agentImage;
  // @attr agentImageSize;
  // @attr sightRange;
  // @attr speed;
  // @attr patrol;
  // @attr currentWaypoint;
  // @attr state;
  // @attr maxHitPoints;
  // @attr currentHitPoints;
  // @attr currentPower;
  // @attr({ defaultValue: 0 }) travelFlags;
  // @attr({ defaultValue: 0 }) sightFlags;
  // @attr initialFlags;

  // @hasMany('weapon', {async: true}) weapons;

  fire(targetHex) {
  // fire(mousecoords) {
    console.log('Fire!');

    if (!this.weapons || this.weapons.length === 0) {
      console.log('no weapons');
      return;
    }

    // let weapon = this.weapons[0];
    let weapon = this.weapons.firstObject;
    if (!this.agent.canFireWeapon(this, weapon.poweruse)) {
      console.log('no power!');
      return
    }

    if (this.agent.fireWeapon.isRunning) {
      console.log('waiting to reload');
      return;
    }

    let startPoint = this.point;

    // let mousecoords = this.gameboard.getMousePointerPosition()
    // let targetPoint = new Point({x:mousecoords.x, y:mousecoords.y}); // harder to aim

    // this.fireWeapon.perform(weapon, startPoint, targetPoint);

    let targetPoint = targetHex.point;

    this.agent.fireWeapon.perform(this, weapon, startPoint, targetPoint);

  }
}
