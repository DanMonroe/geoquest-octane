import Service from '@ember/service';
import { Layout } from '../objects/layout'
import { Point } from '../objects/point'
import { Graph } from '../objects/graph'
import { BinaryHeap } from '../objects/binary-heap'
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Konva from 'konva';

export default class MapService extends Service {

  MAPOPACITY = {
    HIDDEN: 0,
    PREVIOUSLYSEEN: .4,
    VISIBLE: 1
  }
  MAPFILLOPACITY = {
    HIDDEN: 'rgba(0,0,0,1)',
    PREVIOUSLYSEEN: 'rgba(0,0,0,0.6)',
    VISIBLE: 'rgba(0,0,0,0)'
  }
  MAPFILLTWEENDURATION = 0.5;

  @service ('store') store;
  @service ('gameboard') gameboard;
  @service ('transport') transport;
  @service ('path') pathService;
  @service ('camera') camera;
  @service ('hex') hexService;
  @service ('game') game;
  @service ('sound') sound;
  @service ('fieldOfView') fov;

  // @tracked hexSize = 24;  // get from init?  zoom level ?
  @tracked hexSizeX = 24;
  @tracked hexSizeY = 24;

  @tracked map = null;
  @tracked mapIndex = null;
  @tracked mapData = null; // array from index.js
  @tracked mapSeenHexes = null; // array from index.js

  @tracked hexMap = null;
  @tracked allHexesMap = null;    // All HexModel objects in single array format

  @tracked emberDataMap = null;

  worldMap = null;
  // worldMapHexArray = null;
  // worldMapHexes = null;  //  TODO need both worldMap and worldMapHexes?
  tileGraphics = [];
  currentLayout = null;
  @tracked tilesLoaded = false;

  // what hexes are currently loaded in the map
  @tracked topLeftPoint;
  @tracked bottomRightPoint;
  @tracked startRow;
  @tracked startCol;
  @tracked numRows = 0;
  @tracked numCols = 0;

  initMap(args) {
    let { map } = args;
    this.set('worldMap', map);
    // console.log('initMap', map);
    // this.set('worldMapHexes', this.hexService.createHexesFromMap(map));

    let graph = new Graph({
      gridIn: this.worldMap
    });
    graph.setup(); // cleans all nodes
    this.set('graph', graph);
  }

  // TODO 12/21/19 This method does a lot.. break up
  async loadEmberDataMap(mapIndex) {
    this.game.saveGame();

    this.emberDataMap = await this.store.findRecord('map', mapIndex, {include:'hexRows'});
    // console.log('emberDataMap', emberDataMap);

    this.mapIndex = mapIndex;
    // this.map = this.mapData[mapIndex].map;

    this.loadLayout(this.emberDataMap);

    // this.loadLayout({
    //   "type": emberDataMap.layoutType,
    //   "hexSizeX": emberDataMap.layoutHexSizeX,
    //   "hexSizeY": emberDataMap.layoutHexSizeY
    // });

    this.loadEmberDataTiles(this.emberDataMap);

    // TODO re-enable sounds
    // this.sound.loadSounds(this.mapData[mapIndex].sounds);

    // console.log(emberDataMap.hexGrid);

    // sets worldMap using the hexGrid (uses HexModel objects)
    // Creates a Graph Object
    this.initMap({map: this.emberDataMap.hexGrid});
    // this.camera.initCamera();

    // this.gameboard.setupMinimapCanvases();
    this.gameboard.setupGameboardCanvases();

    this.gameboard.initKeyboardAndMouseEventListeners();

    // setup just the hexes within view
    // this.setHexmapSubset();
    this.setEmberMapHexmapSubset(this.emberDataMap);

    //
    // Player, Agents, and transports
    // TODO figure out these from saved game or something
    let tempAgents = {
      player: {
        id: 1,
        start: {
          Q: 6,
          R: 0
        }
      },
      transports: [ 1 ],
      enemies: [ ]
    }
    let agentsObj = await this.transport.setupAgents(tempAgents);
    // let agentsObj = await this.transport.setupAgents(this.mapData[this.mapIndex].map.AGENTS);

    this.game.player = agentsObj.player;
    this.game.agents = agentsObj.agents;
    this.game.transports = agentsObj.transports;

    this.transport.setupPatrols();

    // this.gameboard.drawBackgroundMap(emberDataMap);

    console.time('drawGrid')

    this.gameboard.drawGrid({
      emberDataMap: this.emberDataMap,
      hexMap: this.hexMap,
      withLabels: this.game.showDebugLayer,
      withTiles: this.game.showTileGraphics,
      useEmberDataTiles: true
    });
    console.timeEnd('drawGrid');

    // this.fov.updatePlayerFieldOfView(this.game.player.hex)
    this.fov.updatePlayerFieldOfView()

    this.transport.moveQueueTask.perform();

  }

