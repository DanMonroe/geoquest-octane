import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { A as emberArray } from '@ember/array';
import move from 'ember-animated/motions/move';
import {inject as service} from '@ember/service';
import { task, timeout } from 'ember-concurrency';

import { Layout } from '../objects/layout';
import { Point } from '../objects/point';

import ENV from 'geoquest-octane/config/environment';

import { Map1 } from 'geoquest-octane/objects/maps/map1';

export default class GameboardComponent extends Component {

  @service ('hex') hexService;
  @service ('map') mapService;
  @service ('gameboard') gameboard;
  @service ('transport') transport;

  // @tracked ships = emberArray();
  @tracked showShip = true;
  // @tracked tilesLoaded = null;
  @tracked showTileGraphics = ENV.game.board.showTileGraphics;
  @tracked showTilesWithLabels = ENV.game.board.showTilesWithLabels;
  // @tracked tileGraphics = [];
  // @tracked currentLayout = [];

  // @tracked rect = null;
  // @tracked centerX = null;
  // @tracked centerY = null;

  constructor() {
    super(...arguments);

    this.mapService.loadTiles(Map1, this.showTileGraphics, this.showTilesWithLabels);
  }




  @action
  setupGameCanvas(canvas) {

    // canvas
    // let canvas = document.getElementById('gamecanvas');
    let rect = canvas.getBoundingClientRect();
    let centerX = (rect.width / 2) + rect.left;
    let centerY = (rect.height / 2) + rect.top;
    this.gameboard.set('rect', rect);
    this.gameboard.set('centerX', centerX);
    this.gameboard.set('centerY', centerY);

    // Map setup
    this.mapService.setHexMap(this.hexService.createHexesFromMap(Map1.MAP));
    this.mapService.setTwoDimensionalMap(Map1.MAP);

    // Ship setup
    if (this.showShip) {
      this.transport.setupShip()
    }
  }

  @action
  hexReport(hexId, event) {
    console.group('hex report');
  }

  @action
  hexMouseMove(event) {
    let x = event.clientX - this.centerX;
    let y = event.clientY - this.centerY;
  }
}
