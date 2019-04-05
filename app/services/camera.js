import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import {assert} from '@ember/debug';
import { task, timeout } from 'ember-concurrency';

export default class CameraService extends Service {

  @service ('map') mapService;
  @service ('gameboard') gameboard;  // remove this ?

  /**
   * x and y: The current position of the camera.
   * In this implementation, we are assuming that (x,y)
   * points to the top left corner of visible portion of the map.
   */
  @tracked x = 0;
  @tracked y = 0;

  // camera viewport
  viewport = null;
  /**
   * width and height: The size of the camera's viewport.
   *
   */
  @tracked viewportWidth = 0;
  @tracked viewportHeight = 0;
  // get viewportWidth() {
  //   // debugger;
  //   console.count();
  //   return this.viewport ? this.viewport.width : 0;
  // };
  // get viewportHeight() {
  //   // debugger;
  //   console.count();
  //   return this.viewport ? this.viewport.height : 0;
  // };

  /**
   * maxX and maxY: The limit for the camera's position
   * — The lower limit will nearly always be (0,0),
   *  and in this case the upper limit is equal to the
   *  size of the world minus the size of the camera's viewport.
   */
  get maxX() {
    let maxX = this.worldX - this.viewportWidth;
    return maxX;
  };
  get maxY() {
    let maxY = this.worldY - this.viewportHeight;
    return maxY;
  };

  setUpWorldMap() {
    assert("Must set currentLayout and worldMap", this.mapService.currentLayout && this.mapService.worldMap);

    let hexWidth = this.mapService.currentLayout.hexWidth();
    let hexHeight = this.mapService.currentLayout.hexHeight();
    // console.log('hexWidth', hexWidth, 'hexHeight', hexHeight);

    let mapRows = this.mapService.worldMap.length
    let mapColumns = this.mapService.worldMap[0].length

    let worldX = 0;
    if ((mapColumns % 2) === 1) {   // odd rows
      worldX = (((mapColumns+1) / 2) * (hexWidth * 1.5)) - (hexWidth * .75);
    } else { // even
      worldX = (mapColumns / 2) * (hexWidth * 1.5);
    }
    this.set('worldX', worldX);

    let worldY = Math.round((mapRows * hexHeight) + (hexHeight / 2));
    this.set('worldY', worldY);

    // console.log('mapRows', mapRows, 'mapColumns', mapColumns);
    // console.log('worldX', worldX, 'worldY', worldY);
  }
  worldX = 0;
  worldY = 0;

  // How many hexes fit in the viewport:
  get maxViewportHexesX() {
    return Math.floor(this.viewportWidth / this.mapService.currentLayout.hexWidth());
  }
  get maxViewportHexesY() {
    return Math.floor(this.viewportHeight / this.mapService.currentLayout.hexHeight());
  }

  // http://ember-concurrency.com/docs/examples/increment-buttons
  @task( function*(x, y) {
    let speed = 300;
    while (true) {

      this.scroll({x: x, y: y});

      yield timeout(speed);
      speed = Math.max(25, speed * 0.8);
    }
  }) scrollMap;

  scroll(args) {

    let scrollX = args.x;
    let scrollY = args.y;

    this.x += scrollX;
    this.y += scrollY;

    // console.log(scrollX, scrollY);

    this.redraw = true;

    // call another function that does:
    if (this.redraw) {

      let tilesslayer = this.viewport.layers[0];
      let hexeslayer = this.viewport.layers[1];

      // console.log(hexeslayer);

      let absoluteX = Math.abs(this.x);
      let absoluteY = Math.abs(this.y);

      let clearStartX = -5 - this.mapService.mapOriginX;
      let clearStartY = -5 - this.mapService.mapOriginY;
      let clearEndX = 15 + hexeslayer.width + absoluteX;
      let clearEndY = 15 + hexeslayer.height + absoluteY;

      // console.log('clearing rect', clearStartX, clearStartY, clearEndX, clearEndY, hexeslayer.scene.context);

      tilesslayer.scene.context.clearRect(clearStartX, clearStartY, clearEndX, clearEndY);
      hexeslayer.scene.context.clearRect(clearStartX, clearStartY, clearEndX, clearEndY);

      tilesslayer.scene.context.translate(scrollX, scrollY);
      hexeslayer.scene.context.translate(scrollX, scrollY);

      // move drawGrid into camera service?
      this.gameboard.drawGrid(
        "gamecanvas",
        true,
        this.mapService.hexMap,
        true
      );
      this.redraw = false;
    }

  }

}
