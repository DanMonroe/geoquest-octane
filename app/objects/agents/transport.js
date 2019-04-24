import { BaseAgent } from './base-agent';
import Konva from 'konva';
import { Point } from '../point'

export class Transport extends BaseAgent {

  constructor(args) {
    super(...arguments);
    this.type = BaseAgent.AGENTTYPES.TRANSPORT;

    let agent = args.agent;
    this.mapService = args.mapService;
    this.camera = args.camera;
    this.transportService = args.transportService;
    this.gameboard = args.gameboard;

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
    this.patrol = agent.patrol;
    this.currentWaypoint = -1;
    this.state = agent.state
    this.hexLayout = this.mapService.currentLayout;
    this.maxHitPoints = agent.maxHitPoints || 20;
    this.currentHitPoints = agent.currentHitPoints || 20;
    this.maxPower = args.maxPower || 25;
    this.currentPower = args.currentPower | 25;

    this.weapons = agent.weapons;
    this.armor = args.armor | 2;

    this.buildDisplayGroup(agent);
  }

  buildDisplayGroup(agent) {

    this.imageGroup = new Konva.Group({
      x: this.point.x,
      y: this.point.y
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
        id: "agent" + agent.index,
        x: -(this.agentImageSize / 2),
        y: -(this.agentImageSize / 2) - 5,
        image: image,
        opacity: agent.opacity,
        width: this.agentImageSize,
        height: this.agentImageSize
      });

      let agentsLayer = this.camera.getAgentsLayer();
      this.imageGroup.add(healthBar, powerBar, this.imageObj);
      healthBar.moveToBottom();
      powerBar.moveToBottom();
      agentsLayer.add(this.imageGroup);
      // agentsLayer.add(this.imageObj);
      agentsLayer.draw();
      // this.camera.stage.draw();
    };
  }

  fire() {
    console.log('Fire!');

    if (!this.weapons || this.weapons.length === 0) {
      console.log('no weapons');
      return;
    }

    let weapon = this.weapons[0];
    if (!this.canFireWeapon(weapon.poweruse)) {
      console.log('no power!');
      return
    }

    if (this.fireWeapon.isRunning) {
      console.log('waiting to reload');
      return;
    }

    let startPoint = this.point;
    let mousecoords = this.gameboard.getMousePointerPosition()
    let targetPoint = new Point({x:mousecoords.x, y:mousecoords.y}); // harder to aim
    // let targetHex = this.gameboard.getHexAtMousePoint(mousecoords);   // center of hex
    // let targetPoint = this.mapService.currentLayout.hexToPixel(targetHex);  // center of hex

    this.fireWeapon.perform(weapon, startPoint, targetPoint);
  }

  // @task( function*(weapon) {
  //   let cannonballSpeed = 3;
  //   let startPoint = this.point;
  //   let mousecoords = this.gameboard.getMousePointerPosition()
  //   let targetHex = this.gameboard.getHexAtMousePoint(mousecoords);
  //   let targetPoint = this.mapService.currentLayout.hexToPixel(targetHex);
  //
  //   let angle = Math.atan2(targetPoint.y - startPoint.y, targetPoint.x - startPoint.x);
  //   let sin = Math.sin(angle) * cannonballSpeed; // Y change
  //   let cos = Math.cos(angle) * cannonballSpeed; // X change
  //   let maxX = Math.abs(targetPoint.x - startPoint.x)
  //   let maxY = Math.abs(targetPoint.y - startPoint.y)
  //
  //   // console.log('target', targetPoint);
  //   // console.log('lineDistance', lineDistance);
  //   // console.log('segmentDistance', segmentDistance);
  //   // console.log('angle', angle);
  //   // console.log('sin', sin);
  //   // console.log('cos', cos);
  //   // console.log('maxX', maxX);
  //   // console.log('maxY', maxY);
  //
  //   let cannonball = new Konva.Circle({
  //     x: startPoint.x,
  //     y: startPoint.y,
  //     radius: 4,
  //     fill: 'black',
  //     draggable: true,
  //     opacity: 1
  //   });
  //   // custom property
  //   cannonball.velocity = {
  //     x: 0,
  //     y: 0
  //   };
  //   cannonball.damage = weapon.damage;
  //
  //   let layer = this.camera.getAgentsLayer();
  //   layer.add(cannonball);
  //
  //   let newX = cannonball.getX();
  //   let newY = cannonball.getY();
  //
  //   let sumX = 0;
  //   let sumY = 0;
  //   let deltaX = Math.abs(cos);
  //   let deltaY = Math.abs(sin);
  //
  //   let anim = new Konva.Animation(() => {
  //     newX += cos;
  //     newY += sin;
  //
  //     cannonball.position({x:newX, y:newY});
  //
  //     sumX += deltaX;
  //     sumY += deltaY;
  //
  //     // change/implement max firing distance of current cannon in use
  //     if((sumX >= maxX) || (sumY >= maxY)) {
  //       anim.stop();
  //       cannonball.remove();
  //     }
  //
  //     // did we hit something?
  //     this.checkForEnemiesHitByProjectile(anim, cannonball);
  //
  //   }, layer);
  //
  //   anim.start();
  //
  //   this.currentPower -= weapon.poweruse;
  //   this.updatePowerBar();
  //   if(this.currentPower < 100 && this.reloadPower.isIdle) {
  //     this.reloadPower.perform(weapon);
  //   }
  //
  //   yield timeout(weapon.fireDelay);
  //
  // }) fireWeapon;


  checkForEnemiesHitByProjectile(anim, projectile) {
    this.transportService.agents.forEach((agent) => {
      let distance = Math.sqrt( Math.pow((agent.point.x - projectile.attrs.x),2) + Math.pow((agent.point.y - projectile.attrs.y),2));

      // console.log(`agent ${agent.name} to cannonball distance:`, distance, agent);

      if (distance < 10) {
        console.log('Hit!');
        agent.currentHitPoints -= projectile.damage;
        agent.updateHealthBar();

        anim.stop();
        projectile.remove();
      }
    })
  }

  updateHealthBar() {
    let bar = this.imageGroup.getChildren((node) =>{
      return node.attrs && node.attrs.id === 'hp' + this.id
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

