import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import {inject as service} from '@ember/service';
import { A as emberArray } from '@ember/array';
import { alias } from '@ember/object/computed';

import ENV from 'geoquest-octane/config/environment';

// import { Map2 } from 'geoquest-octane/objects/maps/map2';
// import { Map3 } from 'geoquest-octane/objects/maps/map3';

export default class GameboardComponent extends Component {

  @service ('hex') hexService;
  @service ('map') mapService;
  @service ('gameboard') gameboard;
  @service ('transport') transport;

  // @tracked showShip = true;

  // @tracked showTileGraphics = false;
  @tracked showTileGraphics = ENV.game.board.showTileGraphics;
  @tracked showTileHexInfo = false;
  @tracked showTilesWithLabels = true;

  @tracked map = null;
  @tracked transports = null;
  @tracked selectedMap = 0;
  @tracked ships = emberArray();

  @alias playerShipHex = this.transport.transportHexes[ENV.game.transports[0].index];

  mapOptions = [
    {name: "Small", value: 0},
    {name: "Island", value: 1},
    {name: "Patrolling Pirate", value: 2}
  ];

  constructor() {
    super(...arguments);
    this.model = arguments[1];
    this.mapService.loadLayout();
    this.loadMap(1);
  }

  loadImageTest() {
    let testGraphic = new Image(36, 36);
    testGraphic.src = `/images/test/skull.svg`;
    console.log('loading', testGraphic);
    testGraphic.onload = () => {
      console.log('testGraphic onload');
    }
    console.log('loadImageTest end');
  }

  loadMap(mapIndex) {
    this.map = this.model.mapdata[mapIndex].map;
    this.transports = this.model.mapdata[mapIndex].transports;
    // this.selectedMap = this.mapOptions.findBy('value', this.model.mapdata[mapIndex].mapid);

    this.mapService.loadTiles(this.map);

    // let canvasContainer = document.getElementById('concreteContainer');
    // if (canvasContainer) {
    //   this.teardownGameboardCanvases(canvasContainer);
    //   this.setupGame(canvasContainer);
    // }
  }

  @action
  changeMap (map) {
    this.loadMap(map.value);
    // window.location.href = `/maps/${map.value}`
  }

  @action
  setupGame(concreteContainer) {
    this.gameboard.setupGameboardCanvases(concreteContainer, this.map);
    this.ships = this.transport.setupShips(this.transports);

    this.transport.setupPatrols();

    this.transport.moveQueueTask.perform();
  }

  @action
  teardownGameboardCanvases(concreteContainer) {
    concreteContainer.removeEventListener('click', this.handleContainerClick);
    // concreteContainer.removeEventListener('click', this.handleContainerClick);
  }

//   setupGameboardCanvases(concreteContainer) {
//     console.log(concreteContainer);
//
//     // Map setup
//     this.mapService.set('hexMap', this.hexService.createHexesFromMap(Map3.MAP));
//     this.mapService.set('twoDimensionalMap', Map3.MAP);
//
//     // create viewport
//     var viewport = new concrete.Viewport({
//       width: 680,
//       height: 650,
//       container: concreteContainer
//     });
//
// // create layers
//     var gameLayer = new concrete.Layer();
//     var hexLayer = new concrete.Layer();
//     var mouseLayer = new concrete.Layer();
//
//     // add layers
//     viewport.add(gameLayer).add(hexLayer).add(mouseLayer);
//
//     var gameLayers = [
//       {
//         x: viewport.width / 2,
//         y: viewport.height / 2,
//         layer: gameLayer,
//         color: 'tan',
//         key: 0
//       },
//       {
//         x: viewport.width / 2,
//         y: viewport.height / 2,
//         layer: hexLayer,
//         key: 1
//       }
//     ];
//
//     this.gameboard.viewport = viewport;
//
//     let centerX = (viewport.width / 2);
//     let centerY = (viewport.height / 2);
//     // let centerX = (viewport.width / 2) + viewport.offsetLeft;
//     // let centerY = (viewport.height / 2) + viewport.offsetTop;
//     this.gameboard.set('centerX', centerX);
//     this.gameboard.set('centerY', centerY);
//
//     this.drawGrid();
//
//     concreteContainer.addEventListener('click', (event) => {
//       if (this.gameboard.viewport) {
//         this.hexClick(event)
//       }
//     });
//
//     concreteContainer.addEventListener('mousemove', (event) => {
//       if (this.gameboard.viewport) {
//         this.hexMouseMove(event)
//       }
//     });
//   }
//
//   drawGrid() {
//     this.gameboard.drawGrid(
//       "gamecanvas",
//       "hsl(60, 10%, 85%)",
//       this.showTilesWithLabels,
//       this.mapService.currentLayout,
//       this.mapService.hexMap,
//       this.showTileGraphics
//     );
//
//   }

