import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import {inject as service} from '@ember/service';
import { A as emberArray } from '@ember/array';
import config from 'geoquest-octane/config/environment';

export default class GameboardComponent extends Component {

  @service ('hex') hexService;
  @service ('map') mapService;
  @service ('gameboard') gameboard;
  @service ('transport') transport;
  @service ('game') game;
  @service ('camera') camera;
  @service ('path') pathService;
  @service ('fieldOfView') fov;

  @tracked showTileGraphics = true;
  @tracked showTileHexInfo = true;
  @tracked showDebugLayer = true;
  @tracked showFieldOfViewLayer = true;

  @tracked map = null;
  @tracked mapIndex = null;
  @tracked player = null;
  @tracked agents = emberArray();
  @tracked transports = emberArray();

  @tracked selectedMap = 0;


  mapOptions = [
    {name: "Small", value: 0},
    {name: "Island", value: 1},
    {name: "Patrolling Pirate", value: 2}
  ];

  constructor() {
    super(...arguments);

    this.showTileGraphics = config.game.board.showTileGraphics;
    this.showTileHexInfo = config.game.board.showTileHexInfo;
    this.showDebugLayer = config.game.board.showDebugLayer;
    this.showFieldOfViewLayer = config.game.board.showFieldOfViewLayer;

    this.model = arguments[1];
    this.mapService.loadLayout();
    this.loadMap(2);
  }

  loadMap(mapIndex) {
    this.mapIndex = mapIndex;
    this.map = this.model.mapdata[mapIndex].map;
    // this.selectedMap = this.mapOptions.findBy('value', this.model.mapdata[mapIndex].mapid);

    this.mapService.loadTiles(this.map);

  }

  @action
  changeMap (map) {
    this.loadMap(map.value);
  }

  @action
  setupGame(konvaContainer) {

    // Map setup
    this.gameboard.setupQRSFromMap(this.map.MAP);
    this.mapService.initMap({map: this.map.MAP});
    this.camera.initCamera();

    this.gameboard.setupGameboardCanvases(konvaContainer, this.map, this.showDebugLayer, this.showFieldOfViewLayer);
    let agentsObj = this.transport.setupAgents(this.model.mapdata[this.mapIndex].agents);

    this.player = agentsObj.player;
    this.agents = agentsObj.agents;
    this.transports = agentsObj.transports;

    this.transport.setupPatrols();

    this.gameboard.drawGrid({
      hexes: this.mapService.hexMap,
      withLabels: this.showTileHexInfo,
      withTiles: this.showTileGraphics
    });

    this.fov.updatePlayerFieldOfView(this.game.player.hex)

    this.transport.moveQueueTask.perform();

    // TODO put these back in:
    // this.game.gameClock.perform();
  }

  @action
  teardownGameboardCanvases(konvaContainer) {
    konvaContainer.removeEventListener('click', this.handleContainerClick);
  }

  @action
  fireCannon() {
    // this.player.boardedTransport.currentHitPoints *= .9;
    // this.player.boardedTransport.updateHealthBar();

    // this.player.boardedTransport.fire();
  }


  @action
  toggleDebugLayer() {
    this.showDebugLayer = !this.showDebugLayer;
    this.gameboard.showDebugLayer = this.showDebugLayer;
    let layer = this.camera.getDebugLayer();
    layer.visible(this.showDebugLayer);

  }

  @action
  toggleTiles() {
    this.showTileGraphics = !this.showTileGraphics;
    let layer = this.camera.getGameLayer();
    layer.visible(this.showTileGraphics);
    // this.camera.stage.draw();
    layer.draw();
  }

  @action
  toggleHexInfo() {
    this.showTileHexInfo = !this.showTileHexInfo;
    let layer = this.camera.getHexLayer();
    layer.visible(this.showTileHexInfo);
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
}
