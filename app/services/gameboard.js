import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import concrete from 'concretejs';
import { Point } from '../objects/point'
import { Player } from '../objects/agents/player'

export default class GameboardService extends Service {

  @service ('map') mapService;
  @service ('hex') hexService;
  @service ('camera') camera;
  @service ('transport') transport;

  @tracked rect = null;

  @tracked mapOriginX = null;
  @tracked mapOriginY = null;

  @tracked centerX = null;
  @tracked centerY = null;

  @tracked viewport;
  @tracked redraw = false;

  @tracked pathDistanceToMouseHex = 0;
  @tracked mousePoint = `X: Y:`;
  @tracked mouseXY = `X: Y:`;
  @tracked currentHex = `Q:  R:  S: `;


  setupQRSFromMap(map) {

    let rows = map.length;
    let cols = map[0].length;

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {

        let mapObject = map[row][col];

        let q = col;
        let r = -(Math.floor(col / 2)) + row;
        let s = -q - r;

        mapObject.q = q;
        mapObject.r = r;
        mapObject.s = s;
      }
    }
  }

  setupGameboardCanvases(concreteContainer, map, showTileHexInfo, showTileGraphics) {

    // Map setup

    // this.mapService.set('hexMap', this.hexService.createHexesFromMap(map.MAP));

    // // subset of hexes:
    // // this.mapService.hexMap is ALL the hexes
    // // can we draw only the number of hexes that will fit in the canvas viewport?
    // // lets try 3 x 4 first, starting with id 35 (2, 1, -3)  map5 is row:2, col:2
    // // id: 36,col: 2,row: 3,
    //
    // console.log('x hexes', this.camera.maxViewportHexesX);
    // console.log('y hexes', this.camera.maxViewportHexesY);
    //
    // let subsetMap = [];
    // let rowsToGrab = 8;
    // let colsToGrab = 16;
    // let startRow = 0;
    // let startCol = 0
    // for (let r = startRow; r < (startRow + rowsToGrab); r++) {
    //   let subsetMapCols = [];
    //   for (let c = startCol; c < (startCol + colsToGrab); c++) {
    //     let thisMapObject = map.MAP[r][c];
    //     // console.log(thisMapObject);
    //     subsetMapCols.push(thisMapObject);
    //   }
    //   subsetMap.push(subsetMapCols);
    // }
    // // console.log('subsetMap', subsetMap);
    // this.mapService.set('hexMap', this.hexService.createHexesFromMap(subsetMap));

    // TODO  the createHexesFromMap is creating the coords of the hexes at 0,0,0 for the first one
    // TODO instead of figuring out what the hex q,r,s coords should be


    this.mapService.set('worldMap', map.MAP);
    this.camera.setUpWorldMap();

    // create viewport
    let viewport = new concrete.Viewport({
      width: 400,
      height: 325,
      container: concreteContainer
    });
    // let viewport = new concrete.Viewport({
    //   width: 680,
    //   height: 650,
    //   container: concreteContainer
    // });

    // create layers
    let gameLayer = new concrete.Layer();
    let hexLayer = new concrete.Layer();
    let mouseLayer = new concrete.Layer();

    gameLayer.visible = showTileGraphics;
    hexLayer.visible = showTileHexInfo;
    // add layers
    viewport.add(gameLayer).add(hexLayer).add(mouseLayer);

    // this.viewport = viewport;
    this.camera.viewport = viewport;
    this.camera.viewportWidth = viewport.width;
    this.camera.viewportHeight = viewport.height;
    // console.log('viewport', viewport);



    // subset of hexes:
    // this.mapService.hexMap is ALL the hexes
    // can we draw only the number of hexes that will fit in the canvas viewport?
    // lets try 3 x 4 first, starting with id 35 (2, 1, -3)  map5 is row:2, col:2
    // id: 36,col: 2,row: 3,

    // console.log('x hexes', this.camera.maxViewportHexesX);
    // console.log('y hexes', this.camera.maxViewportHexesY);


    let colsToGrab = Math.min(this.camera.maxViewportHexesX + 2, map.MAP[0].length);
    let rowsToGrab = Math.min(this.camera.maxViewportHexesY + 4, map.MAP.length);
    // let rowsToGrab = 8;
    // let colsToGrab = 16;
    let startRow = 0;
    let startCol = 0

    this.setHexmapSubset(startRow, startCol, rowsToGrab, colsToGrab);



    let centerX = 100;
    let centerY = 100;
    this.set('centerX', centerX);  // remove
    this.set('centerY', centerY);  // remove


    let hexcontext = this.camera.viewport.layers[1].scene.context;
    hexcontext.translate(this.mapService.mapOriginX, this.mapService.mapOriginY);

    let gamecontext = this.camera.viewport.layers[0].scene.context;
    gamecontext.translate(this.mapService.mapOriginX, this.mapService.mapOriginY);

    this.drawGrid(
      "gamecanvas",
      true,
      this.mapService.hexMap,
      true
    );

    //fixes a problem where double clicking causes text to get selected on the canvas
    concreteContainer.addEventListener('selectstart', (e) => {
      e.preventDefault(); return false;
      },
    false);

    concreteContainer.addEventListener('click', (event) => {
      if (this.camera.viewport) {
        this.hexClick(event)
      }
    });

    concreteContainer.addEventListener('mousemove', (event) => {
      if (this.camera.viewport) {
        this.hexMouseMove(event)
      }
    });
  }

  // TODO
  /**
   *
>>>>  Find out the most LeftX, LeftY, RightX, RightY during the loading of the hexes
>>>>  Use the first and last Point.  they have the x,y coords we need
   *
   */

  setHexmapSubset(startRow, startCol, numRows, numCols) {
    let subsetMap = [];
    for (let r = startRow; r < (startRow + numRows); r++) {
      let subsetMapCols = [];
      for (let c = startCol; c < (startCol + numCols); c++) {
        let thisMapObject = this.mapService.worldMap[r][c];
        // console.log(thisMapObject);
        subsetMapCols.push(thisMapObject);
      }
      subsetMap.push(subsetMapCols);
    }

    // console.log('subsetMap', subsetMap);
    this.mapService.set('hexMap', this.hexService.createHexesFromMap(subsetMap));
    this.mapService.set('startRow', startRow);
    this.mapService.set('startCol', startCol);
    this.mapService.set('numRows', numRows);
    this.mapService.set('numCols', numCols);

    let mapLength = this.mapService.hexMap.length;
    let topLeftPoint = this.mapService.currentLayout.hexToPixel(this.mapService.hexMap[0]);
    let bottomRightPoint = this.mapService.currentLayout.hexToPixel(this.mapService.hexMap[mapLength-1]);
    this.mapService.set('topLeftPoint', topLeftPoint);
    this.mapService.set('bottomRightPoint', bottomRightPoint);

    // console.log(this.mapService.hexMap[0], topLeftPoint);
    // console.log(this.mapService.hexMap[mapLength-1], bottomRightPoint);
  }

  setMaxRightXLoaded() {

  }

  drawGrid(id, withLabels, hexes, withTiles) {

    let gamecontext = this.camera.viewport.layers[0].scene.context;
    let hexcontext = this.camera.viewport.layers[1].scene.context;

    hexes.forEach((hex) => {
      this.drawHex(hexcontext, hex);
      if (withLabels) this.drawHexLabel(hexcontext, hex);
      if (withTiles) this.drawHexTile(gamecontext, hex);
    });

    this.camera.viewport.render();
  }

  drawHex(ctx, hex, fillStyle, strokeStyle = "black") {
// console.log(hex);
    let corners = this.mapService.currentLayout.polygonCorners(hex);

// console.log('corners', corners, hex);
    ctx.beginPath();
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 1;
    if (fillStyle) {
      ctx.fillStyle = fillStyle;
    }
    ctx.moveTo(corners[5].x, corners[5].y);
    for (var i = 0; i < 6; i++) {
      ctx.lineTo(corners[i].x, corners[i].y);
    }
    ctx.stroke();

  }

  drawHexLabel(ctx, hex) {
    let center = this.mapService.currentLayout.hexToPixel(hex);
// console.log('center', center);
    ctx.fillStyle = this.colorForHex(hex);
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // TODO put map t (tile) back in when we add map to the hex
    ctx.fillText(('id:' + hex.map.id), center.x, center.y-15);
    ctx.fillText((hex.col + "," + hex.row), center.x, center.y);
    ctx.fillText((hex.q + "," + hex.r + "," + hex.s), center.x, center.y+15);

    ctx.fillStyle="red";
    ctx.fillRect(center.x-2, center.y-2, 4, 4);
  }

  drawHexTile(ctx, hex) {
    let point = this.mapService.currentLayout.hexToPixel(hex);
    let x = Math.floor(point.x) - this.mapService.currentLayout.size.x;
    let y = Math.floor(point.y) - this.mapService.currentLayout.size.y - 4;

    let tileGraphics = [];
    if (typeof hex.map.t === 'number') {
      tileGraphics.push(this.mapService.getTileGraphic(hex.map.t));
    } else if(Array.isArray(hex.map.t)) {
      hex.map.t.forEach((tileIndex) => {
        tileGraphics.push(this.mapService.getTileGraphic(tileIndex));
      });
    }
    tileGraphics.forEach((tile) => {
      ctx.drawImage(tile , x, y, (this.mapService.currentLayout.size.x*2)+1, (this.mapService.currentLayout.size.y*2)+1);
    })
  }

  colorForHex(hex) {
    // Match the color style used in the main article
    if (hex.q === 0 && hex.r === 0 && hex.s === 0) {
      return "hsl(0, 50%, 0%)";
    } else if (hex.q === 0) {
      return "hsl(90, 70%, 35%)";
    } else if (hex.r === 0) {
      return "hsl(200, 100%, 35%)";
    } else if (hex.s === 0) {
      return "hsl(300, 40%, 50%)";
    } else {
      return "hsl(0, 0%, 50%)";
    }
  }

  hexMouseMove(event) {
    let boundingRect = this.camera.viewport.container.getBoundingClientRect(),
      x = event.clientX - boundingRect.left - this.centerX,
      y = event.clientY - boundingRect.top -this.centerY;

    // let mouse = this.getMouse(event);
    // console.log('mouse', mouse);
    // let x = mouse.x + this.centerX;
    // let y = mouse.y + this.centerY;

    let point = new Point({x:x, y:y});
    let thisHex = this.mapService.currentLayout.pixelToHex(point).round();
    let targetHex = this.mapService.findHexByQRS(thisHex.q, thisHex.r, thisHex.s);

    if(targetHex) {
      let shipHex = this.transport.transportHexes[Player.transportHexIndex];
      // let shipHex = this.transport.transportHexes[ENV.game.agents.player.index];
      let pathDistanceToMouseHex = this.mapService.findPath(this.mapService.worldMap, shipHex, targetHex);
      this.pathDistanceToMouseHex = pathDistanceToMouseHex.length;
    } else {
      this.pathDistanceToMouseHex = 0;
    }

    this.mouseXY = `X:${event.clientX} Y:${event.clientY}`;
    this.mousePoint = `X:${point.x} Y:${point.y}`;
    this.currentHex = `Q:${thisHex.q} R:${thisHex.r} S:${thisHex.s}`;
  }

  hexClick(event) {
    // console.groupCollapsed('hex report');

    let boundingRect = this.camera.viewport.container.getBoundingClientRect(),
      x = event.clientX - boundingRect.left - this.centerX,
      y = event.clientY - boundingRect.top -this.centerY;
    let point = new Point({x:x, y:y});
    let clickedHex = this.mapService.currentLayout.pixelToHex(point).round();
    let mappedHex = this.mapService.findHexByQRS(clickedHex.q, clickedHex.r, clickedHex.s);

    if (mappedHex && mappedHex.id) {
      // move ship
      let shipHex = this.transport.transportHexes[Player.transportHexIndex];
      this.transport.moveShipToHexTask.cancelAll();
      let path = this.mapService.findPath(this.mapService.worldMap, shipHex, mappedHex);
      this.transport.moveShipAlongPath(path);
    }
    // console.groupEnd();
  }

  getMouse(e) {
    let boundingRect = this.camera.viewport.container.getBoundingClientRect();
    var element = boundingRect, offsetX = 0, offsetY = 0, mx, my;
    // var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;

    // Compute the total offset
    if (element.offsetParent !== undefined) {
      do {
        offsetX += element.offsetLeft;
        offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
    }

    // Add padding and border style widths to offset
    // Also add the offsets in case there's a position:fixed bar
    // offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
    // offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;

    // We return a simple javascript object (a hash) with x and y defined
    return {x: mx, y: my};
  }
}
