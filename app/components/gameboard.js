import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import {inject as service} from '@ember/service';
// import { A as emberArray } from '@ember/array';
// import Confirmer from 'confirmed';
import config from 'geoquest-octane/config/environment';

// import fade from 'ember-animated/transitions/fade';
// import move from 'ember-animated/motions/move';
// import { easeOut, easeIn } from 'ember-animated/easings/cosine';


export default class GameboardComponent extends Component {

  @service ('hex') hexService;
  @service ('map') mapService;
  @service ('gameboard') gameboard;
  @service ('transport') transport;
  @service ('game') game;
  @service ('camera') camera;
  @service ('sound') sound;
  @service ('path') pathService;
  @service ('fieldOfView') fov;
  @service ('modals') modals;

  @tracked showTileGraphics = true;
  @tracked showTileHexInfo = true;
  @tracked showDebugLayer = true;
  @tracked pathFindingDebug = true;
  @tracked showFieldOfViewLayer = true;

  @tracked map = null;
  @tracked mapIndex = null;
  // @tracked player = null;
  // @tracked agents = emberArray();
  // @tracked transports = emberArray();

  @tracked selectedMap = 0;

  @tracked epmModalContainerClass = '';

  // @tracked configDialogResolver = null;

  // @tracked fade = fade;
  // @tracked showThing = false;

  // eslint-disable-next-line require-yield
  // slideFromSide = function * ({ insertedSprites, keptSprites, removedSprites }) {
  //
  //   insertedSprites.forEach(sprite => {
  //     sprite.startAtPixel({ y: 0 });
  //     sprite.applyStyles({ 'z-index': 100000 });
  //     move(sprite, { easing: easeOut });
  //   });
  //
  //   keptSprites.forEach(sprite => {
  //     sprite.applyStyles({ 'z-index': 100000 });
  //     sprite.endAtPixel({ y: 50 });
  //     move(sprite);
  //   });
  //
  //   removedSprites.forEach(sprite => {
  //     sprite.applyStyles({ 'z-index': 1 });
  //     sprite.endAtPixel({ y: 50 });
  //     move(sprite, { easing: easeIn });
  //   });
  // }

  // mapOptions = [
  //   {name: "Small", value: 0},
  //   {name: "Island", value: 1},
  //   {name: "Patrolling Pirate", value: 2}
  // ];

  constructor() {
    super(...arguments);

    this.game.showTileGraphics = config.game.board.showTileGraphics;
    this.game.showTileHexInfo = config.game.board.showTileHexInfo;
    this.game.showDebugLayer = config.game.board.showDebugLayer;
    this.game.pathFindingDebug = config.game.board.pathFindingDebug;
    this.game.showFieldOfViewLayer = config.game.board.showFieldOfViewLayer;
    this.sound.soundEnabled = config.game.enableGameSounds;
    this.game.gameClockEnabled = config.game.gameClockEnabled;
    this.transport.moveQueueEnabled = config.game.transport.moveQueueEnabled;

    // console.log('model', this.args.model);
    // console.log('config.game', config.game);
    this.mapService.mapData = this.args.model.data;

    this.modals.set('modalsDuration', 600);

    this.mapService.loadSeenHexesFromStorage();
  }

  // loadMap(mapIndex) {
  //   this.mapIndex = mapIndex;
  //   this.map = this.model.mapdata[mapIndex].map;
  //   // this.selectedMap = this.mapOptions.findBy('value', this.model.mapdata[mapIndex].mapid);
  //
  //   this.game.mapService.loadLayout(this.map.LAYOUT);
  //   this.game.mapService.loadTiles(this.map);
  //   this.game.sound.loadSounds(this.model.mapdata[mapIndex].sounds);
  // }

  @action
  changeMap (map) {
    this.loadMap(map.value);
  }

  @action
  setupGame(/*konvaContainer*/) {
    // console.group('setupGame');

    // console.group('loadEmberDataMap');
    this.mapService.loadEmberDataMap(config.game.startingMapIndex);
    // console.groupEnd();

    // console.group('loadMap');
    // // TODO --> From pre-ember data maps: this.mapService.loadMap(config.game.startingMapIndex);
    // this.mapService.loadMap(config.game.startingMapIndex);
    // console.groupEnd();
    // console.groupEnd();

    this.game.gameClock.perform();
  }

  @action
  teardownGameboardCanvases(/*konvaContainer*/) {
    // konvaContainer.removeEventListener('click', this.handleContainerClick);
  }

  @action
  fireCannon() {
    // this.player.boardedTransport.currentHitPoints *= .9;
    // this.player.boardedTransport.updateHealthBar();

    // this.player.boardedTransport.fire();
  }

  @action
  async showConfigDialog() {

    console.log('modals', this.modals);
    // debugger;
    this.epmModalContainerClass = 'config';
    await this.modals.open('config-dialog');
    // this.epmModalContainerClass = '';
  }

  @action
  async showInventory() {
    this.epmModalContainerClass = 'inventory';
    await this.modals.open('inventory-dialog');
    // this.epmModalContainerClass = '';
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
