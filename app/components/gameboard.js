import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import {inject as service} from '@ember/service';
import { A as emberArray } from '@ember/array';

import ENV from 'geoquest-octane/config/environment';


export default class GameboardComponent extends Component {

  @service ('hex') hexService;
  @service ('map') mapService;
  @service ('gameboard') gameboard;
  @service ('transport') transport;
  @service ('game') game;

  // @tracked showShip = true;

  // @tracked showTileGraphics = false;
  @tracked showTileGraphics = false;
  @tracked showTileHexInfo = true;
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
    this.gameboard.setupGameboardCanvases(concreteContainer, this.map, this.showTileHexInfo, this.showTileGraphics);
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
  toggleTiles() {
    this.showTileGraphics = !this.showTileGraphics;
    this.gameboard.viewport.layers[0].visible = this.showTileGraphics;
    this.gameboard.viewport.render();
  }

  @action
  toggleHexInfo() {
    this.showTileHexInfo = !this.showTileHexInfo;
    this.gameboard.viewport.layers[1].visible = this.showTileHexInfo;
    this.gameboard.viewport.render();
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