  // Map setup
  // async loadMap(mapIndex) {
  //   this.game.saveGame();
  //
  //   this.mapIndex = mapIndex;
  //   this.map = this.mapData[mapIndex].map;
  //
  //   this.loadLayout(this.map.LAYOUT);
  //   this.loadTiles(this.map);
  //   this.sound.loadSounds(this.mapData[mapIndex].sounds);
  //
  //   this.gameboard.setupQRSFromMap(this.map.MAP);
  //   this.initMap({map: this.map.MAP});
  //   this.camera.initCamera();
  //
  //   this.gameboard.setupGameboardCanvases();
  //   this.gameboard.initKeyboardAndMouseEventListeners();
  //
  //   this.setHexmapSubset();
  //
  //   // Player, Agents, and transports
  //   let agentsObj = await this.transport.setupAgents(this.mapData[this.mapIndex].map.AGENTS);
  //
  //   this.game.player = agentsObj.player;
  //   this.game.agents = agentsObj.agents;
  //   this.game.transports = agentsObj.transports;
  //
  //   this.transport.setupPatrols();
  //
  //   this.gameboard.drawGrid({
  //     hexes: this.hexMap,
  //     withLabels: this.game.showTileHexInfo,
  //     withTiles: this.game.showTileGraphics
  //   });
  //
  //   this.fov.updatePlayerFieldOfView()
  //   // this.fov.updatePlayerFieldOfView(this.game.player.hex)
  //
  //   this.transport.moveQueueTask.perform();
  // }

  updateSeenHexes(finalFovHexes) {
    if (typeof this.mapIndex === undefined || !finalFovHexes.visible) {
      return;
    }
    if (!this.mapSeenHexes) {
      this.mapSeenHexes = new Map();
    }

    let thisMapsSeenHexes = this.mapSeenHexes.get(this.mapIndex);

    if (!thisMapsSeenHexes) {
      thisMapsSeenHexes = new Set();
    }

    finalFovHexes.visible.forEach(hex => {
      thisMapsSeenHexes.add(hex.id);
    });

    this.mapSeenHexes.set(this.mapIndex, thisMapsSeenHexes);

    // console.log(this.mapSeenHexes);
  }

  loadSeenHexesFromStorage() {
    let seenHexesRaw = window.localStorage.getItem('GQseenHexes');
    if (seenHexesRaw) {
      let seenHexesJSON = Object.entries(JSON.parse(seenHexesRaw));
      this.mapSeenHexes = new Map();
      seenHexesJSON.forEach(seenHexObj => {
        let mapIndex = seenHexObj[0];
        let seenHexes = new Set(seenHexObj[1]);
        this.mapSeenHexes.set(mapIndex, seenHexes);
      })
    }
    // console.log(this.mapSeenHexes);
  }

  getSeenHexesForLoadedMap() {
    if (!this.mapSeenHexes) {
      return undefined;
    }
    return this.mapSeenHexes.get(`${this.mapIndex}`);
  }

