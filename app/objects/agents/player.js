import { BaseAgent } from './base-agent';
import Konva from 'konva';


export class Player extends BaseAgent {

  static transportHexIndex = 0;

  constructor(args) {
    super(...arguments);
    this.type = BaseAgent.AGENTTYPES.PLAYER;

    let player = args.player;
    this.mapService = args.mapService;
    this.camera = args.camera;
    this.transportService = args.transportService;

    let playerStartHex = this.mapService.hexMap.find((hex) => {
      if (!hex) {
        return false;
      }
      return (player.start.Q === hex.q) &&
        (player.start.R === hex.r) &&
        (player.start.S === hex.s)
    });

    if (!playerStartHex) {
      console.warn("Could not find player start hex.  Setting to first one in map");
      // TODO this probably should never happen
      playerStartHex = this.mapService.hexMap[0];
    }
    let playerStartPoint = this.mapService.currentLayout.hexToPixel(playerStartHex);

    this.id = player.index;
    this.name = player.name;
    this.hex = playerStartHex;
    this.point = playerStartPoint;
    this.agentImage = `/images/transports/${player.img}`;
    this.agentImageSize = player.imgSize;
    this.sightRange = player.sightRange;
    this.speed = player.speed;
    this.patrol = player.patrol;
    this.currentWaypoint = -1;
    this.state = player.state
    this.hexLayout = this.mapService.currentLayout;

    this.transportService.transportHexes.push(playerStartHex);
    this.transportService.transportPoints.push(playerStartPoint);

    let image = new Image();
    image.onload = () => {
      this.imageObj = new Konva.Image({
        id: "player",
        x: this.point.x - (this.agentImageSize / 2),
        y: this.point.y - (this.agentImageSize / 2),
        image: image,
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

