import { BaseAgent } from './base-agent';
import Konva from 'konva';
import { timeout } from 'ember-concurrency';
import {task} from 'ember-concurrency-decorators';
import { isPresent } from '@ember/utils';

export class Enemy extends BaseAgent {

  constructor(args) {
    super(...arguments);
    this.type = BaseAgent.AGENTTYPES.ENEMY;

    let agent = args.agent;
    this.initialAgent = args.agent;
    this.mapService = args.mapService;
    this.camera = args.camera;
    this.game = args.game;
    this.transportService = args.transportService;
    this.gameboard = args.gameboard;
    this.maxHitPoints = agent.maxHitPoints || 20;
    this.currentHitPoints = agent.currentHitPoints || 20;
    this.healingSpeed = agent.healingSpeed || 5000;
    this.healingPower = agent.healingPower || 1;

    this.hexLayout = this.game.mapService.currentLayout;

    let startHex = this.setStartHex(agent.startHex);

    // let startPoint = this.mapService.currentLayout.hexToPixel(startHex);
    this.id = agent.id;
    // this.id = agent.index;
    this.name = agent.name;
    this.startHex = startHex;
    this.hex = startHex;
    this.maxPower = args.maxPower || 25;
    this.armor = args.armor | 2;
    this.respawnTime = agent.respawnTime | 5000;
    this.state = agent.state; // state machine - see notes.md
    this.patrolMethod = agent.patrolMethod;
    this.travelFlags = agent.travelFlags;
    this.sightFlags = agent.sightFlags;
    this.specialFlags = agent.specialFlags;

    this.reset(agent);

    this.buildDisplayGroup(agent);
  }

  reset(agent) {
    this.agentImage = `/images/${agent.agentImage}`;
    this.agentImageSize = agent.agentImageSize;
    this.sightRange = agent.sightRange;
    this.speed = agent.speed;
    this.pursuitSpeed = agent.pursuitSpeed;
    this.aggressionSpeed = agent.aggressionSpeed;
    this.patrol = agent.patrol;
    this.currentWaypoint = -1;
    this.maxHitPoints = agent.maxHitPoints || 20;
    this.currentHitPoints = agent.maxHitPoints || 20;
    this.currentPower = this.maxPower | 25;
    this.weapons = agent.weapons;
  }

  buildDisplayGroup(agent) {

    this.imageGroup = new Konva.Group({
      x: this.point.x,
      y: this.point.y,
      opacity: agent.opacity
    });
    this.imageGroup.name(`agent${this.id}`);

    let healthBar = new Konva.Rect({
      id: 'hp' + this.id,
      x: -15,
      y: 13,
      width: 30 * (this.healthPercentage/100),
      height: 4,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 1,
      listening: false
    });

    let image = new Image();
    image.src = this.agentImage;

    // x: this.point.x - (this.agentImageSize / 2),
    // y: this.point.y - (this.agentImageSize / 2) - 5,
    image.onload = () => {
      this.imageObj = new Konva.Image({
        id: "agent" + agent.id,
        // id: "agent" + agent.index,
        x: -(this.agentImageSize / 2),
        y: -(this.agentImageSize / 2) - 20,
        image: image,
        width: this.agentImageSize,
        height: this.agentImageSize
      });

      let agentsLayer = this.game.camera.getAgentsLayer();
      this.imageGroup.add(this.imageObj,healthBar);
      healthBar.moveToBottom();
      agentsLayer.add(this.imageGroup);
      agentsLayer.draw();
    };
  }

  playerInRange() {
    // console.log(`Player in Range for ${this.name}`);

    this.state = BaseAgent.STATE.MISSILE;

    if(this.patrolMethod === 'static') {
      if (this.engagePlayer.isIdle) {
        this.engagePlayer.perform();
      }
    } else {

      // cancel any patrolling for this enemy
      this.game.transport.removeAgentFromMoveQueue(this);

      // Fire and pursue
      if (this.engagePlayer.isIdle) {
        this.engagePlayer.perform();
      }
      if (this.chasePlayer.isIdle) {
        this.chasePlayer.perform();
      }
    }
  }

  playerOutOfRange() {
    // console.log(`Player out of Range for ${this.name}`);

    // cancel any patrolling for this enemy
    // this.transportService.removeAgentFromMoveQueue(this);

    // Strop Firing and pursuing
    // this.engagePlayer.cancelAll();
    // this.chasePlayer.cancelAll();
    this.state = BaseAgent.STATE.PATROL; // or PATROL
    // this.state = BaseAgent.STATE.SEARCHING; // or PATROL

    if (isPresent(this.patrol) > 0) {

      this.game.transport.pushTransportWaypointToMoveQueue(this)
    }

  }