  // Sets hexSizeX, hexSizeY, and currentLayout
  loadLayout(emberDataMap) {
    this.hexSizeX = emberDataMap.layoutHexSizeX;
    this.hexSizeY = emberDataMap.layoutHexSizeY;
    // this.currentLayout = emberDataMap.layout;
    if(emberDataMap.layout.orientation.type === "flat") {
    // if(layout.type === "flat") {
      this.currentLayout = new Layout({
        orientation: Layout.FLAT,
        size: new Point({x:this.hexSizeX, y:this.hexSizeY}),
        origin: new Point({x:0, y:0})
      });
    } else {
      this.currentLayout = new Layout({
        orientation: Layout.POINTY,
        size: new Point({x:this.hexSizeX, y:this.hexSizeY}),
        origin: new Point({x:0, y:0})
      });
    }

    // let hexPairWidth = this.currentLayout.hexWidth * 1.5;
    // return hexPairWidth;

  }

  loadEmberDataTiles(emberDataMap) {
    let tileset = emberDataMap.get('tileImages');

    // let tileset = map.TILEIMAGES
    // console.log('tileset', tileset);

    this.tileGraphics = [];
    this.tilesLoaded = false;
    let tileGraphicsLoaded = 0;
    for (let i = 0; i < tileset.length; i++) {

      let tileGraphic = new Image(36, 36);
      tileGraphic.alt = `${tileset[i]}`;
      tileGraphic.src = `/images/hex/${tileset[i]}`;
      tileGraphic.onload = () => {
        // Once the image is loaded increment the loaded graphics count and check if all images are ready.

        tileGraphicsLoaded++;

        if (tileGraphicsLoaded === tileset.length) {
          // console.log('tiles loaded');
          this.tilesLoaded = true;
        }
      }

      this.tileGraphics.pushObject(tileGraphic);
    }
  }

  // TODO DEPRECATED after ember data maps
  // loadTiles(map) {
  //   let tileset = map.TILEIMAGES
  //   // console.log(tileset);
  //
  //   this.tileGraphics = [];
  //   this.tilesLoaded = false;
  //   let tileGraphicsLoaded = 0;
  //   for (let i = 0; i < tileset.length; i++) {
  //
  //     let tileGraphic = new Image(36, 36);
  //     tileGraphic.src = `/images/hex/${tileset[i]}`;
  //     tileGraphic.onload = () => {
  //       // Once the image is loaded increment the loaded graphics count and check if all images are ready.
  //
  //       tileGraphicsLoaded++;
  //
  //       if (tileGraphicsLoaded === tileset.length) {
  //         // console.log('tiles loaded');
  //         this.tilesLoaded = true;
  //       }
  //     }
  //
  //     this.tileGraphics.pushObject(tileGraphic);
  //
  //   }
  //     console.log('tileGraphics', this.tileGraphics);
  // }

  getTileGraphic(tileIndex) {
    return this.tileGraphics[tileIndex];
  }

  getTileGraphicByAltProperty(tilename) {
    let tileIndex = this.tileGraphics.findIndex((img) => {
      return tilename === img.alt;
    })
    return (tileIndex >= 0) ? this.tileGraphics[tileIndex] : undefined;
  }

  // ability to pass in the source of hexes to search - should make finding faster when passed in smaller subset of maps.
  // findHexByQR(Q, R, sourceHexMap = this.hexMap) {
  //   let hex = undefined;
  //   for (let hexRow of sourceHexMap) {
  //     for (let hexObject of hexRow) {
  //       if ((Q === hexObject.q) && (R === hexObject.r)) {
  //         hex = hexObject;
  //         break;
  //       }
  //     }
  //     if (hex) {
  //       break;
  //     }
  //   }
  //   return hex;
  // }

  // ability to pass in the source of hexes to search - should make finding faster when passed in smaller subset of maps.
  findHexByQR(Q, R, sourceHexMap = this.allHexesMap) {
    let hex = sourceHexMap.find((hex) => {
      if (!hex) {
        return false;
      }
      return (Q === hex.q) && (R === hex.r);
    });
    // console.trace('findHexByQR', hex);
    return hex;
  }

