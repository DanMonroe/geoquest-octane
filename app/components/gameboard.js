import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import {inject as service} from '@ember/service';
import config from 'geoquest-octane/config/environment';

export default class GameboardComponent extends Component {

  @service ('hex') hexService;
  @service ('map') mapService;
  @service gameboard;
  @service transport;
  @service ('game') game;
  @service camera;
  @service sound;
  @service ('path') pathService;
  @service ('fieldOfView') fov;
  @service ('modals') modals;

  @tracked showTileGraphics = true;
  @tracked showTileHexInfo = false;
  @tracked showDebugLayer = true;
  @tracked showScrollRectangle;
  @tracked pathFindingDebug = false;
  @tracked showFieldOfViewLayer = true;

  @tracked map = null;
  @tracked mapIndex = null;

  @tracked selectedMap = 0;

  @tracked epmModalContainerClass = '';

  constructor() {
    super(...arguments);

    this.game.showTileGraphics = config.game.board.showTileGraphics;
    this.game.showTileHexInfo = config.game.board.showTileHexInfo;
    this.game.showDebugLayer = config.game.board.showDebugLayer;
    this.game.showScrollRectangle = config.game.board.showScrollRectangle;
    this.game.pathFindingDebug = config.game.board.pathFindingDebug;
    this.game.showFieldOfViewLayer = config.game.board.showFieldOfViewLayer;
    this.sound.soundEnabled = config.game.enableGameSounds;
    this.game.gameClockEnabled = config.game.gameClockEnabled;
    this.transport.moveQueueEnabled = config.game.transport.moveQueueEnabled;

    // this.mapService.mapData = this.args.model.data;

    this.modals.set('modalsDuration', config.game.modalsDuration);

    this.mapService.loadSeenHexesFromStorage();
  }

  @action
  changeMap (map) {
    this.loadMap(map.value);
  }

  // @action
  // mouseMove(event) {
  //   // console.log(event);
  // }
  // @action
  // keyboardDown(event) {
  //   console.log(event);
  //   switch(event.keyCode) {
  //     // case 70:  // F [ire]
  //     //   if (this.game.player.boardedTransport) {
  //     //     this.game.player.boardedTransport.fire();
  //     //   }
  //     //   break;
  //     case 81:  // Q
  //       this.gameboard.movePlayer('NW');
  //       break;
  //     case 87:  // W
  //       this.gameboard.movePlayer('N');
  //       break;
  //     case 69:  // E
  //       this.gameboard.movePlayer('NE');
  //       break;
  //     case 65:  // A
  //       this.gameboard.movePlayer('SW');
  //       break;
  //     case 83:  // S
  //       this.gameboard.movePlayer('S');
  //       break;
  //     case 68:  // D
  //       this.gameboard.movePlayer('SE');
  //       break;
  //     default:
  //       break;
  //   }
  //   event.preventDefault();
  // }

  @action
  setupGame(/*konvaContainer*/) {
console.log('gameboard setup');
    this.mapService.loadMap(config.game.startingMapIndex);

    this.game.gameClock.perform();
  }

  @action
  teardown(/*konvaContainer*/) {
console.log('gameboard teardown');
    // konvaContainer.removeEventListener('click', this.handleContainerClick);
  }

  @action
  async showConfigDialog() {
    this.epmModalContainerClass = 'config';
    await this.modals.open('config-dialog');
  }

  @action
  async showInventory() {
    this.epmModalContainerClass = 'inventory';
    await this.modals.open('inventory-dialog');
  }

  @action
  async clickGems() {
    console.log('click gems');


  }

  // @action
  // toggleDebugLayer() {
  //   this.game.showDebugLayer = !this.game.showDebugLayer;
  //   this.gameboard.showDebugLayer = this.game.showDebugLayer;
  //   let layer = this.camera.getDebugLayer();
  //   layer.visible(this.game.showDebugLayer);
  //
  //   this.game.showFieldOfViewLayer = !this.game.showFieldOfViewLayer;
  //   this.gameboard.showFieldOfViewLayer = this.game.showFieldOfViewLayer;
  //   let fovlayer = this.camera.getFOVLayer();
  //   fovlayer.visible(this.game.showFieldOfViewLayer);
  // }
  //
  // @action
  // toggleTiles() {
  //   this.game.showTileGraphics = !this.game.showTileGraphics;
  //   let layer = this.camera.getGameLayer();
  //   layer.visible(this.game.showTileGraphics);
  //   // this.camera.stage.draw();
  //   layer.draw();
  // }
  //
  // @action
  // toggleGameSounds() {
  //   this.sound.soundEnabled = !this.sound.soundEnabled;
  //   if (!this.sound.soundEnabled) {
  //     // this.sound.audio.stopAll('sounds')  // throws because no sounds playing
  //   }
  // }
  //
  // @action
  // toggleHexInfo() {
  //   this.game.showTileHexInfo = !this.game.showTileHexInfo;
  //   let layer = this.camera.getHexLayer();
  //   layer.visible(this.game.showTileHexInfo);
  //   layer.draw();
  //   // this.camera.stage.draw();
  // }
  //
  // @action
  // togglePathFindingDebug() {
  //   this.game.pathFindingDebug = !this.game.pathFindingDebug;
  // }
  //
  // @action
  // toggleMoveQueue() {
  //   this.transport.moveQueueEnabled = !this.transport.moveQueueEnabled;
  //
  //   if (this.transport.moveQueueEnabled && this.transport.moveQueueTask.isIdle) {
  //     this.transport.moveQueueTask.perform();
  //   }
  // }
  //
  // @action
  // toggleGameClock() {
  //   this.game.gameClockEnabled = !this.game.gameClockEnabled;
  //
  //   if (this.game.gameClockEnabled && this.game.gameClock.isIdle) {
  //     this.game.gameClock.perform();
  //   }
  // }

  @action
  saveGame() {
    console.log('Component Save Game');
    this.game.saveGame();
  }

}
