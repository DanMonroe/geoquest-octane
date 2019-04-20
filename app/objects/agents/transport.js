import { BaseAgent } from './base-agent';
import Konva from 'konva';

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

    this.buildDisplayGroup(agent);
  }

  buildDisplayGroup(agent) {

    this.imageGroup = new Konva.Group({
      x: this.point.x,
      y: this.point.y
    });

    let healthBar = new Konva.Rect({
      id: 'hp',
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
        opacity: agent.opacity,
        width: this.agentImageSize,
        height: this.agentImageSize
      });

      let agentsLayer = this.camera.getAgentsLayer();
      this.imageGroup.add(healthBar, this.imageObj);
      agentsLayer.add(this.imageGroup);
      // agentsLayer.add(this.imageObj);
      agentsLayer.draw();
      // this.camera.stage.draw();
    };
  }

  fire() {
    console.log('Fire!');
    let cannonballSpeed = 3;
    let startPoint = this.point;

    // let targetHex = this.mapService.findHexByQRS(12, -3, -9);
    // let targetPoint = this.mapService.currentLayout.hexToPixel(targetHex);

    let targetPoint = this.gameboard.getMousePointerPosition();

    let lineDistance = Math.sqrt( Math.pow((targetPoint.x - startPoint.x),2) + Math.pow((targetPoint.y - startPoint.y),2));
    let segmentDistance = lineDistance / cannonballSpeed;  // speed of cannonball
    let angle = Math.atan2(targetPoint.y - startPoint.y, targetPoint.x - startPoint.x);
    let sin = Math.sin(angle) * cannonballSpeed; // Y change
    let cos = Math.cos(angle) * cannonballSpeed; // X change
    // let sin = Math.sin(angle) * segmentDistance; // Y change
    // let cos = Math.cos(angle) * segmentDistance; // X change
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

      if((sumX >= maxX) || (sumY >= maxY)) {
        anim.stop();
        cannonball.remove();
      }
    }, layer);

    anim.start();
  }

}

