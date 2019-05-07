import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Konva from 'konva';
import { Point } from '../objects/point'
// import { Player } from '../objects/agents/player'

export default class GameboardService extends Service {

  @service ('map') mapService;
  @service ('hex') hexService;
  @service ('camera') camera;
  @service ('transport') transport;
  @service ('path') pathService;
  @service ('game') game;

  @tracked rect = null;


  @tracked centerX = null;
  @tracked centerY = null;

  @tracked viewport;
  @tracked redraw = false;
  @tracked showDebugLayer = false;
  @tracked showFieldOfViewLayer = false;

  @tracked pathDistanceToMouseHex = 0;
  @tracked mousePoint = `X: Y:`;
  @tracked mouseXY = `X: Y:`;
  @tracked currentHex = `Q:  R:`;
  @tracked lastMouseMoveTargetId = null;
  @tracked playerHex = `Q:  R:`;
  @tracked playerXY = `X: Y:`;
  @tracked shipHex = `Q:  R:`;
  @tracked shipXY = `X: Y:`;
  @tracked enemyHex = `Q:  R:`;


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

  setupGameboardCanvases(konvaContainer, map, showDebugLayer, showFieldOfViewLayer) {

    let stage = new Konva.Stage({
      width: window.innerWidth,
      height: window.innerHeight,
      container: '#konvaContainer'
    });
    // create layers

    let gameLayer = new Konva.Layer({draggable: false});
    let hexLayer = new Konva.Layer({draggable: false});
    let debugLayer = new Konva.Layer({draggable: false});
    let fieldOfViewLayer = new Konva.Layer({draggable: false});
    let agentsLayer = new Konva.Layer({draggable: false});

    gameLayer.disableHitGraph();
    hexLayer.disableHitGraph();
    debugLayer.disableHitGraph();
    fieldOfViewLayer.disableHitGraph();
    agentsLayer.disableHitGraph();

    stage.add(gameLayer);
    stage.add(hexLayer);
    stage.add(debugLayer);
    stage.add(fieldOfViewLayer);
    stage.add(agentsLayer);

    this.camera.stage = stage;
    this.camera.viewportWidth = stage.width();
    this.camera.viewportHeight = stage.height();

    let colsToGrab = map.MAP[0].length;
    let rowsToGrab = map.MAP.length;
    // let colsToGrab = Math.min(this.camera.maxViewportHexesX + 2, map.MAP[0].length);
    // let rowsToGrab = Math.min(this.camera.maxViewportHexesY + 4, map.MAP.length);

    let startRow = 0;
    let startCol = 0

    this.mapService.setHexmapSubset(startRow, startCol, rowsToGrab, colsToGrab);

    this.showDebugLayer = showDebugLayer;
    this.showFieldOfViewLayer = showFieldOfViewLayer;

    let container = stage.container();

    // make it focusable
    container.tabIndex = 1;
    // focus it
    // also stage will be in focus on its click
    container.focus();

    // TODO can we use ember-keyboard instead?
    container.addEventListener('keydown', (e) => {
      // https://keycode.info/
      switch(e.keyCode) {
        case 70:  // F [ire]
          if (this.game.player.boardedTransport) {
            this.game.player.boardedTransport.fire();
          }
          break;
        case 81:  // Q
          this.movePlayer('NW');
          break;
        case 87:  // W
          this.movePlayer('N');
          break;
        case 69:  // E
          this.movePlayer('NE');
          break;
        case 65:  // A
          this.movePlayer('SW');
          break;
        case 83:  // S
          this.movePlayer('S');
          break;
        case 68:  // D
          this.movePlayer('SE');
          break;
        default:
          break;
      }
      // if (e.keyCode === 37) {
      // } else if (e.keyCode === 38) {
      // } else if (e.keyCode === 39) {
      // } else if (e.keyCode === 40) {
      // } else {
      //   return;
      // }
      e.preventDefault();
    });

    this.camera.stage.on('click', () => {
      this.hexClick(this.getMousePointerPosition());
    });

    this.camera.stage.on('mousemove', () => {
      this.hexMouseMove(this.getMousePointerPosition());
    });

    let scrollContainer = document.getElementById('scroll-container');
    scrollContainer.addEventListener('scroll', () => {
      let dx = scrollContainer.scrollLeft;
      let dy = scrollContainer.scrollTop;
      this.camera.stage.container().style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
      this.camera.stage.x(-dx);
      this.camera.stage.y(-dy);
      this.camera.stage.batchDraw();
    });

  }