  // ability to pass in the source of hexes to search - should make finding faster when passed in smaller subset of maps.
  // xyObj should be a json obj {x:xcoord, y:ycoord }
  // xcoord and ycoord will probably be a floating point
  // round, find hex coordinates that contain X and Y, then find HexModel
  findHexByXY(xyObj, sourceHexMap = this.allHexesMap) {
    // this will replace:
    // let point = new Point({x:newX, y:newY});
    // let thisHex = this.mapService.currentLayout.pixelToHex(point).round();
    // let segmentHex = this.mapService.findHexByQR(thisHex.q, thisHex.r, sourceHexMap);
    const hexCoordinates = this.currentLayout.pixelToHexCoordinate(xyObj);
    const hexModel = this.findHexByQR(hexCoordinates.q, hexCoordinates.r, sourceHexMap);
// console.log('xyObj', xyObj, 'hexCoordinates', hexCoordinates, 'findHexByXY hexModel', hexModel);
    return hexModel;
  }

  findPlayerHexNeighborByDirection(direction) {
    if (!direction) {
      return undefined;
    }
    let currentQ = this.game.player.hex.q;
    let currentR = this.game.player.hex.r;
    // let currentS = this.game.player.hex.s;

    let targetQ = currentQ + direction.q;
    let targetR = currentR + direction.r;
    // let targetS = currentS + direction.s;

    return this.findHexByQR(targetQ, targetR);
    // return this.findHexByQRS(targetQ, targetR, targetS);
  }

  setEmberMapHexmapSubset(emberDataMap) {
    let mapHexGrid = emberDataMap.hexGrid;

    let numCols = mapHexGrid[0].length;
    let numRows = mapHexGrid.length;
    // TODO uncomment when map is larger
    // let numCols = Math.min(this.camera.maxViewportHexesX + 2, map.MAP[0].length);
    // let numRows = Math.min(this.camera.maxViewportHexesY + 4, map.MAP.length);

    let startRow = 0;
    let startCol = 0

    let subsetMap = [];
    for (let r = startRow; r < (startRow + numRows); r++) {
      let subsetMapCols = [];
      for (let c = startCol; c < (startCol + numCols); c++) {
        let thisMapObject = this.worldMap[r][c];
        // console.log(thisMapObject);
        subsetMapCols.push(thisMapObject);
      }
      subsetMap.push(subsetMapCols);
    }

    // console.log('subsetMap', subsetMap);
    this.set('hexMap', subsetMap);    // All HexModel objects in double array format

    let allHexes = [];
    subsetMap.forEach(hexRow => {
      hexRow.forEach(hex => {
        allHexes.push(hex);
      });
    });
    this.set('allHexesMap', allHexes);    // All HexModel objects in single array format


    // this.set('hexMap', this.hexService.createHexesFromMap(subsetMap));
    this.set('startRow', startRow);
    this.set('startCol', startCol);
    this.set('numRows', numRows);
    this.set('numCols', numCols);

    let mapLength = this.hexMap.length;
    let topLeftPoint = this.hexMap[startCol*numRows].point;
    let bottomRightPoint = this.hexMap[mapLength-1].point;
    // let topLeftPoint = this.currentLayout.hexToPixel(this.hexMap[startCol*numRows]);
    // let bottomRightPoint = this.currentLayout.hexToPixel(this.hexMap[mapLength-1]);
    this.set('topLeftPoint', topLeftPoint);
    this.set('bottomRightPoint', bottomRightPoint);
  }

