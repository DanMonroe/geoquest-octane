import Service from '@ember/service';
import { Hex } from '../objects/hex';
import { DoubledCoordinates } from '../objects/doubled-coordinates'

export default class HexService extends Service {

  q = null;
  r = null;
  s = null;
  col = null;
  row = null;

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

  createHexesFromMap (map) {
    let hexes = [];
    let rows = map.length;
    let cols = map[0].length;

    // The first object in the map arry will be the start
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
          map: mapObject
        });
        // if (mapObject.id === 26) {
        //   debugger
        // }
        // hexes.push(new Hex({
        //   id: mapObject.id,
        //   col: mapObject.col,
        //   row: mapObject.row,
        //   q: mapObject.q,
        //   r: mapObject.r,
        //   s: mapObject.s,
        //   map: mapObject
        // }));
        // console.log(mapObject.id);
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
