import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import {inject as service} from '@ember/service';
import { A as emberArray } from '@ember/array';



export default class GameboardComponent extends Component {

  @service ('hex') hexService;
  @service ('map') mapService;
  @service ('gameboard') gameboard;
  @service ('transport') transport;
  @service ('game') game;
  @service ('camera') camera;

  // @tracked showTileGraphics = false;
  @tracked showTileGraphics = false;
  @tracked showTileHexInfo = true;
  @tracked showDebugLayer = true;
  @tracked showFieldOfViewLayer = true;
  @tracked showTilesWithLabels = true;

  @tracked map = null;
  @tracked mapIndex = null;
  @tracked players = emberArray();
  @tracked agents = emberArray();
  @tracked selectedMap = 0;
  // @tracked ships = emberArray();

  @tracked dragging = false;
  @tracked dragoffx = 0; // See mousedown and mousemove events for explanation
  @tracked dragoffy = 0;

  mapOptions = [
    {name: "Small", value: 0},
    {name: "Island", value: 1},
    {name: "Patrolling Pirate", value: 2}
  ];

  constructor() {
    super(...arguments);
    this.model = arguments[1];
    this.mapService.loadLayout();
    this.loadMap(4);
    // this.loadMap(3);
    // this.loadMap(1);
  }

  // get enemyToPlayerDistance() {
  //   console.log('getting enemy ship');
  //   return this.ships.objectAt(1).enemyToPlayerDistance;
  // }

  loadMap(mapIndex) {
    this.mapIndex = mapIndex;
    this.map = this.model.mapdata[mapIndex].map;
    // this.agents = this.model.mapdata[mapIndex].agents;
    this.selectedMap = this.mapOptions.findBy('value', this.model.mapdata[mapIndex].mapid);

    this.mapService.loadTiles(this.map);

    this.transport.setupPatrols();

    let canvasContainer = document.getElementById('concreteContainer');
    if (canvasContainer) {
      this.teardownGameboardCanvases(canvasContainer);
      this.setupGame(canvasContainer);
    }
  }

  @action
  changeMap (map) {
    this.loadMap(map.value);
  }

  @action
  setupGame(concreteContainer) {
    this.gameboard.setupQRSFromMap(this.map.MAP);
    this.gameboard.setupGameboardCanvases(concreteContainer, this.map, this.showTileHexInfo, this.showTileGraphics, this.showDebugLayer, this.showFieldOfViewLayer);
    let agentsObj = this.transport.setupAgents(this.model.mapdata[this.mapIndex].agents);

    this.players = agentsObj.players;
    this.agents = agentsObj.agents;

    this.transport.setupPatrols();

    // TODO put these back in:
    // this.transport.moveQueueTask.perform();
    // this.game.gameClock.perform();
  }

  @action
  teardownGameboardCanvases(concreteContainer) {
    concreteContainer.removeEventListener('click', this.handleContainerClick);
    // concreteContainer.removeEventListener('click', this.handleContainerClick);
  }

  @action
  doSomething() {

//     let hexeslayer = this.camera.viewport.layers[1];
// // console.log('viewport', this.camera.viewport);
//
//     hexeslayer.scene.context.fillStyle = "purple"
//     hexeslayer.scene.context.fillRect(-5 - this.mapService.mapOriginX, -5-this.mapService.mapOriginX, hexeslayer.width+5, hexeslayer.height+5);
//
//     this.camera.viewport.render();
  }


  @action
  toggleDebugLayer() {
    this.showDebugLayer = !this.showDebugLayer;
    this.camera.viewport.layers[2].visible = this.showDebugLayer;
    this.gameboard.showDebugLayer = this.showDebugLayer;
    this.camera.viewport.render();
  }

  @action
  toggleTiles() {
    this.showTileGraphics = !this.showTileGraphics;
    this.camera.viewport.layers[0].visible = this.showTileGraphics;
    this.camera.viewport.render();
  }

  @action
  toggleHexInfo() {
    this.showTileHexInfo = !this.showTileHexInfo;
    this.camera.viewport.layers[1].visible = this.showTileHexInfo;
    this.camera.viewport.render();
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