  // TODO DEPRECATED after ember data maps (setEmberMapHexmapSubset)
  // setHexmapSubset() {
  // // setHexmapSubset(startRow, startCol, numRows, numCols) {
  //
  //   let numCols = this.map.MAP[0].length;
  //   let numRows = this.map.MAP.length;
  //   // let numCols = Math.min(this.camera.maxViewportHexesX + 2, map.MAP[0].length);
  //   // let numRows = Math.min(this.camera.maxViewportHexesY + 4, map.MAP.length);
  //
  //   let startRow = 0;
  //   let startCol = 0
  //
  //
  //   let subsetMap = [];
  //   for (let r = startRow; r < (startRow + numRows); r++) {
  //     let subsetMapCols = [];
  //     for (let c = startCol; c < (startCol + numCols); c++) {
  //       let thisMapObject = this.worldMap[r][c];
  //       // console.log(thisMapObject);
  //       subsetMapCols.push(thisMapObject);
  //     }
  //     subsetMap.push(subsetMapCols);
  //   }
  //
  //   // console.log('subsetMap', subsetMap);
  //   this.set('hexMap', this.hexService.createHexesFromMap(subsetMap));
  //   this.set('startRow', startRow);
  //   this.set('startCol', startCol);
  //   this.set('numRows', numRows);
  //   this.set('numCols', numCols);
  //
  //   let mapLength = this.hexMap.length;
  //   let topLeftPoint = this.hexMap[startCol*numRows].point;
  //   let bottomRightPoint = this.hexMap[mapLength-1].point;
  //   // let topLeftPoint = this.currentLayout.hexToPixel(this.hexMap[startCol*numRows]);
  //   // let bottomRightPoint = this.currentLayout.hexToPixel(this.hexMap[mapLength-1]);
  //   this.set('topLeftPoint', topLeftPoint);
  //   this.set('bottomRightPoint', bottomRightPoint);
  // }
  //
  createHeap() {
    return new BinaryHeap({
      content: [],
      scoreFunction: (node) => {
        return node.pathFullScore;
        // return node.path.f;
      }
    });
  }

  // finds a node from the given hex in the
  // two dimensional array object
  findNodeFromHex(grid, hex) {
    let foundNode = null;

    for(var x = 0; x < grid.length; x++) {
      for (var y = 0; y < grid[x].length; y++) {
        let gridObj = grid[x][y];
        if (gridObj && gridObj.id === hex.id) {
          foundNode = gridObj;
          break;
        }
      }
      if (foundNode) { break; }
    }
    // console.log('foundNode', foundNode);
    return foundNode;
  }

  isBlockedByFlags(neighborPathFlags) {
    return !this.game.playerHasTravelAbilityFlag(neighborPathFlags);
  }

  distanceInHexes(startHex, targetHex) {
    return this.pathService.heuristics.hex(startHex, targetHex);
  }

