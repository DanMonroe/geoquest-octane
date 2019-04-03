import Service from '@ember/service';
import { Hex } from '../objects/hex';
import { DoubledCoordinates } from '../objects/doubled-coordinates'

export default class HexService extends Service {

  q = null;
  q = null;
  q = null;
  col = null;
  row = null;

  hasSameCoordinates (aHex, bHex) {
    return (aHex.q === bHex.q &&
      aHex.r === bHex.r &&
      aHex.s === bHex.s);
  }

  createHexesFromMap (map) {
    let hexes = [];
    let rows = map.length;
    let cols = map[0].length;

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {

        let mapObject = map[row][col];

        let q = col;
        let r = -(Math.floor(col/2)) + row;
        let s = -q-r;

        mapObject.q = q;
        mapObject.r = r;
        mapObject.s = s;

        hexes.push(new Hex({
          id: mapObject.id,
          col: col,
          row: (row*2) + (col&1),
          q: q,
          r: r,
          s: s,
          map: mapObject
        }));
      }
    }
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
