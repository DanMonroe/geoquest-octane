import { BaseAgent } from './base-agent';
import Konva from 'konva';
import { Point } from '../point';
import { timeout, waitForProperty } from 'ember-concurrency';
import {task} from 'ember-concurrency-decorators';


export class Transport extends BaseAgent {

  constructor(args) {
    super(...arguments);
    this.type = BaseAgent.AGENTTYPES.TRANSPORT;

    let agent = args.agent;
    this.initialAgent = args.agent;
    this.mapService = args.mapService;
    this.camera = args.camera;
    this.game = args.game;
    this.transportService = args.transportService;
    this.gameboard = args.gameboard;

    let startHex = this.setStartHex(agent.startHex);
    this.hexLayout = this.game.mapService.currentLayout;

    // this.id = agent.index;
    this.id = agent.id;
    this.name = agent.name;
    this.hex = startHex;
    this.startHex = startHex;
    // this.point = startPoint;
    this.armor = args.armor | 2;
    this.maxPower = args.maxPower || 25;
    this.healingSpeed = agent.healingSpeed || 5000;
    this.healingPower = agent.healingPower || 1;

    this.reset(agent);

    this.buildDisplayGroup(agent);
  }

  reset(agent) {
    this.agentImage = `/images/${agent.agentImage}`;
    this.agentImageSize = agent.agentImageSize;
    this.sightRange = agent.sightRange;
    this.speed = agent.speed;
    this.patrol = agent.patrol;
    this.currentWaypoint = -1;
    this.state = agent.state
    this.maxHitPoints = agent.maxHitPoints || 20;
    // this.currentHitPoints = 3;
    this.currentHitPoints = agent.maxHitPoints || 20;
    this.currentPower = this.maxPower | 25;

    this.weapons = agent.weapons;
  }

  buildDisplayGroup(agent) {

    this.imageGroup = new Konva.Group({
      x: this.point.x,
      y: this.point.y
    });
    this.imageGroup.name(`transport${this.id}`);

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

    let powerBar = new Konva.Rect({
      id: 'power',
      x: -15,
      y: 17,
      width: 30 * (this.powerPercentage/100),
      height: 4,
      fill: 'blue',
      stroke: 'black',
      strokeWidth: 1
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
        y: -(this.agentImageSize / 2) - 5,
        image: image,
        opacity: agent.opacity,
        width: this.agentImageSize,
        height: this.agentImageSize
      });

      let agentsLayer = this.game.camera.getAgentsLayer();
      this.imageGroup.add(this.imageObj, healthBar, powerBar);
      healthBar.moveToBottom();
      powerBar.moveToBottom();
      agentsLayer.add(this.imageGroup);
      // agentsLayer.add(this.imageObj);
      agentsLayer.draw();
      // this.camera.stage.draw();
    };
  }

  fire(mousecoords) {
    console.log('Fire!');

    if (!this.weapons || this.weapons.length === 0) {
      console.log('no weapons');
      return;
    }

    // let weapon = this.weapons[0];
    let weapon = this.weapons.firstObject;
    if (!this.canFireWeapon(weapon.poweruse)) {
      console.log('no power!');
      return
    }

    if (this.fireWeapon.isRunning) {
      console.log('waiting to reload');
      return;
    }

    let startPoint = this.point;
    // let mousecoords = this.gameboard.getMousePointerPosition()
    let targetPoint = new Point({x:mousecoords.x, y:mousecoords.y}); // harder to aim
    // let targetHex = this.gameboard.getHexAtMousePoint(mousecoords);   // center of hex
    // let targetPoint = this.mapService.currentLayout.hexToPixel(targetHex);  // center of hex

    this.fireWeapon.perform(weapon, startPoint, targetPoint);
  }


  // checkForEnemiesHitByProjectile(anim, projectile) {
  //   if (this.game.agents) {
  //     this.game.agents.forEach((agent) => {
  //       let distance = Math.sqrt(Math.pow((agent.point.x - projectile.attrs.x), 2) + Math.pow((agent.point.y - projectile.attrs.y), 2));
  //
  //       // console.log(`agent ${agent.name} to cannonball distance:`, distance, agent);
  //
  //       if (distance < 10) {
  //         console.log('Hit!');
  //         agent.currentHitPoints -= projectile.damage;
  //         agent.updateHealthBar();
  //
  //         anim.stop();
  //         projectile.remove();
  //       }
  //     })
  //   }
  // }

  updateHealthBar() {
    let bar = this.imageGroup.getChildren((node) =>{
      return node.attrs && node.attrs.id === 'hp' + this.id
    });
    if (bar) {
      bar.width( 30 * (this.healthPercentage/100) );
      bar.fill(this.healthPercentage < 25 ? 'red' : 'green')
      this.game.camera.getAgentsLayer().draw();

      if (this.healthPercentage <= 0) {
        console.log(`${this.name} dead!`);
        // debugger;
        // TODO do death functions:
        // remove from map
        // award experience
        // drop treasure?  Treasure disappears after a while ?
        this.death.perform();
        this.respawn.perform();
        return;
      }
    }
    if (this.reloadHealth.isIdle && this.healthPercentage <= 100) {
      this.reloadHealth.perform();
    }
  }

  @task
  *death() {
    if (this.fireWeapon.isRunning) {
      this.fireWeapon.cancelAll();
    }

    this.imageGroup.to({opacity: 0});

    this.hex = this.startHex;
    this.reset(this.initialAgent);
    this.updateHealthBar();

    yield timeout(this.respawnTime);   // TODO get this time from somewhere

  };

  @task
  *respawn() {
    yield waitForProperty(this, 'imageGroup.attrs.opacity', (opacity) => opacity === 0);

    console.log('respawning');


    this.game.transport.movePlayerToHexTask.perform(this.game.player, this.startHex);

    this.imageGroup.to({opacity: 1});

  };
}