  getMousePointerPosition() {
    let pointerPos = this.camera.stage.getPointerPosition();
    pointerPos.x -= this.camera.stage.getX();
    pointerPos.y -= this.camera.stage.getY();
    return pointerPos;
  }

  isHexInBlockedList(hex, blockedList) {
    if (!blockedList || blockedList.length === 0) {
      return false;
    }
    let blockedHex = blockedList.find(hex => {
      return hex.id === hex.id;
    })
    return !!blockedHex;
  }


  drawGrid(args) {
    let { hexes, withLabels, withTiles } = args;

    let layers = this.camera.stage.getLayers();
    let gameLayer = layers[this.camera.LAYERS.GAME];
    let hexLayer = layers[this.camera.LAYERS.HEX];

    hexes.forEach((hex) => {
      this.drawHex(hexLayer, hex);
      this.drawHexLabel(hexLayer, hex);
      this.drawHexTile(gameLayer, hex);
    });

    hexLayer.visible(withLabels);
    gameLayer.visible(withTiles);
    this.camera.stage.batchDraw();
  }

  drawHex(layer, hex) {
    let corners = this.mapService.currentLayout.polygonCorners(hex);

    let points = [];
    for (var i = 0; i < 6; i++) {
      points.push(corners[i].x);
      points.push(corners[i].y);
    }

    let polyConfig = {
      points: points,
      stroke: 'black',
      strokeWidth: 1,
      closed: true
    };
    // if (!hex.visual || !hex.visual.canSee) {
    //   polyConfig.fill = 'black';
    //   polyConfig.opacity = 0.5; // change to 1 for prod
    // }
    let poly = new Konva.Line(polyConfig);
    poly.id(hex.id);
    layer.add(poly);

    // console.log(corners);
    // layer.draw();
  }

