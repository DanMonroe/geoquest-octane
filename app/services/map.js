import Service from '@ember/service';
import { Layout } from '../objects/layout'
import { Point } from '../objects/point'
import { Graph } from '../objects/graph'
import { BinaryHeap } from '../objects/binary-heap'
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class MapService extends Service {

  @service ('gameboard') gameboard;
  @service ('map') mapService;
  @service ('path') pathService;

  @tracked hexSize = 36; //

  @tracked hexMap = null;
  worldMap = null;
  tileGraphics = [];
  currentLayout = null;
  @tracked tilesLoaded = false;

  @tracked mapOriginX = 36;
  @tracked mapOriginY = 36;

  // what hexes are currently loaded in the map
  @tracked topLeftPoint;
  @tracked bottomRightPoint;
  @tracked startRow;
  @tracked startCol;
  @tracked numRows = 0;
  @tracked numCols = 0;

  get maxRightXLoaded() {
    console.log('maxRightXLoaded');

    if (!this.numCols) {
      return 0;
    }

    if (this.numCols % 2 === 0) {
      let width = (this.numCols / 2)
    } else {
    }
  }

  loadLayout() {
    this.currentLayout = new Layout({
      orientation: Layout.FLAT,
      size: new Point({x:this.hexSize, y:this.hexSize}),
      origin: new Point({x:0, y:0})
    });

    let hexPairWidth = this.currentLayout.hexWidth * 1.5;
    return hexPairWidth;

  }

  loadTiles(map) {
    let tileset = map.TILEIMAGES
    // console.log(tileset);

    this.tileGraphics = [];
    this.tilesLoaded = false;
    let tileGraphicsLoaded = 0;
    for (let i = 0; i < tileset.length; i++) {

      let tileGraphic = new Image(36, 36);
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

  findHexByQRS(Q, R, S) {
    let hex = this.hexMap.find((hex) => {
      return (Q === hex.q) && (R === hex.r) && (S === hex.s);
    });
    return hex;
  }

  createHeap() {
    return new BinaryHeap({
      content: [],
      scoreFunction: (node) => {
        return node.path.f;
        // return node.f;
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

  // https://briangrinstead.com/blog/astar-search-algorithm-in-javascript-updated/
  findPath(gridIn, startHex, targetHex, options = {}) {
// console.log('findPath', gridIn, startHex, targetHex);

    var distance = this.pathService.heuristics.hex;

    var closest = options.closest || false;

    let openHeap = this.createHeap();

    let graph = new Graph({
      gridIn: gridIn
    });
    graph.setup(); // cleans all nodes

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

    while (openHeap.size() > 0) {
      // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
      var currentNode = openHeap.pop();

      // End case -- result has been found, return the traced path.
      if (currentNode.id === endNode.id) {
        return this.pathService.to(currentNode);
      }

      // Normal case -- move currentNode from open to closed, process each of its neighbors.
      currentNode.path.closed = true;

      // Find all neighbors for the current node.
      var neighbors = graph.neighbors(currentNode);
      for (var i = 0, il = neighbors.length; i < il; ++i) {
        var neighbor = neighbors[i];

        if(neighbor) {
          // TODO cant get theWall to work
          if (neighbor.path.closed || neighbor.path.w !== 0) {
            // if (neighbor.closed || neighbor.isWall) {
            // if (neighbor.closed || neighbor.isWall()) {
            // Not a valid node to process, skip to next neighbor.
            continue;
          }
          // The g score is the shortest distance from start to current node.
          // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
          var gScore = currentNode.path.g + neighbor.path.w;
          // var gScore = currentNode.g + neighbor.getCost(currentNode);
          var beenVisited = neighbor.path.visited;

          if (!beenVisited || gScore < neighbor.path.g) {

            // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
            neighbor.path.visited = true;
            neighbor.path.parent = currentNode;
            neighbor.path.h = neighbor.path.h || distance(neighbor, endNode);
            neighbor.path.g = gScore;
            neighbor.path.f = neighbor.path.g + neighbor.path.h;
            graph.markDirty(neighbor);
            if (closest) {
              // If the neighbour is closer than the current closestNode or if it's equally close but has
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
      return this.pathService.to(closestNode);
    }

    // No result was found - empty array signifies failure to find path.
    return [];
  }

}
