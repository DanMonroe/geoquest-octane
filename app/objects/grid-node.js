export class GridNode {
  // x = null;
  // y = null;

  constructor() {
    // this.x = arguments[0].x;
    // this.y = arguments[0].y;
  }

  getCost(fromNeighbor) {
    return this.path.w;
    // return this.weight;
  }
}
