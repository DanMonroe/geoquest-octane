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

    let startPoint = this.mapService.currentLayout.hexToPixel(startHex);

    this.id = agent.index;
    this.name = agent.name;
    this.hex = startHex;
    this.point = startPoint;
    this.agentImage = `/images/transports/${agent.img}`;
    this.agentImageSize = agent.imgSize;
    this.sightRange = agent.sightRange;
    this.speed = agent.speed;
    this.patrol = agent.patrol;
    this.currentWaypoint = -1;
    this.state = agent.state
    this.hexLayout = this.mapService.currentLayout;

    let image = new Image();
    image.onload = () => {
      this.imageObj = new Konva.Image({
        id: "agent" + agent.index,
        x: this.point.x - (this.agentImageSize / 2),
        y: this.point.y - (this.agentImageSize / 2),
        image: image,
        opacity: agent.opacity,
        width: this.agentImageSize,
        height: this.agentImageSize
      });

      let agentsLayer = this.camera.stage.getLayers()[this.camera.LAYERS.AGENTS];
      agentsLayer.add(this.imageObj);
      this.camera.stage.draw();
    };
    image.src = this.agentImage;
  }

}

