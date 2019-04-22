import { tracked } from '@glimmer/tracking';
import { Point } from '../point'
import { task, timeout } from 'ember-concurrency';

export class BaseAgent {
  // @tracked hexLayout = null;
  // @tracked hex = null;

  static AGENTTYPES = {
    PLAYER: 0,
    ENEMY: 1,
    TRANSPORT: 2
  };

  type = null;

  @tracked hex = null;

  get point() {
    if (this.mapService && this.mapService.currentLayout) {
      return this.mapService.currentLayout.hexToPixel(this.hex);
    }
    return new Point({x: 0, y: 0});
  }
  agentImage = null;
  sightRange = 1;
  speed = null;
  patrol = null;
  currentWaypoint = -1;

  @tracked maxHitPoints;
  @tracked currentHitPoints;
  @tracked maxPower;
  @tracked currentPower;

  @tracked mapService = null;
  @tracked camera = null;
  @tracked game = null;
  @tracked transportService;
  @tracked gameboard;

  @tracked travelAbilityFlags = 0;

  canFireWeapon(powerRequirement) {
    return this.currentPower >= powerRequirement;
  }

  get healthPercentage() {
    if (!this.currentHitPoints || this.currentHitPoints <= 0) {
      return 0;
    }

    let healthPercentage = Math.round((this.currentHitPoints / this.maxHitPoints) * 100);

    return Math.min(healthPercentage, 100);
  }

  updateHealthBar() {
    let bar = this.imageGroup.getChildren((node) =>{
      return node.attrs && node.attrs.id === 'hp';
    });
    if (bar) {
      // console.log('this.healthPercentage', this.healthPercentage);
      bar.width( 30 * (this.healthPercentage/100) );
      bar.fill(this.healthPercentage < 25 ? 'red' : 'green')
      this.camera.getAgentsLayer().draw();

      if (this.healthPercentage <= 0) {
        console.log(`${this.name} dead!`);
      }
    }
  }

  get powerPercentage() {
    if (!this.currentPower || this.currentPower <= 0) {
      return 0;
    }

    let power = Math.round((this.currentPower / this.maxPower) * 100);

    let powerPercentage = Math.min(power, 100);

    return powerPercentage;
  }

  updatePowerBar() {
    let bar = this.imageGroup.getChildren((node) =>{
      return node.attrs && node.attrs.id === 'power';
    });
    if (bar) {
      // console.log('this.healthPercentage', this.healthPercentage);
      bar.width( 30 * (this.powerPercentage/100) );
      bar.fill('blue')
      this.camera.getAgentsLayer().draw();
    }
  }

  @task( function*(weapon) {
    while (this.currentPower < this.maxPower) {
      // console.log('reloading power', this.currentPower, weapon.reloadDelay);
      yield timeout(weapon.reloadDelay);
      this.currentPower += 1;  // weapon.power?
      this.updatePowerBar();
    }
  }) reloadPower;
}
