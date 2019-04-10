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
  @tracked showTileGraphics = true;
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
  }

  loadMap(mapIndex) {
    this.mapIndex = mapIndex;
    this.map = this.model.mapdata[mapIndex].map;
    // this.agents = this.model.mapdata[mapIndex].agents;
    this.selectedMap = this.mapOptions.findBy('value', this.model.mapdata[mapIndex].mapid);

    this.mapService.loadTiles(this.map);

    this.transport.setupPatrols();

    // let canvasContainer = document.getElementById('concreteContainer');
    // if (canvasContainer) {
    //   this.teardownGameboardCanvases(canvasContainer);
    //   this.setupGame(canvasContainer);
    // }
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

    let debugLayer = this.camera.stage.getLayers()[2];
    // debugger;

    // debugLayer.clear();
    debugLayer.removeChildren();

    this.camera.stage.draw();

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
    this.gameboard.showDebugLayer = this.showDebugLayer;
    let layer = this.camera.stage.getLayers()[2];
    layer.visible(this.showDebugLayer);

  }

  @action
  toggleTiles() {
    this.showTileGraphics = !this.showTileGraphics;
    let layer = this.camera.stage.getLayers()[0];
    layer.visible(this.showTileGraphics);
  }

  @action
  toggleHexInfo() {
    this.showTileHexInfo = !this.showTileHexInfo;
    let layer = this.camera.stage.getLayers()[1];
    layer.visible(this.showTileHexInfo);
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
