import Service from '@ember/service';
import { BinaryHeap } from '../objects/binary-heap';
import {inject as service} from '@ember/service';

export default class PathService extends Service {

  @service ('map') mapService;
  @service ('hex') hexService;

  // distance algorithms
  heuristics = {
    /**
     * To calculate the hex-distance between two hexes, calculate the
     difference between their x-coördinates, the difference between their y-
     coördinates, and the difference between these two differences; take
     the absolute value of each of these three numbers, and the distance is
     the largest of these three values.
     */
    hex (pos0, pos1) {
      if (!pos0 || !pos1) {
        return 0
      }
      // debugger;
      let d1 = pos1.q - pos0.q
      let d2 = pos1.r - pos0.r
      let d3 = pos1.s - pos0.s
      let distance = Math.max(Math.abs(d1), Math.abs(d2), Math.abs(d3))

      return distance
    },
    manhattan (pos0, pos1) {
      var d1 = Math.abs(pos1.col - pos0.col)
      var d2 = Math.abs(pos1.row - pos0.row)
      return d1 + d2
    },
    diagonal (pos0, pos1) {
      var D = 1
      var D2 = Math.sqrt(2)
      var d1 = Math.abs(pos1.col - pos0.col)
      var d2 = Math.abs(pos1.row - pos0.row)
      return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2))
    }
  }

  heap() {
    return new BinaryHeap(function(node) {
      return node.path.f;
    });
  }

  findGraphNode(sourceList, targetNode) {
    if (!sourceList || !targetNode) {
      return null;
    }
    return sourceList.find(sourceNode => {
      return sourceNode.id === targetNode.id;
    })
  }

  removeGraphNode(sourceList, targetNode) {
    return sourceList.reject((node) => {
      return this.hexService.hasSameCoordinates(targetNode, node);
    });
  }

  // builds the resulting path
  to(node) {
    let ret = [];
    while(node.path.parent) {
      ret.push(node);
      node = node.path.parent;
    }
    return ret.reverse();
  }

  // TODO
  // expand when more tile types available
  // for now, return blocked if the neighbor.m !== 'w" // water
  isWall(neighbor) {
    return false;
    // return neighbor.m !== 'w';
  }


}
