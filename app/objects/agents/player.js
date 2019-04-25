import { BaseAgent } from './base-agent';
import Konva from 'konva';
import { tracked } from '@glimmer/tracking';

export class Player extends BaseAgent {

  @tracked boardedTransport = null;

  constructor(args) {
    super(...arguments);
    this.type = BaseAgent.AGENTTYPES.PLAYER;

    let player = args.player;
    this.mapService = args.mapService;
    this.camera = args.camera;
    this.game = args.game;
    this.transportService = args.transportService;
    this.travelAbilityFlags = args.travelAbilityFlags || 0;
    this.boardedTransport = args.boardedTransport;
    this.gameboard = args.gameboard;
    this.maxHitPoints = args.maxHitPoints;
    this.currentHitPoints = args.currentHitPoints;

    if(this.game) {
      this.game.turnOnPlayerTravelAbilityFlag(this.game.FLAGS.TRAVEL.SEA);
    }

    let playerStartHex;
    if (this.mapService) {
      this.hexLayout = this.mapService.currentLayout;

      playerStartHex = this.mapService.hexMap.find((hex) => {
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
    }

    this.id = player.index;
    this.name = player.name;
    this.hex = playerStartHex;

    this.agentImage = `/images/transports/${player.img}`;
    this.agentImageSize = player.imgSize;
    this.sightRange = player.sightRange;
    this.speed = player.speed;
    this.patrol = player.patrol;
    this.currentWaypoint = -1;
    this.state = player.state;  // state machine - see notes.md
    this.maxHitPoints = player.maxHitPoints;
    this.currentHitPoints = player.currentHitPoints;
    this.maxPower = player.maxPower;
    this.currentPower = player.currentPower;
    this.armor = player.armor | 2;

    this.buildDisplayGroup(player);
  }

  buildDisplayGroup(player) {

    this.imageGroup = new Konva.Group({
      x: this.point.x,
      y: this.point.y,
      opacity: player.opacity
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

    image.onload = () => {
      console.log('loaded player image');
      this.imageObj = new Konva.Image({
        id: player.name,
        x: -(this.agentImageSize / 2),
        y: -(this.agentImageSize / 2) - 5,
        image: image,
        width: this.agentImageSize,
        height: this.agentImageSize
      });

      let agentsLayer = this.camera.getAgentsLayer();
      this.imageGroup.add(healthBar, powerBar, this.imageObj);
      healthBar.moveToBottom();
      powerBar.moveToBottom();
      agentsLayer.add(this.imageGroup);
      agentsLayer.draw();
    };
  }

  // updateHealthBar() {
  //   console.log('player updateHealthBar');
    // let bar = this.imageGroup.getChildren((node) =>{
    //   return node.attrs && node.attrs.id === 'hp';
    // });
    // if (bar) {
    //   console.log('transport updateHealthBar this.healthPercentage', this.healthPercentage);
    //   bar.width( 30 * (this.healthPercentage/100) );
    //   bar.fill(this.healthPercentage < 25 ? 'red' : 'green')
    //   this.camera.getAgentsLayer().draw();
    //
    //   if (this.healthPercentage <= 0) {
    //     console.log(`${this.name} dead!`);
    //     debugger;
    //     // TODO do death functions:
    //     // remove from map
    //     // award experience
    //     // drop treasure?  Treasure disappears after a while ?
    //   }
    // }
  // }
}

