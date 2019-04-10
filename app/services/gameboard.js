import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Konva from 'konva';
import { Point } from '../objects/point'
import { Player } from '../objects/agents/player'

export default class GameboardService extends Service {

  @service ('map') mapService;
  @service ('hex') hexService;
  @service ('camera') camera;
  @service ('transport') transport;
  @service ('path') pathService;

  @tracked rect = null;

  @tracked mapOriginX = null;
  @tracked mapOriginY = null;

  @tracked centerX = null;
  @tracked centerY = null;

  @tracked viewport;
  @tracked redraw = false;
  @tracked showDebugLayer = false;
  @tracked showFieldOfViewLayer = false;

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

  setupGameboardCanvases(concreteContainer, map, showTileHexInfo, showTileGraphics, showDebugLayer, showFieldOfViewLayer) {

    // Map setup
    this.mapService.set('worldMap', map.MAP);
    this.camera.setUpWorldMap();

    // create viewport
    let stage = new Konva.Stage({
      width: 800,
      height: 450,
      container: '#concreteContainer' // or "#containerId" or ".containerClass"
    });


    // create layers
    // add canvas element
    let layer = new Konva.Layer();
    stage.add(layer);

    let gameLayer = new Konva.Layer();
    let hexLayer = new Konva.Layer();
    let debugLayer = new Konva.Layer();
    let fieldOfViewLayer = new Konva.Layer();

    debugLayer.disableHitGraph();
    fieldOfViewLayer.disableHitGraph();

    stage.add(gameLayer);
    stage.add(hexLayer);
    stage.add(debugLayer);
    stage.add(fieldOfViewLayer);

    this.camera.stage = stage;
    this.camera.viewportWidth = stage.width();
    this.camera.viewportHeight = stage.height();

    let boundingRect = this.camera.stage.getClientRect();

    // let boundingRect = this.camera.viewport.container.getBoundingClientRect();
    this.camera.offsetX = boundingRect.x; // TODO need this offsetX and Y?
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

    // console.log('FOVBlockedContext',FOVBlockedContext);
    this.showDebugLayer = showDebugLayer;
    this.showFieldOfViewLayer = showFieldOfViewLayer;

    this.drawGrid(
      "gamecanvas",
      true,
      this.mapService.hexMap,
      true

    );


    this.camera.stage.on('click', () => {
      this.hexClick(this.camera.stage.getPointerPosition());
    });

    this.camera.stage.on('mousemove', () => {
      this.hexMouseMove(this.camera.stage.getPointerPosition());
    });

    //fixes a problem where double clicking causes text to get selected on the canvas
    // concreteContainer.addEventListener('selectstart', (e) => {
    //   e.preventDefault(); return false;
    //   },
    // false);

    // concreteContainer.addEventListener('click', (event) => {
    //   if (this.camera.viewport) {
    //     this.hexClick(event)
    //   }
    // });
    //
    // concreteContainer.addEventListener('mousemove', (event) => {
    //   if (this.camera.viewport) {
    //     this.hexMouseMove(event)
    //   }
    // });
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

    let layers = this.camera.stage.getLayers();
    // let hexlayer = layers[0];
    let gamelayer = layers[0];
    let hexlayer = layers[1];

    // let gamecontext = this.camera.viewport.layers[0].scene.context;
    // let hexcontext = this.camera.viewport.layers[1].scene.context;

    hexes.forEach((hex) => {
      this.drawHex(hexlayer, hex);
      if (withLabels) this.drawHexLabel(hexlayer, hex);
      if (withTiles) this.drawHexTile(gamelayer, hex);
    });
    this.camera.stage.draw();

    // this.camera.viewport.render();
  }

