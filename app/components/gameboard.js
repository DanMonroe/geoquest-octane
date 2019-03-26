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

  @tracked pathDistanceToMouseHex = 0;
  @tracked mouseXY;
  @tracked currentHex;

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

    let x = event.clientX - this.gameboard.centerX;
    let y = event.clientY - this.gameboard.centerY;
    console.log('click centerX', this.gameboard.centerX, 'centerY', this.gameboard.centerY, event, "x:", x, "y:", y);
    let point = new Point({x:x, y:y});
    console.log('clicked point', point);
    console.log('this.currentLayout', this.mapService.currentLayout);
    let clickedHex = this.mapService.currentLayout.pixelToHex(point).round();

    let mappedHex = this.mapService.findHexByQRS(clickedHex.q, clickedHex.r, clickedHex.s);
    // let mappedHex = this.mapService.hexMap.find((hex) => {
    //   return (clickedHex.q === hex.q) && (clickedHex.r === hex.r) && (clickedHex.s === hex.s)
    // })
    console.log('mappedHex', mappedHex);

    let hexToPixelPoint = this.mapService.currentLayout.hexToPixel(clickedHex);
    console.log('point', hexToPixelPoint);

    if(this.moveShipOnClick) {
      this.get('moveShipToHexTask').cancelAll();
      let path = this.mapService.findPath(this.mapService.twoDimensionalMap, this.transport.shipHex, mappedHex);
      this.moveShipAlongPath(path);
    }

    console.groupEnd();
  }

  @action
  hexMouseMove(event) {
    let x = event.clientX - this.gameboard.centerX;
    let y = event.clientY - this.gameboard.centerY;

    let point = new Point({x:x, y:y});
    let thisHex = this.mapService.currentLayout.pixelToHex(point).round();

    let targetHex = this.mapService.findHexByQRS(thisHex.q, thisHex.r, thisHex.s);

    if(targetHex) {
      let pathDistanceToMouseHex = this.mapService.findPath(this.mapService.twoDimensionalMap, this.transport.shipHex, targetHex);
      this.pathDistanceToMouseHex = pathDistanceToMouseHex.length;
    } else {
      this.pathDistanceToMouseHex = 0;
    }

    this.mouseXY = `X:${event.clientX} Y:${event.clientY}`;
    this.currentHex = `Q:${thisHex.q} R:${thisHex.r} S:${thisHex.s}`;
  }
}
