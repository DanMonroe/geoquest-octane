import Service, { inject as service } from '@ember/service'
import { Layout } from '../objects/layout'
import { Point } from '../objects/point'
import { Graph } from '../objects/graph'
import { BinaryHeap } from '../objects/binary-heap'
import { tracked } from '@glimmer/tracking'
import { isEmpty } from '@ember/utils';
import Konva from 'konva'

export default class MapService extends Service {

  @service ('store') store;
  @service gameboard;
  @service transport;
  @service ('path') pathService;
  @service camera;
  @service ('hex') hexService;
  @service game;
  @service config;
  @service sound;
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

  @tracked worldMap = null;
  // worldMapHexArray = null;
  // worldMapHexes = null;  //  TODO need both worldMap and worldMapHexes?
  tileGraphics = [];

  @tracked currentLayout = null;
  // TODO  convert to model 1/5/20
  // get currentLayout() {
  //   if (isEmpty(this.emberDataMap)) {
  //     return null;
  //   }
  //   return this.emberDataMap.layout;
  // }

  @tracked tilesLoaded = false;

  @tracked startRow;
  @tracked startCol;
  // @tracked numRows = 0;
  // @tracked numCols = 0;

  get numMapRows() {
    if (isEmpty(this.worldMap)) {
      return 0;
    }
    return this.worldMap.length;
  }
  get numMapColumns() {
    if (isEmpty(this.worldMap) && isEmpty(this.worldMap[0])) {
      return 0;
    }
    return this.worldMap[0].length;
  }

  initMap(args) {
    let { map } = args;
    this.set('worldMap', map);

    let graph = new Graph({
      gridIn: this.worldMap
    });
    graph.setup(); // cleans all nodes
    this.set('graph', graph);
  }

  // TODO 12/21/19 This method does a lot.. break up
  async loadMap(mapIndex) {
    this.game.saveGame();

    this.emberDataMap = await this.store.findRecord('map', mapIndex, {include:'hexRows'});

    this.mapIndex = mapIndex;

    this.loadLayout(this.emberDataMap);

    this.loadTiles(this.emberDataMap);

    // TODO re-enable sounds
    // this.sound.loadSounds(this.mapData[mapIndex].sounds);

    // sets worldMap using the hexGrid (uses HexModel objects)
    // Creates a Graph Object
    this.initMap({map: this.emberDataMap.hexGrid});

    this.camera.initCamera();  // 1/3/20  - still needed?

    // this.gameboard.setupMinimapCanvases();
    this.gameboard.setupGameboardCanvases();

    this.gameboard.initMouseEventListeners();

    // setup just the hexes within view
    // this.setHexmapSubset();
    this.setHexmapSubset(this.emberDataMap);

    //
    // Player, Agents, and transports
    // TODO figure out these from saved game or something
    let tempAgents = {
      player: {
        id: 1,
        start: {
          // Q: 6,
          // R: 0,
          col: 6,
          row: 5
        }
      },
      transports: [ 1 ],
      enemies: [ ]
      // transports: [ 1 ],
      // enemies: [ 1 ]
    }

    await this.transport.setupAgents(tempAgents);

    this.transport.setupPatrols();

    console.time('drawGrid');

    this.gameboard.drawGrid({
      emberDataMap: this.emberDataMap,
      hexMap: this.hexMap,
      withTileHexInfo: this.game.showTileHexInfo
      // withTiles: this.game.showTileGraphics,
      // useEmberDataTiles: true
    });
    console.timeEnd('drawGrid');

    // this.fov.updatePlayerFieldOfView(this.game.player.hex)
    this.fov.updatePlayerFieldOfView();

    this.transport.moveQueueTask.perform();

  }

  // what hexes are currently loaded in the map
  get topLeftPoint() {
    if (this.worldMap) {
      return this.worldMap[0][0].roundedPoint;
    }
    return new Point({x:0, y:0});
  }
  get bottomRightPoint() {
    if (this.worldMap) {
      let numRows = this.worldMap.length;
      let numCols = this.worldMap[0].length;
      return this.worldMap[numRows-1][numCols-1].roundedPoint;
    }
    return new Point({x:0, y:0})
  }

