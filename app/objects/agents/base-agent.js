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
  startHex = null;
  initialAgent = null;
  respawnTime = null;

  @tracked maxHitPoints;
  @tracked currentHitPoints;
  @tracked maxPower;
  @tracked currentPower;
  @tracked healingSpeed;
  @tracked healingPower;

  @tracked mapService = null;
  @tracked camera = null;
  @tracked game = null;
  @tracked transportService;
  @tracked gameboard;

  @tracked travelAbilityFlags = 0;
  @tracked state = BaseAgent.STATE.IDLE;

  setStartHex(agentStart){
    let startHex = this.game.mapService.hexMap.find((hex) => {
      if (!hex) {
        return false;
      }
      return (agentStart.Q === hex.q) && (agentStart.R === hex.r)
      // return (agentStart.Q === hex.q) &&
      //   (agentStart.R === hex.r) &&
      //   (agentStart.S === hex.s)
    });

    if (!startHex) {
      console.error("Could not find agent start hex.  Setting to first one in map");
      // TODO this probably should never happen
      startHex = this.game.mapService.hexMap[0];
    }
    return startHex;
  }

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
      this.game.camera.getAgentsLayer().draw();
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

  @task( function*() {
    while (this.currentHitPoints < this.maxHitPoints) {
// console.log('this.healingPower', this.healingPower);
      yield timeout(this.healingSpeed);
      this.currentHitPoints += Math.max(1, this.healingPower);
      this.updateHealthBar();
    }
  }) reloadHealth;

  @task( function*(weapon, startPoint, targetPoint, whoFiredType) {

    this.imageGroup.to({opacity: 1});

    let projectile = this.game.buildProjectile(weapon, startPoint, targetPoint);

    let layer = this.game.camera.getAgentsLayer();
    layer.add(projectile);

    projectile.moveToTop();

    let newX = projectile.getX();
    let newY = projectile.getY();

    let sumX = 0;
    let sumY = 0;

    let anim = new Konva.Animation(() => {
      newX += projectile.cos;
      newY += projectile.sin;
      projectile.position({x:newX, y:newY});
      sumX += projectile.deltaX;
      sumY += projectile.deltaY;

      // change/implement max firing distance of current cannon in use
      if((sumX >= projectile.maxX) || (sumY >= projectile.maxY)) {
        anim.stop();
        projectile.remove();
      }

      // did we hit something?
      this.checkForEnemiesHitByProjectile(anim, projectile);
    }, layer);
    anim.start();

    this.game.sound.playSound(weapon.sound);

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
