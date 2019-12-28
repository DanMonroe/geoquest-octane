import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Konva from 'konva';

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


  // TODO DEPRECATED after ember data maps
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

  setupMinimapCanvases() {
    const stage = new Konva.Stage({
      container: 'konvaContainerMiniMap',
      width: 200,
      height: 100,
      scale: .8
    });

    stage.scale({
      x: .3,
      y: .3
    });
    const miniMapLayer = new Konva.Layer({draggable: false});

    stage.add(miniMapLayer);

    this.camera.miniMapStage = stage;
  }

  setupGameboardCanvases() {

    let stage = new Konva.Stage({
      width: window.innerWidth,
      height: window.innerHeight,
      container: '#konvaContainer'
    });
    // create layers

    const gameLayer = new Konva.Layer({draggable: false, hitGraphEnabled: false});
    // let mapLayer = new Konva.Layer({draggable: false});
    // let hexLayer = new Konva.Layer({draggable: false});
    // let debugLayer = new Konva.Layer({draggable: false});
    // let fieldOfViewLayer = new Konva.Layer({draggable: false});
    let agentsLayer = new Konva.Layer({draggable: false, hitGraphEnabled: false});

    // gameLayer.disableHitGraph();
    // mapLayer.disableHitGraph();
    // hexLayer.disableHitGraph();
    // debugLayer.disableHitGraph();
    // fieldOfViewLayer.disableHitGraph();
    // agentsLayer.disableHitGraph();


    const mapGroup = new Konva.Group({
      id: this.camera.GROUPS.BACKGROUNDMAP
    });
    gameLayer.add(mapGroup);
    const hexGroup = new Konva.Group({
      id: this.camera.GROUPS.HEX
    });
    gameLayer.add(hexGroup);
    const fieldOfViewGroup = new Konva.Group({
      id: this.camera.GROUPS.FOV
    });
    gameLayer.add(fieldOfViewGroup);
    const debugGroup = new Konva.Group({
      id: this.camera.GROUPS.DEBUG
    });
    gameLayer.add(debugGroup);

    stage.add(gameLayer);
    // stage.add(mapLayer);
    // stage.add(hexLayer);
    // stage.add(debugLayer);
    // stage.add(fieldOfViewLayer);
    stage.add(agentsLayer);

    this.camera.stage = stage;
    // this.camera.viewportWidth = stage.width();
    // this.camera.viewportHeight = stage.height();

    // let colsToGrab = map.MAP[0].length;
    // let rowsToGrab = map.MAP.length;
    // // let colsToGrab = Math.min(this.camera.maxViewportHexesX + 2, map.MAP[0].length);
    // // let rowsToGrab = Math.min(this.camera.maxViewportHexesY + 4, map.MAP.length);
    //
    // let startRow = 0;
    // let startCol = 0

    // this.mapService.setHexmapSubset(startRow, startCol, rowsToGrab, colsToGrab);

    this.showDebugLayer = this.game.showDebugLayer;
    this.showFieldOfViewLayer = this.game.showFieldOfViewLayer;

  }

  initKeyboardAndMouseEventListeners() {
    // let container = this.camera.stage.container();
    //
    // // make it focusable
    // container.tabIndex = 1;
    // // focus it
    // // also stage will be in focus on its click
    // container.focus();
    //
    // // TODO can we use ember-keyboard instead?
    // container.addEventListener('keydown', (e) => {
    //   // https://keycode.info/
    //   switch(e.keyCode) {
    //     // case 70:  // F [ire]
    //     //   if (this.game.player.boardedTransport) {
    //     //     this.game.player.boardedTransport.fire();
    //     //   }
    //     //   break;
    //     case 81:  // Q
    //       this.movePlayer('NW');
    //       break;
    //     case 87:  // W
    //       this.movePlayer('N');
    //       break;
    //     case 69:  // E
    //       this.movePlayer('NE');
    //       break;
    //     case 65:  // A
    //       this.movePlayer('SW');
    //       break;
    //     case 83:  // S
    //       this.movePlayer('S');
    //       break;
    //     case 68:  // D
    //       this.movePlayer('SE');
    //       break;
    //     default:
    //       break;
    //   }
    //   e.preventDefault();
    // });
    //
    this.camera.stage.on('click', () => {
      this.hexClick();
      // this.hexClick(this.getMousePointerPosition());
    });

    this.camera.stage.on('mousemove', () => {
      this.hexMouseMove();
      // this.hexMouseMove(this.getMousePointerPosition());
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
    let { emberDataMap, hexMap, withLabels, withTiles, useEmberDataTiles } = args;

    // let layers = this.camera.stage.getLayers();
    // let gameLayer = this.camera.getGameLayer();
    // let hexLayer = this.camera.getHexLayer();

    // let miniMapLayer = this.camera.getMiniMapLayer();

    this.drawBackgroundMap(emberDataMap);

    const hexGroup = this.camera.getHexLayerGroup();
    const debugGroup = this.camera.getDebugLayerGroup();

    let thisMapsSeenHexes = this.mapService.getSeenHexesForLoadedMap();
    // console.log('thisMapsSeenHexes', thisMapsSeenHexes);

    hexMap.forEach((hexRow) => {
      hexRow.forEach((hex) => {
        // console.log('hex', hex);
        const previouslySeenThisHex = thisMapsSeenHexes && thisMapsSeenHexes.has(hex.id);
        this.drawHex(hexGroup, hex, previouslySeenThisHex);
        // this.drawHex(hexGroup, hex, withLabels, previouslySeenThisHex);

      // this.drawHex(hexLayer, hex, withLabels, previouslySeenThisHex);
      if (withLabels) {
        this.drawHexLabel(debugGroup, hex);
      }
    //   this.drawHexTile(gameLayer, hex, previouslySeenThisHex, useEmberDataTiles, false);
    //   // this.drawMiniMapHexTile(miniMapLayer, hex, previouslySeenThisHex, useEmberDataTiles, true);
      });
    });
    //
    // hexLayer.visible(withLabels);
    // gameLayer.visible(withTiles);
    // gameLayer.visible(true);
    // miniMapLayer.visible(withTiles);

    this.camera.stage.batchDraw();
    // this.camera.miniMapStage.batchDraw();
  }

  drawHex(hexGroup, hex, previouslySeenThisHex) {
  // drawHex(hexGroup, hex, drawStroke, previouslySeenThisHex) {
  //   console.log('draw hex - drawStroke, showTileHExInfo', drawStroke, this.game.showTileHexInfo);
    let corners = hex.polygonCorners;
    // let corners = this.mapService.currentLayout.polygonCorners(hex);

    let points = [];
    for (var i = 0; i < 6; i++) {
      points.push(corners[i].x);
      points.push(corners[i].y);
    }
// console.log('previouslySeenThisHex', previouslySeenThisHex);

    //  Setting opacity seriously degrades performance.
    //  Setting alpha on the fill color is an alternative that seems to work better.

    let polyConfig = {
      points: points,
      closed: true,
      // fill: this.mapService.MAPFILLOPACITY.HIDDEN,
      fill: previouslySeenThisHex ? this.mapService.MAPFILLOPACITY.PREVIOUSLYSEEN : this.mapService.MAPFILLOPACITY.HIDDEN,
      // fill: previouslySeenThisHex ? this.mapService.MAPFILLOPACITY.PREVIOUSLYSEEN : this.mapService.MAPFILLOPACITY.HIDDEN,
      // opacity: .5,
      stroke: 'rgba(0,0,0,.25)',
      strokeWidth: 1,
      dashEnabled: false,
      shadowEnabled: false,
      listening: false,
      draggable: false
      // opacity: previouslySeenThisHex ? .6 : 1,
      // opacity: previouslySeenThisHex ? this.mapService.MAPOPACITY.PREVIOUSLYSEEN : this.mapService.MAPOPACITY.HIDDEN,
    };
    // if (drawStroke) {
    //   polyConfig.stroke = 'rgba(0,0,0,.25)';
      // polyConfig.stroke = '#FFB00040';
      // polyConfig.strokeWidth = 1;
    // }

    // if (!hex.visual || !hex.visual.canSee) {
    //   polyConfig.fill = 'black';
    //   polyConfig.opacity = 0.5; // TODO change to 1 for prod
    // }

    let poly = new Konva.Line(polyConfig);
    poly.id(hex.id);

    hexGroup.add(poly);
  }

  drawHexLabel(group, hex) {
    let center = hex.point;
    // let center = this.mapService.currentLayout.hexToPixel(hex);

    let idText = new Konva.Text({
      x: center.x,
      y: center.y-17,
      text: 'id:' + hex.id,
      fontSize: 11,
      fontFamily: 'sans-serif',
      fill: this.colorForHex(hex),
      listening: false
    });
    idText.offsetX(idText.width() / 2);

    let qrsText = new Konva.Text({
      x: center.x,
      y: center.y+9,
      text: hex.q + "," + hex.r,
      // text: hex.q + "," + hex.r + "," + hex.s,
      fontSize: 11,
      fontFamily: 'sans-serif',
      fill: this.colorForHex(hex),
      listening: false
    });
    qrsText.offsetX(qrsText.width() / 2);

    group.add(idText);

    group.add(qrsText);

    // TODO put map t (tile) back in when we add map to the hex
  }

  drawMiniMapHexTile(minimapLayer, hex, previouslySeenThisHex) {
    let point = hex.point;
    // let point = this.mapService.currentLayout.hexToPixel(hex);
    let x = Math.floor(point.x) - this.mapService.currentLayout.size.x;
    let y = Math.floor(point.y) - this.mapService.currentLayout.size.y - 4;

    let tileGraphics = [];

    hex.get('tiles').forEach((tile) => {
    // hex.mapObject.get('tiles').forEach((tile) => {
      let tileGraphic = this.mapService.getTileGraphicByAltProperty(tile.name);
      if (tileGraphic) {
        tileGraphics.push(tileGraphic);
      }
    });

    // TODO  Why do we need to load another image first?
    if (hex.id === "1") {
      Konva.Image.fromURL('/images/cacheicon.png', function () {
        minimapLayer.batchDraw();
      });
    }

    tileGraphics.forEach((tile) => {
      let tileImage = new Konva.Image({
        x: x,
        y: y,
        image: tile,
        // opacity: 1,
        opacity: previouslySeenThisHex ? this.mapService.MAPOPACITY.PREVIOUSLYSEEN : this.mapService.MAPOPACITY.HIDDEN,
        width: (this.mapService.currentLayout.size.x*2)+1,
        height: (this.mapService.currentLayout.size.y*2)+1,
        listening: false
      });
    //   // listening: false
    //   tileImage.strokeHitEnabled(false);
    //
    //   // console.log('Konva image', tileImage);
    //
      tileImage.id(hex.id);
      // tileImage.id("mini" + hex.id);

      minimapLayer.add(tileImage);
      // minimapLayer.batchDraw();
    });
    // minimapLayer.draw();

  }

  drawBackgroundMap(emberDataMap) {
    if (emberDataMap.backgroundImage) {
      let image = new Image();
      image.src = `/images/maps/${emberDataMap.backgroundImage}`;
      image.onload = () => {
        // console.log('loaded', emberDataMap.backgroundImage);
        let imageObj = new Konva.Image({
          id: "background" + emberDataMap.id,

          x: emberDataMap.backgroundOffsetX,
          y: emberDataMap.backgroundOffsetY,
          image: image,
          width: emberDataMap.backgroundImageWidth,
          height: emberDataMap.backgroundImageHeight
        });

        let mapLayer = this.game.camera.getGameLayer();
        // let mapLayer = this.game.camera.getBackgroundMapLayer();
        const mapGroup = mapLayer.find('#map');
        mapGroup.add(imageObj);
        // mapLayer.add(imageObj);
        mapLayer.batchDraw();
      };
    }
  }

  drawHexTile(layer, hex, previouslySeenThisHex, useEmberDataTiles) {

    let point = hex.point;
    // let point = this.mapService.currentLayout.hexToPixel(hex);
    let x = Math.floor(point.x) - this.mapService.currentLayout.size.x;
    let y = Math.floor(point.y) - this.mapService.currentLayout.size.y - 4;

    let tileGraphics = [];

    if (useEmberDataTiles) {
      // hex.mapObject.get('tiles').forEach((tile) => {
      hex.get('tiles').forEach((tile) => {
        let tileGraphic = this.mapService.getTileGraphicByAltProperty(tile.name);
        if (tileGraphic) {
          tileGraphics.push(tileGraphic);
        }
      });
    }

    tileGraphics.forEach((tile) => {
      let tileImage = new Konva.Image({
        x: x,
        y: y,
        image: tile,
        // opacity: 1,
        opacity: previouslySeenThisHex ? this.mapService.MAPOPACITY.PREVIOUSLYSEEN : this.mapService.MAPOPACITY.HIDDEN,
        width: (this.mapService.currentLayout.size.x*2)+1,
        height: (this.mapService.currentLayout.size.y*2)+1,
        listening: false
      });
        // listening: false
      tileImage.strokeHitEnabled(false);

      // console.log('Konva image', tileImage);

      tileImage.id(hex.id);

      layer.add(tileImage);
    });

  }

  clearDebugLayer() {
    // if (this.game.showDebugLayer) {
      // let layer = this.camera.getFOVLayer();
      // debugLayer.removeChildren();
      // debugLayer.clear();
      // let debugLayer = this.camera.getDebugLayer();
      // if (debugLayer) {
      //   const debugGroup = debugLayer.find('#debug');
        const debugGroup = this.camera.getDebugLayerGroup();
        if (debugGroup && debugGroup.children.length > 0) {
          debugGroup.removeChildren();
          this.camera.stage.batchDraw();
          // debugGroup.removeChildren();
          // debugGroup.clear();
          // this.camera.stage.batchDraw();
        }
      // }
    // }
  }

  clearFOVLayer() {
    // if (this.game.showFieldOfViewLayer) {
      // let gameLayer = this.camera.getGameLayer();
      // let layer = this.camera.getFOVLayer();
      const fovGroup = this.camera.getFOVLayerGroup();
      if (fovGroup && fovGroup.children.length > 0) {
        // fovGroup.remove(fovGroup);
        fovGroup.removeChildren();
        this.camera.stage.batchDraw();
        // fovGroup.clear();
      }
    // }
  }


  isFieldOfViewBlockedForHex(startHex, targetHex, sourceHexMap = this.mapService.allHexesMap) {
    let distanceFunction = this.pathService.heuristics.hex;
    let startPoint = startHex.point;
    let targetPoint = targetHex.point;
    // let startPoint = (startHex.mapObject && startHex.mapObject.point) || startHex.point;
    // let targetPoint = (targetHex.mapObject && targetHex.mapObject.point) || targetHex.point;
    //
    // let startPoint = this.mapService.currentLayout.hexToPixel(startHex);
    // let targetPoint = this.mapService.currentLayout.hexToPixel(targetHex);

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
        // let point = new Point({x:newX, y:newY});
        // let thisHex = this.mapService.currentLayout.pixelToHex(point).round();
        // let segmentHex = this.mapService.findHexByQR(thisHex.q, thisHex.r, sourceHexMap);

// console.group();

        let segmentHex = this.mapService.findHexByXY({x:newX, y:newY}, sourceHexMap);
// console.log('point', point);
// console.log('thisHex', thisHex);
// console.log('segmentHex', segmentHex);
// console.log('sourceHexMap', sourceHexMap);
// console.groupEnd();
        // let segmentHex = this.mapService.findHexByQRS(thisHex.q, thisHex.r, thisHex.s, sourceHexMap);
        if (segmentHex) {

          if (this.game.showFieldOfViewLayer) {
            segmentHex.set('fovX', newX);
            segmentHex.set('fovY', newY);
          }
          returnFieldOfViewHexes.visible.push(segmentHex);

          // If point falls inside a hex that is blocked, then stop loop.
          // each hex after that is blocked
          if( segmentHex.sightFlags && (this.game.playerHasVisibilityAbilityFlag(segmentHex.sightFlags) === 0)) {
          // if( segmentHex.mapObject.sightFlags && (this.game.playerHasAbilityFlag(this.game.FLAG_TYPE_VISIBILITY, segmentHex.mapObject.sightFlags) === 0)) {
          // if (segmentHex.map.path.v === 1) {
            sightBlocked = true;
            blockedLoopStart = i;
            break;
          }
        }

      }

    }
    if (blockedLoopStart !== null) {
      // newY -= sin;
      // newX -= cos;

      for (let j = blockedLoopStart; j < distanceInHexes-1; j++) {
        newY += sin;
        newX += cos;

        // let point = new Point({x:newX, y:newY});
        // let thisHex = this.mapService.currentLayout.pixelToHex(point).round();
        // let segmentHex = this.mapService.findHexByQR(thisHex.q, thisHex.r);
        // let segmentHex = this.mapService.findHexByQRS(thisHex.q, thisHex.r, thisHex.s);
        let segmentHex = this.mapService.findHexByXY({x:newX, y:newY}, sourceHexMap);

        if (segmentHex) {
          if (this.game.showFieldOfViewLayer) {
            segmentHex.set('fovX', newX);
            segmentHex.set('fovY', newY);
          }
          returnFieldOfViewHexes.blocked.push(segmentHex);
        }
      }
    }

    // console.log(returnFieldOfViewHexes);
    return returnFieldOfViewHexes;
  }

  drawSightLineCircles(startHex, targetHex) {

    // if (this.game.showFieldOfViewLayer) {
    //   console.log('drawing drawSightLineCircles');
      // this.clearFOVLayer();

      let returnFieldOfViewHexes = this.isFieldOfViewBlockedForHex(startHex, targetHex);
      let numVisibleHexes = returnFieldOfViewHexes.visible.length;
      let numBlockedHexes = returnFieldOfViewHexes.blocked.length;

      // let layer = this.camera.getGameLayer();
      // let fovGroup = layer.find('#fov');
      let fovGroup = this.camera.getFOVLayerGroup();
// console.group('fov')
//     debugger;
      if (fovGroup) {

        for (let i = 0; i < numVisibleHexes; i++) {
          // console.log('visible', returnFieldOfViewHexes.visible[i].fovX, returnFieldOfViewHexes.visible[i].fovY);
          let circle = new Konva.Circle({
            x: returnFieldOfViewHexes.visible[i].fovX,
            y: returnFieldOfViewHexes.visible[i].fovY,
            radius: 4,
            fill: 'lightgreen',
            listening: false
          });
          fovGroup.add(circle);
        }
        for (let i = 0; i < numBlockedHexes; i++) {
          // console.log('blocked', returnFieldOfViewHexes.blocked[i].fovX, returnFieldOfViewHexes.blocked[i].fovY);
          let circle = new Konva.Circle({
            x: returnFieldOfViewHexes.blocked[i].fovX,
            y: returnFieldOfViewHexes.blocked[i].fovY,
            radius: 4,
            fill: 'red',
            listening: false
          });
          fovGroup.add(circle);
        }
  // console.groupEnd();
  //       layer.add(fovGroup);
  //       layer.batchDraw();
      }

      // this.camera.stage.batchDraw();
    // } else {
    //   console.log('not showing drawSightLineCircles');
    // }
  }

  drawPathToTarget(startHex, pathDistanceToMouseHex) {
    // if (this.game.showFieldOfViewLayer) {
      // this.clearDebugLayer();

      let startPoint = startHex.point;
      // let startPoint = startHex.mapObject.point;
      // let startPoint = this.mapService.currentLayout.hexToPixel(startHex);

      let points = [startPoint.x, startPoint.y];
      let pathLength = pathDistanceToMouseHex.length;
      for (let i = 0; i < pathLength; i++) {
        let nextPoint = pathDistanceToMouseHex[i].point;
        // let nextPoint = pathDistanceToMouseHex[i].mapObject.point;
        // let nextPoint = this.mapService.currentLayout.hexToPixel(pathDistanceToMouseHex[i]);
        points.push(nextPoint.x);
        points.push(nextPoint.y);
      }

      var purpleline = new Konva.Line({
        points: points,
        stroke: 'purple',
        strokeWidth: 3,
        lineCap: 'round',
        lineJoin: 'round',
        listening: false
      });

      // let debugLayer = this.camera.getDebugLayer()
      // debugLayer.add(purpleline);
      let fovGroup = this.camera.getFOVLayerGroup();
      fovGroup.add(purpleline);
      // this.camera.stage.draw();
      // this.camera.stage.batchDraw()
    // }
  }


  colorForHex(hex) {
    return "#9bff009e";  // bright green
    // Match the color style used in the main article
    // if (hex.q === 0 && hex.r === 0 && hex.s === 0) {
    //   return "hsl(0, 50%, 0%)";
    // } else if (hex.q === 0) {
    //   return "hsl(90, 70%, 35%)";
    // } else if (hex.r === 0) {
    //   return "hsl(200, 100%, 35%)";
    // } else if (hex.s === 0) {
    //   return "hsl(300, 40%, 50%)";
    // } else {
    //   return "hsl(0, 0%, 50%)";
    // }
  }

  getHexAtMousePoint(mouseCoords, shouldUpdateDebugInfo = false) {
  // getHexAtMousePoint(event, shouldUpdateDebugInfo) {
  //   let mouse = this.getMouse(event);
    let x = mouseCoords.x;
    let y = mouseCoords.y;

    // adjust for camera position
    x += -this.camera.x;
    y += -this.camera.y;

    // let point = new Point({x:x, y:y});
    // let thisHex = this.mapService.currentLayout.pixelToHex(point).round();
    // let targetHex = this.mapService.findHexByQR(thisHex.q, thisHex.r);
    // let targetHex = this.mapService.findHexByQRS(thisHex.q, thisHex.r, thisHex.s);
    let targetHex = this.mapService.findHexByXY({x:x, y:y});

    if(shouldUpdateDebugInfo) {
      this.mouseXY = `X:${mouseCoords.x} Y:${mouseCoords.y}`;
      this.mousePoint = `X:${Math.round(x)} Y:${Math.round(y)}`;
      if(targetHex) {
        this.currentHex = `Q:${targetHex.q} R:${targetHex.r}`;
      }
      // this.mousePoint = `X:${Math.round(point.x)} Y:${Math.round(point.y)}`;
      // this.currentHex = `Q:${thisHex.q} R:${thisHex.r}`;
    }

    return targetHex;
  }

  hexMouseMove() {
    if (this.game.pathFindingDebug) {
      const mouseCoords = this.getMousePointerPosition();

      let targetHex = this.getHexAtMousePoint(mouseCoords, true);

      if (targetHex && targetHex.id != this.lastMouseMoveTargetId) {
      // if (this.game.showFieldOfViewLayer && targetHex && targetHex.id != this.lastMouseMoveTargetId) {
        this.clearFOVLayer();
        this.clearDebugLayer();

        this.lastMouseMoveTargetId = targetHex.id;

        let sourceHex = this.game.player.hex;
        // let shipHex = this.transport.transportHexes[Player.transportHexIndex];
        // console.log('shipHex' ,sourceHex);

        let pathDistanceToMouseHex = this.mapService.findPathEmberData(this.mapService.allHexesMap, sourceHex, targetHex, {
          agent: this.game.player,
          debug: this.game.pathFindingDebug
        });

        this.pathDistanceToMouseHex = pathDistanceToMouseHex.length;

        this.drawPathToTarget(sourceHex, pathDistanceToMouseHex);
        this.drawSightLineCircles(sourceHex, targetHex);
        // this.drawPathToTarget(shipHex, pathDistanceToMouseHex);
        // this.drawSightLineCircles(shipHex, targetHex);
        this.camera.stage.batchDraw();
      }
    }
  }

  hexClick() {
    const mouseCoords = this.getMousePointerPosition();
    if (this.game.player.boardedTransport) {
      this.game.player.boardedTransport.fire(mouseCoords);
    } else {
      this.game.player.fire(mouseCoords);
    }
  }

  movePlayer(directionStr) {
    // console.log('Move player', directionStr);
    if (this.transport.movePlayerToHexTask.isIdle) {

      this.clearFOVLayer();
      this.clearDebugLayer();

      let direction = this.hexService.getDirection(directionStr);

      if (direction) {
        // console.log('movePlayer', direction);
        let targetHex = this.mapService.findPlayerHexNeighborByDirection(direction);

        if (targetHex && targetHex.id) {
          // this.transport.movePlayerToHexTask.cancelAll();

          if (this.playerAtSeaTryingToDock(this.game.player.hex, targetHex)) {
            this.transformToLandOrSea(this.transport.TRANSPORTMODES.LAND, targetHex);

          } else if (this.playerOnDockTryingToBoard(this.game.player.hex, targetHex)) {
            this.transformToLandOrSea(this.transport.TRANSPORTMODES.SEA, targetHex);

          } else {
            let path = this.mapService.findPathEmberData(this.mapService.allHexesMap, this.game.player.hex, targetHex, {agent:this.game.player, debug:this.game.pathFindingDebug});
            // let path = this.mapService.findPath(this.mapService.worldMap, this.game.player.hex, targetHex, {debug:false});
            this.transport.movePlayerAlongPath(path);
          }
        }
      }
    }
  }

  playerOnDockTryingToBoard(sourceHex, targetHex) {
    let distance = this.pathService.heuristics.hex(sourceHex, targetHex);
    if(distance === 1) {
      const ship = this.transport.findTransportByName('ship');
      return ship && this.game.isOnForFlag(sourceHex.specialFlags, this.game.FLAGS.SPECIAL.DOCK) &&
        (this.hexService.hasSameCoordinates(targetHex, ship.hex));
    }
    return false;
  }

  playerAtSeaTryingToDock(sourceHex, targetHex) {
    let distance = this.pathService.heuristics.hex(sourceHex, targetHex);
    if(distance === 1) {
      return this.game.isOnForFlag(targetHex.specialFlags, this.game.FLAGS.SPECIAL.DOCK) &&
        this.game.playerHasTravelAbilityFlag(this.game.FLAGS.TRAVEL.SEA);
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
    let point = targetHex.point;
    // let point = targetHex.mapObject.point;
    // let point = this.mapService.currentLayout.hexToPixel(targetHex);
    this.game.player.imageGroup.x(point.x);
    this.game.player.imageGroup.y(point.y);
    this.game.player.imageGroup.to({opacity: 1});

    agentsLayer.draw();
  }

  movePlayerTowardsTransportThenFade(targetHex) {
    let agentsLayer = this.camera.getAgentsLayer();
    let point = targetHex.point;
    // let point = targetHex.mapObject.point;
    // let point = this.mapService.currentLayout.hexToPixel(targetHex);

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