  drawHex(layer, hex) {
    let corners = this.mapService.currentLayout.polygonCorners(hex);

// console.log('corners', corners, hex);

    let points = [];
    for (var i = 0; i < 6; i++) {
      points.push(corners[i].x);
      points.push(corners[i].y);
    }
    let poly = new Konva.Line({
      points: points,
      stroke: 'black',
      strokeWidth: 1,
      closed: true
    });

    layer.add(poly);

  }

  drawHexLabel(layer, hex) {
    let center = this.mapService.currentLayout.hexToPixel(hex);

    let idText = new Konva.Text({
      x: center.x,
      y: center.y-19,
      text: 'id:' + hex.map.id,
      fontSize: 14,
      fontFamily: 'sans-serif',
      fill: this.colorForHex(hex)
    });
    idText.offsetX(idText.width() / 2);

    let colRowText = new Konva.Text({
      x: center.x,
      y: center.y-4,
      text: hex.col + "," + hex.row,
      fontSize: 14,
      fontFamily: 'sans-serif',
      fill: this.colorForHex(hex)
    });
    colRowText.offsetX(colRowText.width() / 2);

    let qrsText = new Konva.Text({
      x: center.x,
      y: center.y+11,
      text: hex.q + "," + hex.r + "," + hex.s,
      fontSize: 14,
      fontFamily: 'sans-serif',
      fill: this.colorForHex(hex)
    });
    qrsText.offsetX(qrsText.width() / 2);

    layer.add(idText);
    layer.add(colRowText);
    layer.add(qrsText);

    let rect = new Konva.Rect({
      x: center.x-2,
      y: center.y-2,
      width: 4,
      height: 4,
      fill: 'red'
    });

    // add the shape to the layer
    layer.add(rect);

    // TODO put map t (tile) back in when we add map to the hex
  }

