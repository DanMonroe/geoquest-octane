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
  offsetX = 0;
  offsetY = 0;

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

    let hexWidth = this.mapService.currentLayout.hexWidth;
    let hexHeight = this.mapService.currentLayout.hexHeight;

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

  }

  worldX = 0;
  worldY = 0;

  // How many hexes fit in the viewport:
  get maxViewportHexesX() {
    // let hexPairWidth = this.mapService.currentLayout.hexWidth * 1.5;
    let numPairs = Math.floor(this.viewportWidth / this.mapService.currentLayout.hexPairWidth);
    let viewportWidthRemainder = this.viewportWidth - (numPairs * this.mapService.currentLayout.hexPairWidth);
    return viewportWidthRemainder >= this.mapService.currentLayout.hexWidth ?
      (numPairs * 2) + 1 :
      numPairs * 2;
  }
  get maxViewportHexesY() {
    let viewportHeightMinusHalfHex = this.viewportHeight - (this.mapService.currentLayout.hexHeight / 2);
    return Math.floor(viewportHeightMinusHalfHex / this.mapService.currentLayout.hexHeight);
  }

  hexWithinViewport (hex) {
    let point = this.mapService.currentLayout.hexToPixel(hex)
    // return (point.y + this.offsetY <= this.viewportHeight) &&
    //   (point.x + this.offsetX >= 0) &&
    //   (point.x + this.offsetX <= this.viewportWidth) &&
    //   (point.y + this.offsetY >= 0)

    let isNorth = point.y + this.offsetY <= this.viewportHeight;
    let isEast = point.x + this.offsetX >= 0;
    let isWest = point.x + this.offsetX <= this.viewportWidth;
    let isSouth = point.y + this.offsetY >= 0;

    let inViewport = isNorth && isEast && isWest && isSouth;
    if (!inViewport) {
      console.log(isNorth, isEast, isWest, isSouth, point, hex);
    }
    return inViewport;
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
// console.log(args);
    let scrollX = args.x;
    let scrollY = args.y;

    this.x += scrollX;
    this.y += scrollY;

    // console.log(scrollX, scrollY);

    this.redraw = true;

    // call another function that does:
    if (this.redraw) {

      // TODO
      /*
      As we scroll, figure out when to grab a new section of hexes and reset hexMap

      >>>>  Find out the most LeftX, LeftY, RightX, RightY during the loading of the hexes
      >>>>  Use the first and last Point.  they have the x,y coords we need


      if this.x + viewport width > width of currently selected hexes

      this.gameboard.setHexmapSubset(startRow, startCol, rowsToGrab, colsToGrab);

     */


      let tilesslayer = this.viewport.layers[0];
      let hexeslayer = this.viewport.layers[1];
      let debuglayer = this.viewport.layers[2];
      let fovlayer = this.viewport.layers[3];
      let fovblockedlayer = this.viewport.layers[4];

      // console.log(hexeslayer);


      // console.log('absoluteX', absoluteX);
      // console.log(this.mapService.worldMap[0].length);
      // console.log(this.mapService.numCols);


      // maxRightXLoaded = x coord of right side of the last hex of the loaded hexes
      // minLeftXLoaded = x coord of left side of the first hex of the loaded hexes
      /**
       *
      432 - rightpoint
      400 viewport
      72 = hex width
       absoluteX / 2  = 36
       */

      // 400 + 36 > 432   - load new

      // East
      if (scrollX < 0) {
        // console.log(this.viewportWidth + (-this.x / 2));
        if (this.viewportWidth + (-this.x) > this.mapService.bottomRightPoint.x + (this.mapService.currentLayout.hexWidth / 2)) {
          // console.log('this.mapService.startCol + this.mapService.numCols', this.mapService.startCol + this.mapService.numCols);
          if ((this.mapService.startCol + this.mapService.numCols) < this.mapService.worldMap[0].length) {

            // console.log('load new hexes');
            this.gameboard.setHexmapSubset(this.mapService.startRow, this.mapService.startCol + 1, this.mapService.numRows, this.mapService.numCols);
          } else {
            // console.log('hit eastern most limit');
          }
        }
      }

      // South
      if (scrollY < 0) {
        // console.log(this.viewportHeight + (-this.y), this.mapService.bottomRightPoint.y);
        if (this.viewportHeight + (-this.y) >= this.mapService.bottomRightPoint.y) {
          // console.log('this.mapService.startRow + this.mapService.numRows', this.mapService.startRow + this.mapService.numRows);
          if ((this.mapService.startRow + this.mapService.numRows) < this.mapService.worldMap.length) {

            // console.log('load new hexes');
            this.gameboard.setHexmapSubset(this.mapService.startRow + 1, this.mapService.startCol, this.mapService.numRows, this.mapService.numCols);
          } else {
            // console.log('hit southern most limit');
          }
        }
      }

      // North
      if (scrollY > 0) {
        // console.log(-this.y - this.mapService.currentLayout.hexHeight, this.mapService.topLeftPoint.y);
        if (-this.y - this.mapService.currentLayout.hexHeight <= this.mapService.topLeftPoint.y) {
          if (this.mapService.startRow > 0) {

            // console.log('load new hexes');
            this.gameboard.setHexmapSubset(this.mapService.startRow - 1, this.mapService.startCol, this.mapService.numRows, this.mapService.numCols);
          } else {
            // console.log('hit northern most limit');
          }
        }
      }

      // West
      if (scrollX > 0) {
        // console.log(-this.x - this.mapService.currentLayout.hexWidth, this.mapService.topLeftPoint.x);
        if (-this.x - this.mapService.currentLayout.hexWidth <= this.mapService.topLeftPoint.x - (this.mapService.currentLayout.hexWidth/2)) {
          if (this.mapService.startCol > 0) {

            // console.log('load new hexes');
            this.gameboard.setHexmapSubset(this.mapService.startRow, this.mapService.startCol-1, this.mapService.numRows, this.mapService.numCols);
          } else {
            // console.log('hit western most limit');
          }
        }
      }



      // clear rectangle

      let clearStartX = -5 - this.mapService.mapOriginX;
      let clearStartY = -5 - this.mapService.mapOriginY;
      let clearEndX = 15 + hexeslayer.width + Math.abs(this.x);
      let clearEndY = 15 + hexeslayer.height + Math.abs(this.y);
      tilesslayer.scene.context.clearRect(clearStartX, clearStartY, clearEndX, clearEndY);
      hexeslayer.scene.context.clearRect(clearStartX, clearStartY, clearEndX, clearEndY);
      fovlayer.scene.context.clearRect(clearStartX, clearStartY, clearEndX, clearEndY);
      fovblockedlayer.scene.context.clearRect(clearStartX, clearStartY, clearEndX, clearEndY);

      // Move
      tilesslayer.scene.context.translate(scrollX, scrollY);
      hexeslayer.scene.context.translate(scrollX, scrollY);
      debuglayer.scene.context.translate(scrollX, scrollY);
      fovlayer.scene.context.translate(scrollX, scrollY);
      fovblockedlayer.scene.context.translate(scrollX, scrollY);

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