  // https://briangrinstead.com/blog/astar-search-algorithm-in-javascript-updated/
  findPathEmberData(gridIn, startHex, targetHex, options = {}) {
    if (options.debug) {
      console.time("findPathEmberData");
      console.log(`findPath from ${startHex.id} to ${targetHex.id}`);
      // console.groupCollapsed(`findPath from ${startHex.id} to ${targetHex.id}`);
      // console.groupCollapsed(`findPath from ${startHex.id} to ${targetHex.id}`);
    }

    let distance = this.pathService.heuristics.hex;

    let closest = options.closest || true;
    // console.log('closest', closest);

    let openHeap = this.createHeap();
    // let graph = new Graph({
    //   gridIn: gridIn
    // });
    // graph.setup(); // cleans all nodes

    // TODO 4/11/19 do we need to clean all nodes each time we find path?  12/5/2019 - Yes
    let graph = this.graph;
    graph.cleanNodes();

    let startNode = this.findNodeFromHex(graph.gridIn, startHex);
    let endNode = this.findNodeFromHex(graph.gridIn, targetHex);

    // TODO!!   isBlockedByFlags uses the player...   What about ENEMIES that use this method?!!!!!

    // console.log('this.isBlockedByFlags(targetHex.travelFlags)', this.isBlockedByFlags(endNode.travelFlags), endNode.travelFlags);
    if (this.isBlockedByFlags(endNode.travelFlags)) {
      if (options.debug) {
        console.log('isBlockedByFlags: endNode.travelFlags', endNode.travelFlags);
      }
      return [];
    }


    let closestNode = startNode; // set the start node to be the closest if required

    // path:
    // heuristicDistance = heuristic path ("smart" shortest distance - only search in directions that are closer to target)
    // pathScore = g score is the shortest distance from start to current node.
    // pathFullScore = neighbor.path.g + neighbor.path.h ??
    // pathWeight = path weight for the node (used for walls, blocking, travel through cost)

    // old: pre emberData
    // path.h = heuristic path ("smart" shortest distance - only search in directions that are closer to target)
    // path.g = g score is the shortest distance from start to current node.
    // path.f = neighbor.path.g + neighbor.path.h ??
    // path.w = path weight for the node (used for walls, blocking, travel through cost)

    // startNode.path.h = distance(startNode, endNode);
    startNode.heuristicDistance = distance(startNode, endNode);

    graph.markDirty(startNode);

    openHeap.push(startNode);

    if (options.debug) {
      console.log('startNode', startNode, 'endNode', endNode);
    }

    let visitedCounter = 0;

    while (openHeap.size() > 0) {

      // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
      let currentNode = openHeap.pop();
      // if (options.debug) {
      //   console.log('openHeap.size()', openHeap.size(), 'currentNode', currentNode, 'endNode', endNode);
      // }

      // End case -- result has been found, return the traced path.
      if (currentNode.id === endNode.id) {
        let path = this.pathService.to(currentNode);
        if (options.debug) {
          console.log('path', path);
          console.groupEnd();
          console.timeEnd("findPathEmberData");
        }
        return path;
      }

      // Normal case -- move currentNode from open to closed, process each of its neighbors.
      currentNode.pathClosed = true;
      // currentNode.path.closed = true;

      // Find all neighbors for the current node.
      let neighbors = graph.neighbors(currentNode);
// if (options.debug) {
// console.log('currentNode', currentNode);
// console.log('neighbors', neighbors);
// }

      for (let i = 0, il = neighbors.length; i < il; ++i) {
        let neighbor = neighbors[i];

        if(neighbor) {
// console.log('current neighbor.', neighbor.id, neighbor);

          if (neighbor.pathClosed || this.isBlockedByFlags(neighbor.travelFlags)) {
          // if (neighbor.path.closed || this.isBlockedByFlags(neighbor.path.flags)) {
          // if (neighbor.path.closed || neighbor.pathWeight !== 0) {   // this line works with pathfinding before FLAGS

            // Not a valid node to process, skip to next neighbor.
// console.log('Not a valid node to process, skip to next neighbor.', neighbor.id);
            continue;
          }
          // The g score is the shortest distance from start to current node.
          // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
          let gScore = currentNode.pathScore + neighbor.pathWeight;
          // let gScore = currentNode.g + neighbor.getCost(currentNode);
          let beenVisited = neighbor.pathVisited;
          // let beenVisited = neighbor.path.visited;

          if (!beenVisited || gScore < neighbor.pathScore) {

            if (options.debug) {
              visitedCounter++;
              // console.log('visited neighbor', neighbor.id, visitedCounter, neighbor);
              this.drawVisitedRect(neighbor, visitedCounter)

            }

// console.group('neighbor');
            // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
            neighbor.pathVisited = true;
            // neighbor.path.visited = true;
            neighbor.pathParent = currentNode;
            // neighbor.path.parent = currentNode;
            neighbor.heuristicDistance = neighbor.heuristicDistance || distance(neighbor, endNode);
            neighbor.pathScore = gScore;
            neighbor.pathFullScore = neighbor.pathScore + neighbor.heuristicDistance;

// console.log('pathVisited', neighbor.pathVisited);
// console.log('pathParent.id', neighbor.pathParent.id);
// console.log('heuristicDistance', neighbor.heuristicDistance);
// console.log('distance', distance(neighbor, endNode));
// console.log('pathScore', neighbor.pathScore);
// console.log('pathFullScore', neighbor.pathFullScore);

            graph.markDirty(neighbor);
            if (closest) {
// console.group('closestNode');
// console.log('closestNode.heuristicDistance', closestNode.heuristicDistance);
// console.log('closestNode.pathScore', closestNode.pathScore);
// console.log('neighbor.heuristicDistance < closestNode.heuristicDistance', neighbor.heuristicDistance < closestNode.heuristicDistance);
// console.log('(neighbor.heuristicDistance === closestNode.heuristicDistance && neighbor.pathScore < closestNode.pathScore)', (neighbor.heuristicDistance === closestNode.heuristicDistance && neighbor.pathScore < closestNode.pathScore));

              // If the neighbor is closer than the current closestNode or if it's equally close but has
              // a cheaper path than the current closest node then it becomes the closest node
              if (neighbor.heuristicDistance < closestNode.heuristicDistance || (neighbor.heuristicDistance === closestNode.heuristicDistance && neighbor.pathScore < closestNode.pathScore)) {
// console.log('!!! setting closestNode');
                closestNode = neighbor;
              }
// console.groupEnd();
            }
// console.groupEnd();

// console.log(' --> beenVisited', beenVisited);
            if (!beenVisited) {
              // Pushing to heap will put it in proper place based on the 'f' value.
              openHeap.push(neighbor);
            } else {
              // Already seen the node, but since it has been rescored we need to reorder it in the heap
              openHeap.rescoreElement(neighbor);
            }

            if (distance(neighbor, endNode) === 0) {
// console.log('distance(neighbor, endNode) = 0');
              break;
            }
          } // if
        } // if neighbor
      }  // for

    } // while

    if (closest) {
// console.log('closestNode', closestNode.id, closestNode);
      let path = this.pathService.to(closestNode);
      if (options.debug) {
        console.groupEnd();
      }
      return path;
    }

    if (options.debug) {
      console.groupEnd();
    }

    // No result was found - empty array signifies failure to find path.
    return [];
  }

