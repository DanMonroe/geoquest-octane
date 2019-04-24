import { tracked } from '@glimmer/tracking';
import { Point } from '../point'
import Konva from 'konva';
import { task, timeout } from 'ember-concurrency';

export class BaseAgent {
  // @tracked hexLayout = null;
  // @tracked hex = null;

  static AGENTTYPES = {
    PLAYER: 0,
    ENEMY: 1,
    TRANSPORT: 2
  };

  // see notes.md
  static STATE = {
    IDLE: 0,
    PATROL: 1,
    MELEE: 2,
    MISSILE: 3,
    SEARCHING: 4,
    FLEEING: 5,
    FINDHELP: 6
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
  aggressionSpeed = null;
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
  @tracked state = BaseAgent.STATE.IDLE;

  canFireWeapon(powerRequirement) {
    // console.log('canFire', this.currentPower, powerRequirement);
    return this.currentPower >= powerRequirement;
  }

  get healthPercentage() {
    if (!this.currentHitPoints || this.currentHitPoints <= 0) {
      return 0;
    }

    let healthPercentage = Math.round((this.currentHitPoints / this.maxHitPoints) * 100);

    let health = Math.min(healthPercentage, 100);
    // console.log('healthPercentage', this.currentHitPoints, health);
    return health;
  }

  updateHealthBar() {
    // console.log('base updateHealthBar');
  //   let bar = this.imageGroup.getChildren((node) =>{
  //     return node.attrs && node.attrs.id === 'hp';
  //   });
  //   if (bar) {
  //     // console.log('this.healthPercentage', this.healthPercentage);
  //     bar.width( 30 * (this.healthPercentage/100) );
  //     bar.fill(this.healthPercentage < 25 ? 'red' : 'green')
  //     this.camera.getAgentsLayer().draw();
  //
  //     if (this.healthPercentage <= 0) {
  //       console.log(`${this.name} dead!`);
  //       debugger;
  //       // TODO do death functions:
  //         // remove from map
  //         // award experience
  //         // drop treasure?  Treasure disappears after a while ?
  //     }
  //   }
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
      this.currentPower += Math.max(1, (weapon.poweruse / 3));  // weapon.power?
      this.updatePowerBar();
    }
  }) reloadPower;

  @task( function*(weapon, startPoint, targetPoint, whoFiredType) {
    let cannonballSpeed = 3;
    // let startPoint = this.point;
    // let mousecoords = this.gameboard.getMousePointerPosition()
    // let targetHex = this.gameboard.getHexAtMousePoint(mousecoords);
    // let targetPoint = this.mapService.currentLayout.hexToPixel(targetHex);

    let angle = Math.atan2(targetPoint.y - startPoint.y, targetPoint.x - startPoint.x);
    let sin = Math.sin(angle) * cannonballSpeed; // Y change
    let cos = Math.cos(angle) * cannonballSpeed; // X change
    let maxX = Math.abs(targetPoint.x - startPoint.x)
    let maxY = Math.abs(targetPoint.y - startPoint.y)

    // console.log('target', targetPoint);
    // console.log('lineDistance', lineDistance);
    // console.log('segmentDistance', segmentDistance);
    // console.log('angle', angle);
    // console.log('sin', sin);
    // console.log('cos', cos);
    // console.log('maxX', maxX);
    // console.log('maxY', maxY);

    let cannonball = new Konva.Circle({
      x: startPoint.x,
      y: startPoint.y,
      radius: 4,
      fill: 'black',
      draggable: true,
      opacity: 1
    });
    // custom property
    cannonball.velocity = {
      x: 0,
      y: 0
    };
    cannonball.damage = weapon.damage;

    let layer = this.camera.getAgentsLayer();
    layer.add(cannonball);

    let newX = cannonball.getX();
    let newY = cannonball.getY();

    let sumX = 0;
    let sumY = 0;
    let deltaX = Math.abs(cos);
    let deltaY = Math.abs(sin);

    let anim = new Konva.Animation(() => {
      newX += cos;
      newY += sin;

      cannonball.position({x:newX, y:newY});

      sumX += deltaX;
      sumY += deltaY;

      // change/implement max firing distance of current cannon in use
      if((sumX >= maxX) || (sumY >= maxY)) {
        anim.stop();
        cannonball.remove();
      }

      // did we hit something?
      this.checkForEnemiesHitByProjectile(anim, cannonball);

    }, layer);

    anim.start();

    this.currentPower -= weapon.poweruse;
    if (whoFiredType === BaseAgent.AGENTTYPES.PLAYER) {
      this.updatePowerBar();
    }
    if(this.currentPower < 100 && this.reloadPower.isIdle) {
      this.reloadPower.perform(weapon);
    }

    return yield timeout(weapon.fireDelay);

  }) fireWeapon;
}
