import { BaseAgent } from './base-agent';
import Konva from 'konva';
import { tracked } from '@glimmer/tracking';
import { Point } from '../point'

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

    // if(this.game) {
    //   this.game.turnOnPlayerTravelAbilityFlag(this.game.FLAGS.TRAVEL.SEA);
    // }

    let playerStartHex;
    if (this.game.mapService) {
      playerStartHex = this.setStartHex(player.start);
    }
// debugger;
    this.id = player.index;
    this.name = player.name;
    this.hex = playerStartHex;
    this.startHex = playerStartHex;

    this.agentImage = `/images/${player.img}`;
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
    this.healingSpeed = player.healingSpeed || 5000;
    this.healingPower = player.healingPower || 1;

    this.armor = player.armor | 2;
    this.respawnTime = player.respawnTime | 5000;

    this.weapons = player.weapons;

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

    // console.log('Creating player image');
    let imageObj = new Image();
    imageObj.onload = () => {

      // console.log('loaded player image');
      this.imageObj = new Konva.Image({
        id: player.name,
        x: -(this.agentImageSize / 2),
        y: -(this.agentImageSize / 2) - 5,
        image: imageObj,
        width: this.agentImageSize,
        height: this.agentImageSize
      });

      let agentsLayer = this.camera.getAgentsLayer();
      // let agentsLayer = this.game.camera.getAgentsLayer();
      this.imageGroup.add(this.imageObj, healthBar, powerBar);
      healthBar.moveToBottom();
      powerBar.moveToBottom();

      agentsLayer.add(this.imageGroup);
      agentsLayer.draw();
    };
    imageObj.src = this.agentImage;
    console.log('player img src:', imageObj.src);
  }

  updateHealthBar() {
    console.log('player updateHealthBar');
    let bar = this.imageGroup.getChildren((node) =>{
      return node.attrs && node.attrs.id === 'hp';
    });
    if (bar) {
      console.log('player updateHealthBar this.healthPercentage', this.healthPercentage);
      bar.width( 30 * (this.healthPercentage/100) );
      bar.fill(this.healthPercentage < 25 ? 'red' : 'green')
      this.game.camera.getAgentsLayer().draw();

      if (this.healthPercentage <= 0) {
        console.log(`${this.name} dead!`);
    //     debugger;
    //     // TODO do death functions:
    //     // remove from map
    //     // award experience
    //     // drop treasure?  Treasure disappears after a while ?
      }
    }
  }

  fire(mousecoords) {
    console.log('Player Fire!');

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
    // let mousecoords = this.gameboard.getMousePointerPosition()
    let targetPoint = new Point({x:mousecoords.x, y:mousecoords.y}); // harder to aim
    // let targetHex = this.gameboard.getHexAtMousePoint(mousecoords);   // center of hex
    // let targetPoint = this.mapService.currentLayout.hexToPixel(targetHex);  // center of hex

    this.fireWeapon.perform(weapon, startPoint, targetPoint);
  }
}