  // handleContainerClick(event) {
  //   if (this.viewport) {
  //     var boundingRect = this.viewport.container.getBoundingClientRect(),
  //       x = event.clientX - boundingRect.left,
  //       y = event.clientY - boundingRect.top,
  //       key = this.viewport.getIntersection(x, y);
  //     console.log(boundingRect, x, y, key);
  //
  //   }
  // }

//   @action
//   setupHexCanvas(canvas) {
//     console.log(canvas);
//     let hexcontext = canvas.getContext('2d');
//     this.hexcontext = hexcontext;
//     // console.log('this.gameboard.centerX', this.gameboard.centerX);
//     // hexcontext.translate(this.gameboard.centerX/2, this.gameboard.centerY/2);
//   }
//
//   @action
//   setupMouseCanvas(canvas) {
//     console.log(canvas);
//     let mousecontext = canvas.getContext('2d');
//     this.mousecontext = mousecontext;
// // console.log('this.gameboard.centerX', this.gameboard.centerX);
// //     mousecontext.translate(this.gameboard.centerX/2, this.gameboard.centerY/2);
//   }
//
//
//
//   @action
//   setupGameCanvas(canvas) {
//     console.log(canvas);
//     // canvas
//     // let canvas = document.getElementById('gamecanvas');
//     let rect = canvas.getBoundingClientRect();
//     let centerX = (rect.width / 2) + rect.left;
//     let centerY = (rect.height / 2) + rect.top;
//     this.gameboard.set('rect', rect);
//     this.gameboard.set('centerX', centerX);
//     this.gameboard.set('centerY', centerY);
//
//     // Map setup
//     this.mapService.set('hexMap', this.hexService.createHexesFromMap(Map3.MAP));
//     this.mapService.set('twoDimensionalMap', Map3.MAP);
//
//     // Ship setup
//     if (this.showShip) {
//       this.transport.setupShip()
//     }
//
//
//     // TODO remove
//     this.showTileGraphics = false;
//   }

  // @action
  // gamehexClick(event) {
  //   console.group('gamehexClick');
  // }

  // @action
  // hexClick(event) {
  //   console.groupCollapsed('hex report');
  //
  //   let boundingRect = this.gameboard.viewport.container.getBoundingClientRect(),
  //     x = event.clientX - boundingRect.left - this.gameboard.centerX,
  //     y = event.clientY - boundingRect.top -this.gameboard.centerY;
  //     // key = this.gameboard.viewport.getIntersection(x, y);
  //   // console.log(boundingRect, x, y);
  //
  //
  //   // let x = event.clientX - this.gameboard.centerX;
  //   // let y = event.clientY - this.gameboard.centerY;
  //   console.log('click centerX', this.gameboard.centerX, 'centerY', this.gameboard.centerY, event, "x:", x, "y:", y);
  //   let point = new Point({x:x, y:y});
  //   console.log('clicked point', point);
  //   // console.log('this.currentLayout', this.mapService.currentLayout);
  //   let clickedHex = this.mapService.currentLayout.pixelToHex(point).round();
  //
  //   let mappedHex = this.mapService.findHexByQRS(clickedHex.q, clickedHex.r, clickedHex.s);
  //
  //   console.log('mappedHex', mappedHex);
  //   if (mappedHex && mappedHex.id) {
  //
  //     // this.gameboard.drawHex(this.mousecontext, this.mapService.currentLayout, mappedHex, "red", "red");
  //
  //     let hexToPixelPoint = this.mapService.currentLayout.hexToPixel(clickedHex);
  //     console.log('point', hexToPixelPoint);
  //
  //     // move ship
  //     this.transport.moveShipToHexTask.cancelAll();
  //     let path = this.mapService.findPath(this.mapService.twoDimensionalMap, this.transport.shipHex, mappedHex);
  //     this.transport.moveShipAlongPath(path);
  //
  //   }
  //   console.groupEnd();
  // }

  // hexMouseMove(event) {
  //   let boundingRect = this.gameboard.viewport.container.getBoundingClientRect(),
  //     x = event.clientX - boundingRect.left - this.gameboard.centerX,
  //     y = event.clientY - boundingRect.top -this.gameboard.centerY;
  //
  //   // let x = event.clientX - this.gameboard.centerX;
  //   // let y = event.clientY - this.gameboard.centerY;
  //
  //   let point = new Point({x:x, y:y});
  //   let thisHex = this.mapService.currentLayout.pixelToHex(point).round();
  //
  //   let targetHex = this.mapService.findHexByQRS(thisHex.q, thisHex.r, thisHex.s);
  //
  //   if(targetHex) {
  //     let pathDistanceToMouseHex = this.mapService.findPath(this.mapService.twoDimensionalMap, this.transport.shipHex, targetHex);
  //     this.pathDistanceToMouseHex = pathDistanceToMouseHex.length;
  //   } else {
  //     this.pathDistanceToMouseHex = 0;
  //   }
  //
  //   this.mouseXY = `X:${event.clientX} Y:${event.clientY}`;
  //   this.mousePoint = `X:${point.x} Y:${point.y}`;
  //   this.currentHex = `Q:${thisHex.q} R:${thisHex.r} S:${thisHex.s}`;
  //
  //   // this.gameboard.drawHex(this.hexcontext, this.mapService.currentLayout, thisHex, "red");
  // }

  @action
  toggleTiles() {
    this.showTileGraphics = !this.showTileGraphics;
    this.gameboard.viewport.layers[0].visible = this.showTileGraphics;
    this.gameboard.viewport.render();
  }

  @action
  toggleHexInfo() {
    this.showTileHexInfo = !this.showTileHexInfo;
    this.gameboard.viewport.layers[1].visible = this.showTileHexInfo;
    this.gameboard.viewport.render();
  }

  @action
  toggleMoveQueue() {
    this.transport.moveQueueEnabled = !this.transport.moveQueueEnabled;

    if (this.transport.moveQueueEnabled && this.transport.moveQueueTask.isIdle) {
      this.transport.moveQueueTask.perform();
    }
  }
}
