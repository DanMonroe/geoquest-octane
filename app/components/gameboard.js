import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import {inject as service} from '@ember/service';
import { A as emberArray } from '@ember/array';
import { alias } from '@ember/object/computed';

import ENV from 'geoquest-octane/config/environment';


export default class GameboardComponent extends Component {

  @service ('hex') hexService;
  @service ('map') mapService;
  @service ('gameboard') gameboard;
  @service ('transport') transport;
  @service ('play') play;

  // @tracked showShip = true;

  // @tracked showTileGraphics = false;
  @tracked showTileGraphics = ENV.game.board.showTileGraphics;
  @tracked showTileHexInfo = false;
  @tracked showTilesWithLabels = true;

  @tracked map = null;
  @tracked transports = null;
  @tracked selectedMap = 0;
  @tracked ships = emberArray();

  @alias playerShipHex = this.transport.transportHexes[ENV.game.transports[0].index];


  mapOptions = [
    {name: "Small", value: 0},
    {name: "Island", value: 1},
    {name: "Patrolling Pirate", value: 2}
  ];

  constructor() {
    super(...arguments);
    this.model = arguments[1];
    this.mapService.loadLayout();
    this.loadMap(1);
  }

  // get enemyToPlayerDistance() {
  //   console.log('getting enemy ship');
  //   return this.ships.objectAt(1).enemyToPlayerDistance;
  // }

  loadMap(mapIndex) {
    this.map = this.model.mapdata[mapIndex].map;
    this.transports = this.model.mapdata[mapIndex].transports;
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
    this.gameboard.setupGameboardCanvases(concreteContainer, this.map);
    this.ships = this.transport.setupShips(this.transports);

    this.transport.setupPatrols();

    this.transport.moveQueueTask.perform();
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
}
