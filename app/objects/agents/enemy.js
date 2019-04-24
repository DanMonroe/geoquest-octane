import { BaseAgent } from './base-agent';
import Konva from 'konva';
import { task, timeout } from 'ember-concurrency';
import { isPresent } from '@ember/utils';

export class Enemy extends BaseAgent {

  constructor(args) {
    super(...arguments);
    this.type = BaseAgent.AGENTTYPES.ENEMY;

    let agent = args.agent;
    this.mapService = args.mapService;
    this.camera = args.camera;
    this.game = args.game;
    this.transportService = args.transportService;
    this.gameboard = args.gameboard;
    this.maxHitPoints = agent.maxHitPoints || 20;
    this.currentHitPoints = agent.currentHitPoints || 20;


    let startHex = this.mapService.hexMap.find((hex) => {
      if (!hex) {
        return false;
      }
      return (agent.start.Q === hex.q) &&
        (agent.start.R === hex.r) &&
        (agent.start.S === hex.s)
    });

    if (!startHex) {
      console.error("Could not find agent start hex.  Setting to first one in map");
      // TODO this probably should never happen
      startHex = this.mapService.hexMap[0];
    }

    // let startPoint = this.mapService.currentLayout.hexToPixel(startHex);

    this.id = agent.index;
    this.name = agent.name;
    this.hex = startHex;
    // this.point = startPoint;
    this.agentImage = `/images/transports/${agent.img}`;
    this.agentImageSize = agent.imgSize;
    this.sightRange = agent.sightRange;
    this.speed = agent.speed;
    this.pursuitSpeed = agent.pursuitSpeed;
    this.aggressionSpeed = agent.aggressionSpeed;
    this.patrol = agent.patrol;
    this.currentWaypoint = -1;
    this.state = agent.state; // state machine - see notes.md
    this.hexLayout = this.mapService.currentLayout;
    this.maxHitPoints = agent.maxHitPoints || 20;
    this.currentHitPoints = agent.currentHitPoints || 20;
    this.maxPower = args.maxPower || 25;
    this.currentPower = args.currentPower | 25;
    this.armor = args.armor | 2;
    this.weapons = agent.weapons;


    this.buildDisplayGroup(agent);
  }

  buildDisplayGroup(agent) {

    this.imageGroup = new Konva.Group({
      x: this.point.x,
      y: this.point.y,
      opacity: agent.opacity
    });

    let healthBar = new Konva.Rect({
      id: 'hp' + this.id,
      x: -15,
      y: 13,
      width: 30 * (this.healthPercentage/100),
      height: 4,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 1
    });

    let image = new Image();
    image.src = this.agentImage;

    // x: this.point.x - (this.agentImageSize / 2),
    // y: this.point.y - (this.agentImageSize / 2) - 5,
    image.onload = () => {
      this.imageObj = new Konva.Image({
        id: "agent" + agent.index,
        x: -(this.agentImageSize / 2),
        y: -(this.agentImageSize / 2) - 5,
        image: image,
        width: this.agentImageSize,
        height: this.agentImageSize
      });

      let agentsLayer = this.camera.getAgentsLayer();
      this.imageGroup.add(healthBar, this.imageObj);
      agentsLayer.add(this.imageGroup);
      agentsLayer.draw();
    };
  }

  playerInRange() {
    // console.log(`Player in Range for ${this.name}`);

    // cancel any patrolling for this enemy
    this.transportService.removeAgentFromMoveQueue(this);

    // Fire and pursue
    this.state = BaseAgent.STATE.MISSILE;
    this.engagePlayer.perform();
    this.chasePlayer.perform();
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

      this.transportService.pushTransportWaypointToMoveQueue(this)
    }

  }

  @task( function*() {
    // and player is still alive
    while(this.state === BaseAgent.STATE.MISSILE) {
      this.fireProjectile.perform();
      yield timeout(this.aggressionSpeed);
    }
  }) engagePlayer;

  @task( function*() {
    // and player is still alive
    while(this.state === BaseAgent.STATE.MISSILE) {
      let pathDistanceToShipHex = this.mapService.findPath(this.mapService.worldMap, this.hex, this.game.player.hex);

      if (isPresent(pathDistanceToShipHex) && pathDistanceToShipHex.length <= this.sightRange) {
        this.transportService.moveTransportToHex(this, pathDistanceToShipHex[0]);
      } else {
        // TODO if pathDistanceToShipHex === 0, switch to MELEE ?
        this.playerOutOfRange();
      }
      yield timeout(this.pursuitSpeed);
    }
  }) chasePlayer;

  @task( function*() {
    // console.log('Enemy Fire!');

    if (!this.weapons || this.weapons.length === 0) {
      // console.log('no weapons');
      return;
    }

    let weapon = this.weapons[0];
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
      let targetPoint = this.mapService.currentLayout.hexToPixel(playerTargetHex);

      this.fireWeapon.perform(weapon, startPoint, targetPoint);
    }
  }) fireProjectile;

  checkForEnemiesHitByProjectile(anim, projectile) {
    // this.transportService.agents.forEach((agent) => {

    let distance = Math.sqrt( Math.pow((this.game.player.point.x - projectile.attrs.x),2) + Math.pow((this.game.player.point.y - projectile.attrs.y),2));

    // console.log(`agent ${agent.name} to cannonball distance:`, distance, agent);

    if (distance < 10) {
      console.log('Player Hit!');
      this.game.player.boardedTransport.currentHitPoints -= projectile.damage;
      this.game.player.boardedTransport.updateHealthBar();

      anim.stop();
      projectile.remove();
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
      this.camera.getAgentsLayer().draw();

      if (this.healthPercentage <= 0) {
        console.log(`${this.name} dead!`);
        // debugger;
        // TODO do death functions:
        // remove from map
        // award experience
        // drop treasure?  Treasure disappears after a while ?
      }
    }
  }

}

