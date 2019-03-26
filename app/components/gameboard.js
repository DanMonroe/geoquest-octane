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

  @tracked ships = emberArray();
  // @tracked tilesLoaded = null;
  @tracked showTileGraphics = ENV.game.board.showTileGraphics;
  @tracked showTilesWithLabels = ENV.game.board.showTilesWithLabels;
  // @tracked tileGraphics = [];
  // @tracked currentLayout = [];

  @tracked rect = null;
  @tracked centerX = null;
  @tracked centerY = null;

  constructor() {
    super(...arguments);

    this.mapService.loadTiles(Map1, this.showTileGraphics, this.showTilesWithLabels);
  }


  loadTiles(tileset) {
    console.log(tileset);

    this.currentLayout = new Layout({
      orientation: Layout.FLAT,
      size: new Point({x:48, y:48}),
      origin: new Point({x:0, y:0})
    });


    let tileGraphicsLoaded = 0;
    for (let i = 0; i < tileset.length; i++) {

      let tileGraphic = new Image();
      tileGraphic.src = tileset[i];
      tileGraphic.onload = (tile) => {
        // Once the image is loaded increment the loaded graphics count and check if all images are ready.
        // console.log(tile, this);

        tileGraphicsLoaded++;

        if (tileGraphicsLoaded === tileset.length) {
         this.tilesLoaded = Map1.MAP;

          this.gameboard.drawGrid(
            "gamecanvas",
            "hsl(60, 10%, 85%)",
            this.showTilesWithLabels,
            this.currentLayout,
            this.mapService.hexMap,
            this.showTileGraphics
          );

        }
      }

      this.tileGraphics.pushObject(tileGraphic);
    }
  }



  @action
  setupGameCanvas(canvas) {

    // canvas
    // let canvas = document.getElementById('gamecanvas');
    let rect = canvas.getBoundingClientRect();
    let centerX = (rect.width / 2) + rect.left;
    let centerY = (rect.height / 2) + rect.top;
    this.rect = rect;
    this.centerX = centerX;
    this.centerY = centerY;

    // Map setup
    this.mapService.setHexMap(this.hexService.createHexesFromMap(Map1.MAP));
    this.mapService.setTwoDimensionalMap(Map1.MAP);
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
