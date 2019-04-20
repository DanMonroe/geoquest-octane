import { BaseAgent } from './base-agent';
import Konva from 'konva';

export class Enemy extends BaseAgent {

  constructor(args) {
    super(...arguments);
    this.type = BaseAgent.AGENTTYPES.ENEMY;

    let agent = args.agent;
    this.mapService = args.mapService;
    this.camera = args.camera;
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
    this.patrol = agent.patrol;
    this.currentWaypoint = -1;
    this.state = agent.state; // state machine - see notes.md
    this.hexLayout = this.mapService.currentLayout;
    this.maxHitPoints = agent.maxHitPoints || 20;
    this.currentHitPoints = agent.currentHitPoints || 20;

    this.buildDisplayGroup(agent);
  }

  buildDisplayGroup(agent) {

    this.imageGroup = new Konva.Group({
      x: this.point.x,
      y: this.point.y,
      opacity: agent.opacity
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
        width: this.agentImageSize,
        height: this.agentImageSize
      });

      let agentsLayer = this.camera.getAgentsLayer();
      this.imageGroup.add(healthBar, this.imageObj);
      agentsLayer.add(this.imageGroup);
      agentsLayer.draw();
    };

  }
}