  drawHexTile(layer, hex) {
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
      let tileImage = new Konva.Image({
        x: x,
        y: y,
        image: tile,
        width: (this.mapService.currentLayout.size.x*2)+1,
        height: (this.mapService.currentLayout.size.y*2)+1
      });
      layer.add(tileImage);
    })
  }

  clearDebugLayer() {
    let debugLayer = this.camera.stage.getLayers()[2];
    debugLayer.removeChildren();
    debugLayer.clear();
  }

  clearFOVLayer() {
    let layer = this.camera.stage.getLayers()[3];
    layer.removeChildren();
    layer.clear();
  }

  drawFieldOfView(startHex, targetHex) {
    if (this.showFieldOfViewLayer) {
      this.clearFOVLayer();

      // figure distance between two hexes, add one for start hex = number of points to draw
      let distanceFunction = this.pathService.heuristics.hex;
      let startPoint = this.mapService.currentLayout.hexToPixel(startHex);
      let targetPoint = this.mapService.currentLayout.hexToPixel(targetHex);

      let distanceInHexes = distanceFunction(startHex, targetHex)

      // extract distance
      let lineDistance = Math.sqrt( Math.pow((targetPoint.x - startPoint.x),2) + Math.pow((targetPoint.y - startPoint.y),2));
      let segmentDistance = lineDistance / distanceInHexes;

      let angle = Math.atan2(targetPoint.y - startPoint.y, targetPoint.x - startPoint.x);
      let sin = Math.sin(angle) * segmentDistance;
      let cos = Math.cos(angle) * segmentDistance;

      let layer = this.camera.stage.getLayers()[3];

      let newY = startPoint.y;
      let newX = startPoint.x;

      let sightBlocked = false;
      let blockedLoopStart = null;

      for (let i = 0; i < distanceInHexes; i++) {
        // move
        newY += sin;
        newX += cos;

        if(!sightBlocked) {
          let point = new Point({x:newX, y:newY});
          let thisHex = this.mapService.currentLayout.pixelToHex(point).round();
          let segmentHex = this.mapService.findHexByQRS(thisHex.q, thisHex.r, thisHex.s);
          // console.log('segmentHex', segmentHex);

          // If point falls inside a hex that is blocks, then stop loop.
          // each hex after that is blocked
          if (segmentHex.map.path.v === 1) {
            sightBlocked = true;
            blockedLoopStart = i;
            // ctx.strokeStyle = "red";
            break;
          }
        }

        let circle = new Konva.Circle({
          x: newX,
          y: newY,
          radius: 4,
          fill: '#fff900'
        });

        // add the shape to the layer
        layer.add(circle);

      }

      if (blockedLoopStart !== null) {
        newY -= sin;
        newX -= cos;

        for (let j = blockedLoopStart; j < distanceInHexes; j++) {
          newY += sin;
          newX += cos;

          let circle = new Konva.Circle({
            x: newX,
            y: newY,
            radius: 4,
            fill: 'red'
          });

          layer.add(circle);
        }
      }

      this.camera.stage.draw();

    }
  }

  drawPathToTarget(startHex, pathDistanceToMouseHex) {
    if (this.showDebugLayer) {
      // this.clearDebugLayer();

      let startPoint = this.mapService.currentLayout.hexToPixel(startHex);

      let points = [startPoint.x, startPoint.y];
      let pathLength = pathDistanceToMouseHex.length;
      for (let i = 0; i < pathLength; i++) {
        let nextPoint = this.mapService.currentLayout.hexToPixel(pathDistanceToMouseHex[i]);
        points.push(nextPoint.x);
        points.push(nextPoint.y);
      }

      var purpleline = new Konva.Line({
        points: points,
        stroke: 'purple',
        strokeWidth: 3,
        lineCap: 'round',
        lineJoin: 'round'
      });

      let debugLayer = this.camera.stage.getLayers()[2]
      debugLayer.add(purpleline);
      this.camera.stage.draw();
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

  getHexAtMousePoint(mouseCoords, shouldUpdateDebugInfo) {
  // getHexAtMousePoint(event, shouldUpdateDebugInfo) {
  //   let mouse = this.getMouse(event);
    let x = mouseCoords.x;
    let y = mouseCoords.y;

    let point = new Point({x:x, y:y});
    let thisHex = this.mapService.currentLayout.pixelToHex(point).round();
    let targetHex = this.mapService.findHexByQRS(thisHex.q, thisHex.r, thisHex.s);

    if(shouldUpdateDebugInfo) {
      this.mouseXY = `X:${mouseCoords.x} Y:${mouseCoords.y}`;
      // this.mouseXY = `X:${event.clientX} Y:${event.clientY}`;
      this.mousePoint = `X:${point.x} Y:${point.y}`;
      this.currentHex = `Q:${thisHex.q} R:${thisHex.r} S:${thisHex.s}`;
    }

    return targetHex;
  }

  hexMouseMove(mouseCoords) {
  // hexMouseMove(event) {

    let targetHex = this.getHexAtMousePoint(mouseCoords, true);
    // let targetHex = this.getHexAtMousePoint(event, true);


    if(targetHex && targetHex.id != this.lastMouseMoveTargetId) {
      this.clearDebugLayer();

      this.lastMouseMoveTargetId = targetHex.id;

      let shipHex = this.transport.transportHexes[Player.transportHexIndex];

      let pathDistanceToMouseHex = this.mapService.findPath(this.mapService.worldMap, shipHex, targetHex, {debug:false});
      // let pathDistanceToMouseHex = this.mapService.findPath(this.mapService.worldMap, shipHex, targetHex, {debug:true});

      this.pathDistanceToMouseHex = pathDistanceToMouseHex.length;
      console.log(this.pathDistanceToMouseHex);

      this.drawPathToTarget(shipHex, pathDistanceToMouseHex);
      this.drawFieldOfView(shipHex, targetHex);

    } else {
      this.pathDistanceToMouseHex = 0;
    }

  }

  hexClick(mouseCoords) {
  // hexClick(event) {
    console.log(mouseCoords);
    let targetHex = this.getHexAtMousePoint(mouseCoords, false);

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