  drawHexLabel(layer, hex) {
    let center = this.mapService.currentLayout.hexToPixel(hex);

    let idText = new Konva.Text({
      x: center.x,
      y: center.y-17,
      text: 'id:' + hex.map.id,
      fontSize: 11,
      fontFamily: 'sans-serif',
      fill: this.colorForHex(hex)
    });
    idText.offsetX(idText.width() / 2);

    let colRowText = new Konva.Text({
      x: center.x,
      y: center.y-4,
      text: hex.col + "," + hex.row,
      fontSize: 12,
      fontFamily: 'sans-serif',
      fill: this.colorForHex(hex)
    });
    colRowText.offsetX(colRowText.width() / 2);

    let qrsText = new Konva.Text({
      x: center.x,
      y: center.y+9,
      text: hex.q + "," + hex.r + "," + hex.s,
      fontSize: 11,
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
// console.log('drawHexTile point', point);
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
        opacity: 0,
        width: (this.mapService.currentLayout.size.x*2)+1,
        height: (this.mapService.currentLayout.size.y*2)+1
      });
        // opacity: 1,
      tileImage.id(hex.id);
      layer.add(tileImage);
    })
  }

  clearDebugLayer() {
    let debugLayer = this.camera.getDebugLayer();
    debugLayer.removeChildren();
    debugLayer.clear();
  }

  clearFOVLayer() {
    let layer = this.camera.getFOVLayer();
    layer.removeChildren();
    layer.clear();
  }


  isFieldOfViewBlockedForHex(startHex, targetHex, sourceHexMap = this.mapService.hexMap) {
    // console.count('isFieldOfViewBlockedForHex');
    let distanceFunction = this.pathService.heuristics.hex;
    let startPoint = this.mapService.currentLayout.hexToPixel(startHex);
    let targetPoint = this.mapService.currentLayout.hexToPixel(targetHex);

    let distanceInHexes = distanceFunction(startHex, targetHex);

    // extract distance
    let lineDistance = Math.sqrt( Math.pow((targetPoint.x - startPoint.x),2) + Math.pow((targetPoint.y - startPoint.y),2));
    let segmentDistance = lineDistance / distanceInHexes;

    let angle = Math.atan2(targetPoint.y - startPoint.y, targetPoint.x - startPoint.x);
    let sin = Math.sin(angle) * segmentDistance;
    let cos = Math.cos(angle) * segmentDistance;

    let newY = startPoint.y;
    let newX = startPoint.x;

    // let layer = this.camera.stage.getLayers()[3];
    let sightBlocked = false;
    let blockedLoopStart = null;

    let returnFieldOfViewHexes = {
      visible: [],
      blocked: []
    }

    for (let i = 0; i < distanceInHexes; i++) {
      // move
      newY += sin;
      newX += cos;

      if(!sightBlocked) {
        let point = new Point({x:newX, y:newY});
        let thisHex = this.mapService.currentLayout.pixelToHex(point).round();
        let segmentHex = this.mapService.findHexByQRS(thisHex.q, thisHex.r, thisHex.s, sourceHexMap);

        if (this.showFieldOfViewLayer) {
          segmentHex.fovX = newX;
          segmentHex.fovY = newY;
        }
        returnFieldOfViewHexes.visible.push(segmentHex);

        // If point falls inside a hex that is blocks, then stop loop.
        // each hex after that is blocked
        if (segmentHex.map.path.v === 1) {
          sightBlocked = true;
          blockedLoopStart = i;
          break;
        }
      }

    }
    if (blockedLoopStart !== null) {
      // newY -= sin;
      // newX -= cos;

      for (let j = blockedLoopStart; j < distanceInHexes-1; j++) {
        newY += sin;
        newX += cos;

        let point = new Point({x:newX, y:newY});
        let thisHex = this.mapService.currentLayout.pixelToHex(point).round();
        let segmentHex = this.mapService.findHexByQRS(thisHex.q, thisHex.r, thisHex.s);

        if (this.showFieldOfViewLayer) {
          segmentHex.fovX = newX;
          segmentHex.fovY = newY;
        }
        returnFieldOfViewHexes.blocked.push(segmentHex);
      }
    }

    // console.log(returnFieldOfViewHexes);
    return returnFieldOfViewHexes;
  }

  drawFieldOfView(startHex, targetHex) {

    if (this.showFieldOfViewLayer) {
      this.clearFOVLayer();

      let returnFieldOfViewHexes = this.isFieldOfViewBlockedForHex(startHex, targetHex);
      let numVisibleHexes = returnFieldOfViewHexes.visible.length;
      let numBlockedHexes = returnFieldOfViewHexes.blocked.length;

      let layer = this.camera.getFOVLayer();
// console.group('fov')
      for (let i = 0; i < numVisibleHexes; i++) {
        // console.log('visible', returnFieldOfViewHexes.visible[i].fovX, returnFieldOfViewHexes.visible[i].fovY);
        let circle = new Konva.Circle({
          x: returnFieldOfViewHexes.visible[i].fovX,
          y: returnFieldOfViewHexes.visible[i].fovY,
          radius: 4,
          fill: 'lightgreen'
        });
        layer.add(circle);
      }
      for (let i = 0; i < numBlockedHexes; i++) {
        // console.log('blocked', returnFieldOfViewHexes.blocked[i].fovX, returnFieldOfViewHexes.blocked[i].fovY);
        let circle = new Konva.Circle({
          x: returnFieldOfViewHexes.blocked[i].fovX,
          y: returnFieldOfViewHexes.blocked[i].fovY,
          radius: 4,
          fill: 'red'
        });
        layer.add(circle);
      }
// console.groupEnd();
      layer.draw();
      // this.camera.stage.draw();
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

      let debugLayer = this.camera.getDebugLayer()
      debugLayer.add(purpleline);
      debugLayer.draw();
      // this.camera.stage.draw();
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

  getHexAtMousePoint(mouseCoords, shouldUpdateDebugInfo = false) {
  // getHexAtMousePoint(event, shouldUpdateDebugInfo) {
  //   let mouse = this.getMouse(event);
    let x = mouseCoords.x;
    let y = mouseCoords.y;

    // adjust for camera position
    x += -this.camera.x;
    y += -this.camera.y;

    let point = new Point({x:x, y:y});
    let thisHex = this.mapService.currentLayout.pixelToHex(point).round();
    let targetHex = this.mapService.findHexByQRS(thisHex.q, thisHex.r, thisHex.s);

    if(shouldUpdateDebugInfo) {
      this.mouseXY = `X:${mouseCoords.x} Y:${mouseCoords.y}`;
      // this.mouseXY = `X:${event.clientX} Y:${event.clientY}`;
      this.mousePoint = `X:${Math.round(point.x)} Y:${Math.round(point.y)}`;
      this.currentHex = `Q:${thisHex.q} R:${thisHex.r}`;
      // this.currentHex = `Q:${thisHex.q} R:${thisHex.r} S:${thisHex.s}`;
    }

    return targetHex;
  }

  hexMouseMove(mouseCoords) {

// console.log('hexMouseMove', mouseCoords);
    let targetHex = this.getHexAtMousePoint(mouseCoords, true);

    if(targetHex && targetHex.id != this.lastMouseMoveTargetId) {
      this.clearDebugLayer();

      this.lastMouseMoveTargetId = targetHex.id;

      let sourceHex = this.game.player.hex;
      // console.log('sourceHex', this.game.player.name ,sourceHex);
      // let shipHex = this.transport.transportHexes[Player.transportHexIndex];
      // console.log('shipHex' ,sourceHex);
      // let shipHex = this.transport.transportHexes[Player.transportHexIndex];

      let pathDistanceToMouseHex = this.mapService.findPath(this.mapService.worldMap, sourceHex, targetHex, {debug:false});
      // let pathDistanceToMouseHex = this.mapService.findPath(this.mapService.worldMap, shipHex, targetHex, {debug:false});

      this.pathDistanceToMouseHex = pathDistanceToMouseHex.length;

      this.drawPathToTarget(sourceHex, pathDistanceToMouseHex);
      this.drawFieldOfView(sourceHex, targetHex);
      // this.drawPathToTarget(shipHex, pathDistanceToMouseHex);
      // this.drawFieldOfView(shipHex, targetHex);

    } else {
      // this.pathDistanceToMouseHex = 0;
    }

  }

  hexClick(mousecoords) {
    if (this.game.player.boardedTransport) {
      this.game.player.boardedTransport.fire(mousecoords);
    }
  }

  movePlayer(directionStr) {
    if (this.transport.movePlayerToHexTask.isIdle) {

      let direction = this.hexService.getDirection(directionStr);

      if (direction) {
        // console.log('movePlayer', direction);
        let targetHex = this.mapService.findPlayerHexNeighborByDirection(direction);

        if (targetHex && targetHex.id) {
          this.transport.movePlayerToHexTask.cancelAll();

          if (this.playerAtSeaTryingToDock(this.game.player.hex, targetHex)) {
            this.transformToLandOrSea(this.transport.TRANSPORTMODES.LAND, targetHex);

          } else if (this.playerOnDockTryingToBoard(this.game.player.hex, targetHex)) {
            this.transformToLandOrSea(this.transport.TRANSPORTMODES.SEA, targetHex);

          } else {
            let path = this.mapService.findPath(this.mapService.worldMap, this.game.player.hex, targetHex, {debug:false});
            this.transport.movePlayerAlongPath(path);
          }
        }
      }
    }
  }

  playerOnDockTryingToBoard(sourceHex, targetHex) {
    let distance = this.pathService.heuristics.hex(sourceHex, targetHex);
    if(distance === 1) {
      let ship = this.transport.findTransportByName('ship');
      let tryingToBoard = (sourceHex.props && sourceHex.props.dock === true) &&
        (this.hexService.hasSameCoordinates(targetHex, ship.hex));
      return tryingToBoard;
    }
    return false;
  }

  playerAtSeaTryingToDock(sourceHex, targetHex) {
    let distance = this.pathService.heuristics.hex(sourceHex, targetHex);
    if(distance === 1) {
      let tryingToDock = ((targetHex.props && targetHex.props.dock) === true) &&
        this.game.playerHasTravelAbilityFlag(this.game.FLAGS.TRAVEL.SEA);
      return tryingToDock;
    }
    return false;
  }

  transformToLandOrSea (targetMode, targetHex) {

    switch (targetMode) {
      case this.transport.TRANSPORTMODES.SEA:
        this.game.boardTransport('ship');
        this.movePlayerTowardsTransportThenFade(targetHex);
        break;

      case this.transport.TRANSPORTMODES.LAND:
        this.game.disembarkTransportToHex(targetHex);
        this.movePlayerFromTransportOntoLand(targetHex);
        break;

      default:
        break;
    }
  }

  movePlayerFromTransportOntoLand(targetHex) {
    let agentsLayer = this.camera.getAgentsLayer();

    // show and move land avatar
    let point = this.mapService.currentLayout.hexToPixel(targetHex);
    this.game.player.imageGroup.x(point.x);
    this.game.player.imageGroup.y(point.y);
    this.game.player.imageGroup.to({opacity: 1});

    agentsLayer.draw();
  }

  movePlayerTowardsTransportThenFade(targetHex) {
    let agentsLayer = this.camera.getAgentsLayer();
    let point = this.mapService.currentLayout.hexToPixel(targetHex);

    // move avatar to ship
    this.game.player.imageGroup.to({
      x: point.x - 18,
      y: point.y - 18
    });
    agentsLayer.draw();

    // fade the avatar
    this.game.player.imageGroup.to({opacity: 0});
    agentsLayer.draw();

  }

}
