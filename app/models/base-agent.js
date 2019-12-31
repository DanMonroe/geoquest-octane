import Model, {attr, hasMany} from '@ember-data/model';
import { Point } from '../objects/point'
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import {task} from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';

export class BaseAgentModel extends Model {

  @service agent;
  @service constants;
  @service game;
  @service ('map') mapService;

  @attr name;
  @attr type; // PLAYER:0, ENEMY:1, TRANSPORT:2
  @attr opacity;
  @attr startHex;
  @attr({ defaultValue: 2 }) armor;
  @attr maxPower;
  @attr({ defaultValue: 5000 }) healingSpeed;
  @attr({ defaultValue: 1 }) healingPower;
  @attr agentImage;
  @attr agentImageSize;
  @attr sightRange;
  @attr speed;
  @attr patrol;
  @attr currentWaypoint;
  @attr state;
  @attr maxHitPoints;
  @attr currentHitPoints;
  @attr currentPower;
  @attr({ defaultValue: 0 }) travelFlags;
  @attr({ defaultValue: 0 }) sightFlags;
  @attr({ defaultValue: 0 }) specialFlags;
  // @attr miniMapPlayerCircle;

  @attr respawnTime;
  @attr pursuitSpeed;
  @attr aggressionSpeed;
  @attr patrolMethod;

  @hasMany('weapon', {async: false}) weapons;

  @tracked hex;

  get point() {
    if (this.mapService && this.mapService.currentLayout) {
      // return this.hex.point;
      return this.mapService.currentLayout.hexToPixel(this.hex);
    }
    return new Point({x: 0, y: 0});
  }

  @task
  *reloadPower(weapon) {
    while (this.currentPower < this.maxPower) {
      // console.log('reloading power', this.currentPower, weapon.reloadDelay);
      yield timeout(weapon.reloadDelay);
      this.currentPower += Math.max(1, (weapon.poweruse / 3));  // weapon.power?
      this.agent.updatePowerBar(this);
    }
  }

  @task
  *reloadHealth() {
    while (this.currentHitPoints < this.maxHitPoints) {
// console.log('this.healingPower', this.healingPower);
      yield timeout(this.healingSpeed);
      this.currentHitPoints += Math.max(1, this.healingPower);
      this.agent.updateHealthBar(this);
    }
  }

}
