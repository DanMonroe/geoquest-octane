import { Point } from './point';
import { Hex } from './hex';
// import { DoubledCoordinates } from './doubled-coordinates';
// import {assert} from '@ember/debug';

//from https://www.redblobgames.com/grids/hexagons/#hex-to-pixel  - sources: lib.js


export class DoubledCoordinates {

  static DIRECTIONS = [
    {dir: 'SE', col: 1, row:1},
    {dir: 'NE', col: 1, row:-1},
    {dir: 'N',  col: 0, row:-2},
    {dir: 'NW', col: -1, row:-1},
    {dir: 'SW', col: -1, row:1},
    {dir: 'S',  col: 0, row:2},
  ];


  constructor(args) {
    this.col = args.col;
    this.row = args.row;

  }
  static qdoubledFromCube(h) {
    var col = h.q;
    var row = 2 * h.r + h.q;
    return new DoubledCoordinates({col:col, row:row});
  }

  static doubleheight_neighbor(hex, direction) {
    let dir = this.doubleheight_directions[direction]
    return DoubledCoordinates({col:hex.col + dir.col, row:hex.col + dir.col});
  }

  static doubleheight_distance(a, b) {
    let dx = Math.abs(a.col - b.col);
    let dy = Math.abs(a.row - b.row);
    return dx + Math.max(0, (dy-dx) / 2);
  }

  qdoubledToCube() {
    var q = this.col;
    var r = (this.row - this.col) / 2;
    var s = -q - r;
    return new Hex({q:q, r:r, s:s});
  }
  static rdoubledFromCube(h) {
    var col = 2 * h.q + h.r;
    var row = h.r;
    return new DoubledCoordinates({col:col, row:row});
  }
  rdoubledToCube() {
    var q = (this.col - this.row) / 2;
    var r = this.row;
    var s = -q - r;
    return new Hex({q:q, r:r, s:s});
  }



  doubleheight_to_cube(hex) {
    let x = hex.col
    let z = (hex.row - hex.col) / 2
    let y = -x-z
    // return (x, y, z)
    return new Hex({q:x, r:y, s:z});
  }

  cube_to_doubleheight(cube) {
    let col = cube.x
    let row = 2 * cube.z + cube.x
    // return DoubledCoord(col, row)
    return new Point({x:col, y:row});
  }

  doublewidth_to_cube(hex) {
    let x = (hex.col - hex.row) / 2
    let z = hex.row
    let y = -x-z
    // return Cube(x, y, z)
    return new Hex({q:x, r:y, s:z});
  }

  cube_to_doublewidth(cube) {
    let col = 2 * cube.x + cube.z
    let row = cube.z
    // return DoubledCoord(col, row)
    return new Point({x:col, y:row});
  }
}