  /* current player's sightRange distance in pixels
  * used to determine scrolling player or map
  * left/right
  * (sightRange - .5)  * hex width  if sightRange is even
  * (sightRange + .25) * hex width  if sightRange is odd
  *
  * up/down
  * (sightRange + .5) * hex height
  */
  get playerVerticalSightRange() {
    if (isEmpty(this.game.player)) {
      return 0;
    }
    if(this.game.player.sightRange && this.worldMap) {
      return (this.game.player.sightRange + .5) * this.currentLayout.hexHeight;
    }
    return 0;
  }
  get playerHorizontalSightRange() {
    if (isEmpty(this.game.player)) {
      return 0;
    }
    if(this.game.player.sightRange && this.worldMap) {
      return this.game.player.sightRange % 2 === 1 ?
        (this.game.player.sightRange + .25) * this.currentLayout.hexWidth :
        (this.game.player.sightRange - .5) * this.currentLayout.hexWidth;
    }
    return 0;
  }


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

  }

  loadTiles(emberDataMap) {
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


  // TODO  Some of this code is a duplicate of code in Graph
  // i.e, findHexByColRow is graph.getNeighborByColAndRow

  findHexByColRow(col, row) {
    if (this.worldMap && ((row >= 0 && row < this.worldMap.length) && (col >= 0 && col < this.worldMap[0].length))) {
      return this.worldMap[row][col];
    }
    return false;
    // let hex = sourceHexMap.find((hex) => {
    //   if (!hex) {
    //     return false;
    //   }
    //   return (Q === hex.q) && (R === hex.r);
    // });
    // // console.trace('findHexByQR', hex);
    // return hex;
  }

  // ability to pass in the source of hexes to search - should make finding faster when passed in smaller subset of maps.
  // xyObj should be a json obj {x:xcoord, y:ycoord }
  // xcoord and ycoord will probably be a floating point
  // round, find hex coordinates that contain X and Y, then find HexModel
  findHexByXY(xyObj, sourceHexMap = this.allHexesMap) {
    const hexCoordinates = this.currentLayout.pixelToHexCoordinate(xyObj);
    return this.findHexByQR(hexCoordinates.q, hexCoordinates.r, sourceHexMap);
  }

  findPlayerHexNeighborByDirection(direction) {
    if (!direction) {
      return undefined;
    }
    const targetCol = this.game.player.hex.col + direction.col;
    const targetRow = this.game.player.hex.row + (this.game.player.hex.col % 2 === 1 ? direction.rowodd : direction.roweven);
    return this.findHexByColRow(targetCol, targetRow);
  }

  setHexmapSubset(emberDataMap) {
    let mapHexGrid = emberDataMap.hexGrid;

    let numCols = mapHexGrid[0].length;
    let numRows = mapHexGrid.length;

    // TODO uncomment when map is larger
    // let numColsSubset = Math.min(this.camera.maxViewportHexesX + 2, mapHexGrid[0].length);
    // let numRowsSubset = Math.min(this.camera.maxViewportHexesY + 4, mapHexGrid.length);

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

    // let mapLength = this.hexMap.length;
    // let topLeftPoint = this.hexMap[startCol*numRows].point;
    // let bottomRightPoint = this.hexMap[mapLength-1].point;
    // // let topLeftPoint = this.currentLayout.hexToPixel(this.hexMap[startCol*numRows]);
    // // let bottomRightPoint = this.currentLayout.hexToPixel(this.hexMap[mapLength-1]);
    // this.set('topLeftPoint', topLeftPoint);
    // this.set('bottomRightPoint', bottomRightPoint);
  }

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

  isBlockedByFlags(sourceFlags, targetFlag) {
    return ! this.game.isOnForFlag(sourceFlags, targetFlag);
  }

  distanceInHexes(startHex, targetHex) {
    return this.pathService.heuristics.hex(startHex, targetHex);
  }

  // returns a Point object with x/y coords that are the differences between the two hexes
  distanceInPoint(startHex, targetHex) {
    return this.pathService.heuristics.point(startHex, targetHex);
  }

    // https://briangrinstead.com/blog/astar-search-algorithm-in-javascript-updated/
  findPath(gridIn, startHex, targetHex, options = {}) {
// performance.mark("findPathStart");
//     if (options.debug) {
      // console.time("findPath");
      // console.log(`findPath from ${startHex.id} to ${targetHex.id} in gridIn`, gridIn, 'graph:', this.graph);
    // }

    let distance = this.pathService.heuristics.hex;

    let closest = options.closest || true;

    let openHeap = this.createHeap();

    // TODO 4/11/19 do we need to clean all nodes each time we find path?  12/5/2019 - Yes
    let graph = this.graph;
    graph.cleanNodes();

    let startNode = this.findNodeFromHex(graph.gridIn, startHex);
    let endNode = this.findNodeFromHex(graph.gridIn, targetHex);

    const agent = options.agent || this.game.player;
    // if (options.debug) {
    //   console.log('agent.travelFlags', agent.travelFlags, 'endNode.travelFlags', endNode.travelFlags);
    // }

    if (this.isBlockedByFlags(agent.travelFlags, endNode.travelFlags)) {
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

    startNode.heuristicDistance = distance(startNode, endNode);

    graph.markDirty(startNode);

    openHeap.push(startNode);

    // if (options.debug) {
    //   console.log('startNode', startNode, 'endNode', endNode);
    // }

    let visitedCounter = 0;

    while (openHeap.size() > 0) {

      // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
      let currentNode = openHeap.pop();

      // End case -- result has been found, return the traced path.
      if (currentNode.id === endNode.id) {
        let path = this.pathService.to(currentNode);
        if (options.debug) {
          console.log('path', path);
          // console.groupEnd();
          // console.timeEnd("findPath");
        }

// performance.mark("findPathEnd");
// performance.measure("measure findPathStart to findPathEnd", "findPathStart", "findPathEnd");

// this.config.reportAndResetPerformance();
        return path;
      }

      // Normal case -- move currentNode from open to closed, process each of its neighbors.
      currentNode.pathClosed = true;
      // currentNode.path.closed = true;

      // Find all neighbors for the current node.
      let neighbors = graph.neighbors(currentNode);

      for (let i = 0, il = neighbors.length; i < il; ++i) {
        let neighbor = neighbors[i];

        if(neighbor) {
          if (neighbor.pathClosed || this.isBlockedByFlags(agent.travelFlags, neighbor.travelFlags)) {

            // Not a valid node to process, skip to next neighbor.
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

            // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
            neighbor.pathVisited = true;
            neighbor.pathParent = currentNode;
            neighbor.heuristicDistance = neighbor.heuristicDistance || distance(neighbor, endNode);
            neighbor.pathScore = gScore;
            neighbor.pathFullScore = neighbor.pathScore + neighbor.heuristicDistance;

            graph.markDirty(neighbor);
            if (closest) {
              // If the neighbor is closer than the current closestNode or if it's equally close but has
              // a cheaper path than the current closest node then it becomes the closest node
              if (neighbor.heuristicDistance < closestNode.heuristicDistance || (neighbor.heuristicDistance === closestNode.heuristicDistance && neighbor.pathScore < closestNode.pathScore)) {
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

            if (distance(neighbor, endNode) === 0) {
              break;
            }
          } // if
        } // if neighbor
      }  // for

    } // while

    if (closest) {
      let path = this.pathService.to(closestNode);
      // if (options.debug) {
      //   console.groupEnd();
      // }
      return path;
    }

    // if (options.debug) {
    //   console.groupEnd();
    // }

    // No result was found - empty array signifies failure to find path.
    return [];
  }

  // 12/30/19 - This is very expensive/slow with large maps
  // get an array of "neighbors" up to n range
  // does not set any properties
  originalButSlowGetNeighborHexesInRange(currentIteration, maxRange, currentNode, neighborsInRangeArray) {
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

  getNeighborHexesInRange(currentIteration, maxRange, currentNode, neighborsInRangeArray) {
    // this.graph.cleanNodes();

    let neighbors = this.graph.neighbors(currentNode);
// console.log('fasterGetNeighborHexesInRange currentIteration', currentIteration, 'neighbors', neighbors);
    for (let i = 0, il = neighbors.length; i < il; ++i) {
      let neighbor = neighbors[i];
      if (neighbor) {
        if (neighbor.visual && neighbor.visual.checked) {
          // console.log('checked', neighbor);
        } else {
          neighbor.visual = neighbor.visual || {};
          neighbor.visual.checked = true;

          if (!neighborsInRangeArray.includes(neighbor)) {
            neighborsInRangeArray.push(neighbor);
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
    let debugGroup = this.camera.getDebugLayerGroup();
    let center = neighbor.point;

    var rect = new Konva.Rect({
      x: center.x+8,
      y: center.y-12,
      width: 16,
      height: 12,
      fill: 'yellow',
      listening: false
    });

    debugGroup.add(rect);

    let counterText = new Konva.Text({
      x: center.x+10,
      y: center.y-10,
      text: visitedCounter,
      fontSize: 10,
      fontFamily: 'sans-serif',
      fill: 'black',
      listening: false
    });
    debugGroup.add(counterText);
    this.camera.stage.batchDraw();
  }
}