  // TODO DEPRECATE after EmberDataMap
  // https://briangrinstead.com/blog/astar-search-algorithm-in-javascript-updated/
  findPath(gridIn, startHex, targetHex, options = {}) {

    if (options.debug) {
      console.groupCollapsed(`findPath from ${startHex.id} to ${targetHex.id}`);
    }

    const distance = this.pathService.heuristics.hex;

    const closest = options.closest || true;
    // console.log('closest', closest);

    let openHeap = this.createHeap();
    // let graph = new Graph({
    //   gridIn: gridIn
    // });
    // graph.setup(); // cleans all nodes

    // TODO 4/11/19 do we need to clean all nodes each time we find path?
    let graph = this.graph;
    graph.cleanNodes();

    let startNode = this.findNodeFromHex(graph.gridIn, startHex);
    let endNode = this.findNodeFromHex(graph.gridIn, targetHex);

    var closestNode = startNode; // set the start node to be the closest if required

    // path:
    // path.h = heuristic path ("smart" shortest distance - only search in directions that are closer to target)
    // path.g = g score is the shortest distance from start to current node.
    // path.f = neighbor.path.g + neighbor.path.h ??
    // path.w = path weight for the node (used for walls, blocking, travel through cost)

    startNode.path.h = distance(startNode, endNode);

    graph.markDirty(startNode);

    openHeap.push(startNode);

    if (options.debug) {
      console.log('startNode', startNode, 'endNode', endNode);
    }

    let visitedCounter = 0;

    while (openHeap.size() > 0) {

      // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
      var currentNode = openHeap.pop();
      if (options.debug) {
        console.log('openHeap.size()', openHeap.size(), 'currentNode', currentNode);
      }

      // End case -- result has been found, return the traced path.
      if (currentNode.id === endNode.id) {
        if (options.debug) {
          console.log('currentNode.id === endNode.id - done');
        }

        let path = this.pathService.to(currentNode);
        if (options.debug) {
          console.groupEnd();
        }
        return path;
      }

      // Normal case -- move currentNode from open to closed, process each of its neighbors.
      currentNode.path.closed = true;

      // Find all neighbors for the current node.
      var neighbors = graph.neighbors(currentNode);
      for (var i = 0, il = neighbors.length; i < il; ++i) {
        var neighbor = neighbors[i];

        if(neighbor) {

          if (neighbor.path.closed || this.isBlockedByFlags(neighbor.path.flags)) {
// if (neighbor.path.closed || neighbor.path.w !== 0) {   // this line works with pathfinding before FLAGS

            // Not a valid node to process, skip to next neighbor.
            continue;
          }
          // The g score is the shortest distance from start to current node.
          // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
          var gScore = currentNode.path.g + neighbor.path.w;
          // var gScore = currentNode.g + neighbor.getCost(currentNode);
          var beenVisited = neighbor.path.visited;

          if (!beenVisited || gScore < neighbor.path.g) {

            if (options.debug) {
              visitedCounter++;
              console.log('visited neighbor', neighbor.id, visitedCounter, neighbor);
              this.drawVisitedRect(neighbor, visitedCounter)

            }

            // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
            neighbor.path.visited = true;
            neighbor.path.parent = currentNode;
            neighbor.path.h = neighbor.path.h || distance(neighbor, endNode);
            neighbor.path.g = gScore;
            neighbor.path.f = neighbor.path.g + neighbor.path.h;
            graph.markDirty(neighbor);
            if (closest) {
              // If the neighbor is closer than the current closestNode or if it's equally close but has
              // a cheaper path than the current closest node then it becomes the closest node
              if (neighbor.path.h < closestNode.path.h || (neighbor.path.h === closestNode.path.h && neighbor.path.g < closestNode.path.g)) {
                closestNode = neighbor;
              }
            }

            if (!beenVisited) {
              // Pushing to heap will put it in proper place based on the 'f' value.
              openHeap.push(neighbor);
            } else {
              // Already seen the node, but since it has been rescored we need to reorder it in the heap
              openHeap.rescoreElement(neighbor);
            }
          } // if
        } // if neighbor
      }  // for

    } // while

    if (closest) {
      let path = this.pathService.to(closestNode);
      if (options.debug) {
        console.groupEnd();
      }
      return path;
    }

    if (options.debug) {
      console.groupEnd();
    }

    // No result was found - empty array signifies failure to find path.
    return [];
  }

