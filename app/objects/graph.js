export class Graph {
  grid = [];
  gridIn = null;
  nodes = [];
  dirtyNodes = [];

  constructor(args) {
    this.gridIn = args.gridIn;
    // this.y = arguments[0].y;
  }

  static directions = [
    {col:1, row:0},
    {col:1, row:-1},
    {col:0, row:-1},
    {col:-1, row:0},
    {col:-1, row:1},
    {col:0, row:1}
  ];

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
          // let localProps = {
          //   x:x,
          //   y:y,
          //   weight:0
          // };
          // let assignedNode = assign(localProps, tempGrid[x][y]);
          // var node = GridNode.create(assignedNode);
          // var node = GridNode.create(tempGrid[x][y]);

          // weight:row[y] !== null ? row[y].weight : 0
          // tempGrid[x][y] = node;
          tempGrid[x][y] = sourceNode;
          this.nodes.push(sourceNode);
        }
        // var node = GridNode.create({
        //   x:x,
        //   y:y,
        //   weight:0
        // });
        //   // weight:row[y] !== null ? row[y].weight : 0
        // tempGrid[x][y] = node;
        // this.nodes.push(node);
      }
    }
    this.grid = tempGrid;

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

  neighbors(node) {
    let neighbors = [];

    // could be node or hex
    // let currentCol = currentHex.col || currentHex.map.col;
    // let currentRow = currentHex.row || currentHex.map.row;
    let currentCol = node.col;
    let currentRow = node.row;

    for (let i = 0; i < 6; i++) {
      let directionsCol = Graph.directions[i].col;
      let directionsRow = Graph.directions[i].row;

      let neighbor = this.getNeighborByColAndRow(
        currentCol + directionsCol,
        currentRow + directionsRow
      )

      neighbors.push(neighbor);

      // let gridNode = GridNode.create(neighbor);

      // neighbors.push(gridNode);
    }

    // console.log('neighbors', neighbors);

    return neighbors;
  }

  getNeighborByColAndRow(col, row) {
    if (!this.grid) {
      return null;
    }
    if (row < 0 || col < 0) {
      return null;
    }
    if (row >= this.grid.length) {
      return null;
    }
    if (col > this.grid[row].length) {
      return null;
    }

    return this.grid[row][col];
  }

  cleanNode(node) {
    node.path.f = 0;
    node.path.g = 0;
    node.path.h = 0;
    node.path.visited = false;
    node.path.closed = false;
    node.path.parent = null;
  }
}
