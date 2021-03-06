import Service from '@ember/service';
import { Hex } from '../objects/hex';
import { DoubledCoordinates } from '../objects/doubled-coordinates'

export default class HexService extends Service {

  // TODO  Some of this code is a duplicate of code in Graph
  // i.e, directions

  // roweven: row modification when current col is even
  // rowodd: row modification when current col is odd
  DIRECTIONS = [
    {dir:'SE', q:1, r:0, s:-1,col:1,roweven:0,rowodd:1},
    {dir:'NE', q:1, r:-1,s: 0,col:1,roweven:-1,rowodd:0},
    {dir:'N', q:0, r:-1,s: 1,col:0,roweven:-1,rowodd:-1},
    {dir:'NW', q:-1,r: 0,s: 1,col:-1,roweven:-1,rowodd:0},
    {dir:'SW', q:-1,r: 1,s: 0,col:-1,roweven:0,rowodd:1},
    {dir:'S', q:0, r:1, s:-1,col:0,roweven:1,rowodd:1}
  ];

  q = null;
  r = null;
  s = null;
  col = null;
  row = null;

  getDirection(direction) {
    switch(direction) {
      case 'SE':
        return this.DIRECTIONS[0];
      case 'NE':
        return this.DIRECTIONS[1];
      case 'N':
        return this.DIRECTIONS[2];
      case 'NW':
        return this.DIRECTIONS[3];
      case 'SW':
        return this.DIRECTIONS[4];
      case 'S':
        return this.DIRECTIONS[5];
      default:
        return null;
    }
  }

  hasSameCoordinates (aHex, bHex) {
    return (aHex.q === bHex.q &&
      aHex.r === bHex.r &&
      aHex.s === bHex.s);
  }

  // returns true if the array of given hexes includes the target hex by QRS
  arrayOfHexesIncludesHex (sourceHexes, targetHex) {
    let filteredHexes = sourceHexes.filter((hex) => {
      return this.hasSameCoordinates(hex, targetHex);
    });
    return filteredHexes.length > 0;
  }

  // TODO 12/21/19 if removing Hex object, then don't need this map
  createHexesFromMap (map) {
    let hexes = [];
    let rows = map.length;
    let cols = map[0].length;

    // The first object in the map array will be the start
    // get the q,r,s from the map object
    // q,r,s MUST be previously set. (in gameboard.setupQRSFromMap)

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {

        let mapObject = map[row][col];

        hexes[mapObject.id-1] = new Hex({
          id: mapObject.id,
          col: mapObject.col,
          row: mapObject.row,
          q: mapObject.q,
          r: mapObject.r,
          s: mapObject.s,
          map: mapObject,
          props: mapObject.props || {},
          mapObject: mapObject
        });
      }
    }
    // console.log(hexes);
    return hexes;
  }


  permuteQRS(q, r, s) { return new Hex({q:q, r:r, s:s}); }
  permuteSRQ(q, r, s) { return new Hex({q:s, r:r, s:q}); }
  permuteSQR(q, r, s) { return new Hex({q:s, r:q, s:r}); }
  permuteRQS(q, r, s) { return new Hex({q:r, r:q, s:s}); }
  permuteRSQ(q, r, s) { return new Hex({q:r, r:s, s:q}); }
  permuteQSR(q, r, s) { return new Hex({q:q, r:s, s:r}); }

  makeQDoubledRectangularShape(minCol, maxCol, minRow, maxRow) {
    let results = [];
    let index = 1;
    for (let col = minCol; col <= maxCol; col++) {
      for (let row = minRow + (col & 1); row <= maxRow; row += 2, index++) {
        let hex = new DoubledCoordinates({col:col, row:row}).qdoubledToCube();
        hex.col = col;
        hex.row = row;
        hex.id = index;

        hex.map = {id:index, t:1};

        results.push(hex);
      }
    }
    return results;
  }
}