  reportGetNeighborHexesInRange() {
    let player = this.game.player;
    // let start = performance.now();
    let neighborsInRangeArray = [];
    this.getNeighborHexesInRange(1, player.sightRange, player.hex, neighborsInRangeArray)
    // let end = performance.now();
    // console.log('getNeighborHexesInRange time', end -  start);
    // console.log(neighborsInRangeArray);
  }

  // get an array of "neighbors" up to n range
  // does not set any properties
  getNeighborHexesInRange(currentIteration, maxRange, currentNode, neighborsInRangeArray) {
    this.graph.cleanNodes();

    let neighbors = this.graph.neighbors(currentNode);
    for (let i = 0, il = neighbors.length; i < il; ++i) {
      let neighbor = neighbors[i];
      if (neighbor) {
        if (neighbor.visual && neighbor.visual.checked) {
          // console.log('checked', neighbor);
        } else {
          neighbor.visual = neighbor.visual || {};
          neighbor.visual.checked = true;

          // TODO 12/21/19 This is called a lot - uses all hexes in map
          let hex = this.findHexByQR(neighbor.q, neighbor.r);
          // let hex = this.findHexByQRS(neighbor.q, neighbor.r, neighbor.s);
          if (hex && !neighborsInRangeArray.includes(hex)) {
            neighborsInRangeArray.push(hex);
          }
        }

        if (currentIteration < maxRange) {
          this.getNeighborHexesInRange(currentIteration + 1, maxRange, neighbor, neighborsInRangeArray);
        }
      }
    }
  }

  // shows yellow boxes 'visited' during the findPath method
  drawVisitedRect(neighbor, visitedCounter) {
    this.gameboard.clearDebugLayer();
    let debugLayer = this.camera.getDebugLayer();
    let center = neighbor.point;
    // let center = this.currentLayout.hexToPixel(neighbor);

    var rect = new Konva.Rect({
      x: center.x+8,
      y: center.y-12,
      width: 16,
      height: 12,
      fill: 'yellow',
      listening: false
    });

    debugLayer.add(rect);

    let counterText = new Konva.Text({
      x: center.x+10,
      y: center.y-10,
      text: visitedCounter,
      fontSize: 10,
      fontFamily: 'sans-serif',
      fill: 'black',
      listening: false
    });
    debugLayer.add(counterText);

    debugLayer.draw();
  }
}
