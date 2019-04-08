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
  @tracked showDebugLayer = false;

  @tracked pathDistanceToMouseHex = 0;
  @tracked mousePoint = `X: Y:`;
  @tracked mouseXY = `X: Y:`;
  @tracked currentHex = `Q:  R:  S: `;
  @tracked lastMouseMoveTargetId = null;


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

  setupGameboardCanvases(concreteContainer, map, showTileHexInfo, showTileGraphics, showDebugLayer) {

    // Map setup
    this.mapService.set('worldMap', map.MAP);
    this.camera.setUpWorldMap();

    // create viewport
    let viewport = new concrete.Viewport({
      width: 400,
      height: 325,
      container: concreteContainer
    });

    // create layers
    let gameLayer = new concrete.Layer();
    let hexLayer = new concrete.Layer();
    let debugLayer = new concrete.Layer();

    gameLayer.visible = showTileGraphics;
    hexLayer.visible = showTileHexInfo;
    debugLayer.visible = showDebugLayer;

    // add layers
    viewport.add(gameLayer).add(hexLayer).add(debugLayer);

    // this.viewport = viewport;
    this.camera.viewport = viewport;
    this.camera.viewportWidth = viewport.width;
    this.camera.viewportHeight = viewport.height;
    // console.log('viewport', viewport);

    let boundingRect = this.camera.viewport.container.getBoundingClientRect();
    this.camera.offsetX = boundingRect.x;
    this.camera.offsetY = boundingRect.y;

    let colsToGrab = Math.min(this.camera.maxViewportHexesX + 2, map.MAP[0].length);
    let rowsToGrab = Math.min(this.camera.maxViewportHexesY + 4, map.MAP.length);

    let startRow = 0;
    let startCol = 0

    this.setHexmapSubset(startRow, startCol, rowsToGrab, colsToGrab);

    // let centerX = 100;
    // let centerY = 100;
    // this.set('centerX', centerX);  // remove
    // this.set('centerY', centerY);  // remove


    let hexcontext = this.camera.viewport.layers[1].scene.context;
    hexcontext.translate(this.mapService.mapOriginX, this.mapService.mapOriginY);

    let gamecontext = this.camera.viewport.layers[0].scene.context;
    gamecontext.translate(this.mapService.mapOriginX, this.mapService.mapOriginY);

    let debugcontext = this.camera.viewport.layers[2].scene.context;
    debugcontext.translate(this.mapService.mapOriginX, this.mapService.mapOriginY);

    this.showDebugLayer = showDebugLayer;

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

  clearDebugLayer() {
    let debugLayer = this.camera.viewport.layers[2];
    debugLayer.scene.context.clearRect(debugLayer.x-36, debugLayer.y-38, debugLayer.width + (-this.camera.x)+ 36, debugLayer.height + (-this.camera.y) + 36);
    this.camera.viewport.render();
  }

  drawPathToTarget(startHex, pathDistanceToMouseHex) {
    if (this.showDebugLayer) {
      // this.clearDebugLayer();

      let startPoint = this.mapService.currentLayout.hexToPixel(startHex);

      let ctx = this.camera.viewport.layers[2].scene.context;

      ctx.beginPath();
      ctx.strokeStyle = "purple";
      ctx.lineWidth = 3;
      ctx.fillStyle = "purple";
      ctx.moveTo(startPoint.x, startPoint.y);

      let pathLength = pathDistanceToMouseHex.length;
      for (let i = 0; i < pathLength; i++) {
        let nextPoint = this.mapService.currentLayout.hexToPixel(pathDistanceToMouseHex[i]);
        ctx.lineTo(nextPoint.x, nextPoint.y);
      }
      ctx.stroke();

      this.camera.viewport.render();
    }
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

  getHexAtMousePoint(event, shouldUpdateDebugInfo) {
    let mouse = this.getMouse(event);
    let x = mouse.x;
    let y = mouse.y;

    let point = new Point({x:x, y:y});
    let thisHex = this.mapService.currentLayout.pixelToHex(point).round();
    let targetHex = this.mapService.findHexByQRS(thisHex.q, thisHex.r, thisHex.s);

    if(shouldUpdateDebugInfo) {
      this.mouseXY = `X:${event.clientX} Y:${event.clientY}`;
      this.mousePoint = `X:${point.x} Y:${point.y}`;
      this.currentHex = `Q:${thisHex.q} R:${thisHex.r} S:${thisHex.s}`;
    }

    return targetHex;
  }

  hexMouseMove(event) {

    let targetHex = this.getHexAtMousePoint(event, true);


    if(targetHex && targetHex.id != this.lastMouseMoveTargetId) {
      this.clearDebugLayer();

      this.lastMouseMoveTargetId = targetHex.id;

      let shipHex = this.transport.transportHexes[Player.transportHexIndex];
      // let shipHex = this.transport.transportHexes[ENV.game.agents.player.index];
      let pathDistanceToMouseHex = this.mapService.findPath(this.mapService.worldMap, shipHex, targetHex, {debug:true});
      this.pathDistanceToMouseHex = pathDistanceToMouseHex.length;
      // console.log(pathDistanceToMouseHex);

      this.drawPathToTarget(shipHex, pathDistanceToMouseHex);

    } else {
      this.pathDistanceToMouseHex = 0;
    }

  }

  hexClick(event) {
    let targetHex = this.getHexAtMousePoint(event, false);

    if (targetHex && targetHex.id) {
      // if (this.showDebugLayer) {
        this.clearDebugLayer();
      // }

      // move ship
      let shipHex = this.transport.transportHexes[Player.transportHexIndex];
      this.transport.moveShipToHexTask.cancelAll();

      let path = this.mapService.findPath(this.mapService.worldMap, shipHex, targetHex, {debug:true});
      // console.log(path  );
      this.transport.moveShipAlongPath(path);
    }
  }

  getMouse(e) {
    let boundingRect = this.camera.viewport.container.getBoundingClientRect();
    var element = boundingRect, mx, my;
    let offsetX = boundingRect.x + this.camera.x + this.mapService.currentLayout.halfHexWidth;
    let offsetY = boundingRect.y + this.camera.y + this.mapService.currentLayout.halfHexWidth;

    // Compute the total offset
    if (element.offsetParent !== undefined) {
      do {
        offsetX += element.offsetLeft;
        offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
    }

    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;

    return {x: mx, y: my};
  }
}
