import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import {inject as service} from '@ember/service';
// import { A as emberArray } from '@ember/array';
import config from 'geoquest-octane/config/environment';

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

  @tracked showTileGraphics = true;
  @tracked showTileHexInfo = true;
  @tracked showDebugLayer = true;
  @tracked showFieldOfViewLayer = true;

  @tracked map = null;
  @tracked mapIndex = null;
  // @tracked player = null;
  // @tracked agents = emberArray();
  // @tracked transports = emberArray();

  @tracked selectedMap = 0;


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
    this.game.showFieldOfViewLayer = config.game.board.showFieldOfViewLayer;
    this.sound.soundEnabled = config.game.enableGameSounds;
    this.game.gameClockEnabled = config.game.gameClockEnabled;
    this.transport.moveQueueEnabled = config.game.transport.moveQueueEnabled;

    console.log('model', this.args.model);
    console.log('config.game', config.game);
    this.mapService.mapData = this.args.model.data;

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

    this.mapService.loadMap(config.game.startingMapIndex);

    // // Map setup
    // this.gameboard.setupQRSFromMap(this.mapService.map.MAP);
    // this.mapService.initMap({map: this.mapService.map.MAP});
    // this.camera.initCamera();
    //
    // this.gameboard.setupGameboardCanvases(this.showDebugLayer, this.showFieldOfViewLayer);
    // // this.gameboard.setupGameboardCanvases(konvaContainer, this.mapService.map, this.showDebugLayer, this.showFieldOfViewLayer);
    // this.mapService.setHexmapSubset();

    // let agentsObj = this.transport.setupAgents(this.mapService.mapData[this.mapService.mapIndex].map.AGENTS);
    //
    // this.player = agentsObj.player;
    // this.agents = agentsObj.agents;
    // this.transports = agentsObj.transports;
    //
    // this.transport.setupPatrols();
    //
    // this.gameboard.drawGrid({
    //   hexes: this.mapService.hexMap,
    //   withLabels: this.showTileHexInfo,
    //   withTiles: this.showTileGraphics
    // });
    //
    // this.fov.updatePlayerFieldOfView(this.game.player.hex)
    //
    // this.transport.moveQueueTask.perform();

    // TODO put these back in:
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
  toggleDebugLayer() {
    this.game.showDebugLayer = !this.game.showDebugLayer;
    this.gameboard.showDebugLayer = this.game.showDebugLayer;
    let layer = this.camera.getDebugLayer();
    layer.visible(this.game.showDebugLayer);

    this.game.showFieldOfViewLayer = !this.game.showFieldOfViewLayer;
    this.gameboard.showFieldOfViewLayer = this.game.showFieldOfViewLayer;
    let fovlayer = this.camera.getFOVLayer();
    fovlayer.visible(this.game.showFieldOfViewLayer);
  }

  @action
  toggleTiles() {
    this.game.showTileGraphics = !this.game.showTileGraphics;
    let layer = this.camera.getGameLayer();
    layer.visible(this.game.showTileGraphics);
    // this.camera.stage.draw();
    layer.draw();
  }

  @action
  toggleGameSounds() {
    this.sound.soundEnabled = !this.sound.soundEnabled;
    if (!this.sound.soundEnabled) {
      // this.sound.audio.stopAll('sounds')  // throws because no sounds playing
    }
  }

  @action
  toggleHexInfo() {
    this.game.showTileHexInfo = !this.game.showTileHexInfo;
    let layer = this.camera.getHexLayer();
    layer.visible(this.game.showTileHexInfo);
    layer.draw();
    // this.camera.stage.draw();
  }

  @action
  toggleMoveQueue() {
    this.transport.moveQueueEnabled = !this.transport.moveQueueEnabled;

    if (this.transport.moveQueueEnabled && this.transport.moveQueueTask.isIdle) {
      this.transport.moveQueueTask.perform();
    }
  }

  @action
  toggleGameClock() {
    this.game.gameClockEnabled = !this.game.gameClockEnabled;

    if (this.game.gameClockEnabled && this.game.gameClock.isIdle) {
      this.game.gameClock.perform();
    }
  }

  @action
  saveGame() {
    console.log('Component Save Game');
    this.game.saveGame();
  }

}