  @task
  *engagePlayer() {
    // and player is still alive
    while(this.state === BaseAgent.STATE.MISSILE) {
      this.fireProjectile.perform();
      yield timeout(this.aggressionSpeed);
    }
  };

  @task
  *chasePlayer() {
    // and player is still alive
    while(this.state === BaseAgent.STATE.MISSILE) {
      let pathDistanceToShipHex = this.game.mapService.findPathEmberData(this.mapService.allHexesMap, this.hex, this.game.player.hex, {agent: this});
      // let pathDistanceToShipHex = this.game.mapService.findPath(this.mapService.worldMap, this.hex, this.game.player.hex);

      if (isPresent(pathDistanceToShipHex)) {
        // TODO if pathDistanceToShipHex === 0, switch to MELEE ?
        if  (pathDistanceToShipHex.length > this.sightRange) {
          this.playerOutOfRange();
        } else if (pathDistanceToShipHex.length > 1) {  // don't move the enemy on top of ship
          this.game.transport.moveTransportToHex(this, pathDistanceToShipHex[0]);
        }
      } else {
        this.playerOutOfRange();
      }
      yield timeout(this.pursuitSpeed);
    }
  };

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
    if (!this.canFireWeapon(weapon.poweruse)) {
      // console.log('no power!');
      return
    }

    if (this.fireWeapon.isRunning) {
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

      this.fireWeapon.perform(weapon, startPoint, targetPoint);
    }
  };

  checkForEnemiesHitByProjectile(anim, projectile) {
    // this.transportService.agents.forEach((agent) => {
    let distance;
    switch(projectile.attrs.type) {
      case 'arrow':
        distance = Math.sqrt( Math.pow((this.game.player.point.x - (projectile.attrs.points[0] + projectile.attrs.x)),2) + Math.pow((this.game.player.point.y - (projectile.attrs.points[1]+projectile.attrs.y)),2));
        break;
      case 'cannon':
        distance = Math.sqrt( Math.pow((this.game.player.point.x - projectile.attrs.x),2) + Math.pow((this.game.player.point.y - projectile.attrs.y),2));
        break;
      default:
        return;
    }

    // console.log(`distance:`, distance, projectile);

    // debugger;
    if (distance < projectile.attrs.minDistanceForHit) {
    // if (distance < 10) {
    //   debugger;
      console.log('Player Hit!');
      if (this.game.player.boardedTransport !== null) {
        this.game.player.boardedTransport.currentHitPoints -= projectile.damage;
        this.game.player.boardedTransport.updateHealthBar();
      } else {
        this.game.player.currentHitPoints -= projectile.damage;
        this.game.player.updateHealthBar();
      }

      anim.stop();
      projectile.remove();
      // console.groupEnd()
    }
    // })
  }

  updateHealthBar() {
    // console.log('enemy updatehealthbar');
    let bar = this.imageGroup.getChildren((node) =>{
      return node.attrs && node.attrs.id === 'hp' + this.id;
    });
    if (bar) {
      bar.width( 30 * (this.healthPercentage/100) );
      bar.fill(this.healthPercentage < 25 ? 'red' : 'green')
      this.game.camera.getAgentsLayer().draw();
// console.log('this.healthPercentage', this.healthPercentage);
      if (this.healthPercentage <= 0) {
        console.log(`${this.name} dead!`);
        // debugger;
        // TODO do death functions:
        // remove from map
        // award experience
        // drop treasure?  Treasure disappears after a while ?
        this.death.perform();
        return;
      }
    }
    if (this.reloadHealth.isIdle && this.healthPercentage <= 100) {
      this.reloadHealth.perform();
    }
  }

  @task
  *death() {
    console.log('dead and gone.');
    if (this.fireProjectile.isRunning) {
      this.fireProjectile.cancelAll();
    }
    if (this.engagePlayer.isRunning) {
      this.engagePlayer.cancelAll();
    }
    this.game.transport.removeAgentFromMoveQueue(this);

    this.imageGroup.to({opacity: 0});

    this.hex = this.startHex;

    console.log('respawn start');

    yield timeout(this.respawnTime);   // TODO get this time from somewhere

    console.log('respawning');
    this.reset(this.initialAgent);
    this.updateHealthBar();

    this.game.transport.pushTransportWaypointToMoveQueue(this);
  };

}

