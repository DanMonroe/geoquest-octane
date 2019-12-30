export class Graph {
  grid = [];
  gridIn = null;
  nodes = [];
  dirtyNodes = [];

  constructor(args) {
    this.gridIn = args.gridIn;
    // this.y = arguments[0].y;
  }

  // directions go in this order from originating hex:
  // SE, NE, N, NW, SW, S
  static directions_even = [
    {col:1, row:0},
    {col:1, row:-1},
    {col:0, row:-1},
    {col:-1, row:-1},
    {col:-1, row:0},
    {col:0, row:1}
  ];

  static directions_odd = [
    {col:1, row:1},
    {col:1, row:0},
    {col:0, row:-1},
    {col:-1, row:0},
    {col:-1, row:1},
    {col:0, row:1}
  ];

  // from article, double coord neighbors... not correct!
  // static directions = [
  //   {col:1, row:1},
  //   {col:1, row:-1},
  //   {col:0, row:-2},
  //   {col:-1, row:-1},
  //   {col:-1, row:1},
  //   {col:0, row:2}
  // ];
  //
  // static directions = [
  //   {col:1, row:0},
  //   {col:1, row:-1},
  //   {col:0, row:-1},
  //   {col:-1, row:0},
  //   {col:-1, row:1},
  //   {col:0, row:1}
  // ];

  // TODO update the originalMAP object to include weight as int.
  setup() {
    let tempGrid = [];
    for (var x = 0; x < this.gridIn.length; x++) {
      tempGrid[x] = [];

      for (var y = 0, row = this.gridIn[x]; y < row.length; y++) {
        let sourceNode = this.gridIn[x][y];
        if (sourceNode === null) {
          tempGrid[x][y] = null;
        } else {
          tempGrid[x][y] = sourceNode;
          this.nodes.push(sourceNode);
        }
      }
    }
    this.grid = tempGrid;

    this.cleanNodes();
  }

  cleanNodes() {
    for (var i = 0; i < this.nodes.length; i++) {
      this.cleanNode(this.nodes[i]);
    }
  }

  cleanDirty() {
    for (var i = 0; i < this.dirtyNodes.length; i++) {
      this.cleanNode(this.dirtyNodes[i]);
    }
    this.dirtyNodes = [];
    // this.set('dirtyNodes', []);
  }

  markDirty(node) {
    this.dirtyNodes.push(node);
  }

  // static doubleheight_neighbor(hex, direction) {
  //   let dir = this.doubleheight_directions[direction]
  //   return DoubledCoordinates({col:hex.col + dir.col, row:hex.col + dir.col});
  // }

  // with double coords, directions change based on column modulus 2
  getDirections(col) {
      return (col % 2 === 0) ? Graph.directions_even : Graph.directions_odd;
  }

  neighbors(node) {
    let neighbors = [];

    let currentCol = node.col;
    let currentRow = node.row;

    let directions = this.getDirections(currentCol);

    for (let i = 0; i < 6; i++) {
      let directionsCol = directions[i].col;
      let directionsRow = directions[i].row;

      let neighbor = this.getNeighborByColAndRow(
        currentCol + directionsCol,
        currentRow + directionsRow
      )

      neighbors.push(neighbor);

    }
    return neighbors;
  }

  // gets hexModel
  getNeighborByColAndRow(col, row) {
    if (!this.grid) {
      return null;
    }
    if (row < 0 || col < 0) {
      // console.log('row < 0 || col < 0', row, col);
      return null;
    }
    if (row >= this.grid.length) {
      // console.log('row >= this.grid.length', row, col, this.grid.length);
      return null;
    }
    if (col > this.grid[row].length) {
      // console.log('col > this.grid[row].length', row, col, this.grid[row].length);
      return null;
    }

    return this.grid[row][col];
  }

  cleanNode(node) {
    // node.path = node.path || {}
    // node.path.f = node.path.f || 0;
    // node.path.g = node.path.g || 0;
    // node.path.h = node.path.h || 0;
    // node.path.visited = false;
    // node.path.closed = false;
    // node.path.parent = null;

    node.pathFullScore =  0;
    node.pathScore = 0;
    node.heuristicDistance = 0;
    // node.pathFullScore = node.pathFullScore || 0;
    // node.pathScore = node.pathScore || 0;
    // node.heuristicDistance = node.heuristicDistance || 0;
    node.pathVisited = false;
    node.pathClosed = false;
    node.pathParent = null;

    // node.fovX = null;
    // node.fovY = null;
    // node.visual = node.visual || {}
    node.visual = {}
  }
}
