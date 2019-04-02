import Service from '@ember/service';
import { Hex } from '../objects/hex';
import {assert} from '@ember/debug';
import { DoubledCoordinates } from '../objects/doubled-coordinates'

export default class HexService extends Service {

  q = null;
  q = null;
  q = null;
  col = null;
  row = null;

  hasSameCoordinates(aHex, bHex) {
    return (aHex.q === bHex.q &&
      aHex.r === bHex.r &&
      aHex.s === bHex.s);
  }

  createHexesFromMap(map) {
    assert('Map array MUST be odd lengths to have a hexagonal shape.',(map.length % 2 === 1) && (map[0].length % 2 === 1));

    let hexes = [];
    let size = ((map.length -1) / 2);

    for (let q_column = -size; q_column <= size; q_column++) {

      let r1 = Math.max(-size, -q_column-size);
      let r2 = Math.min(size, -q_column+size);

      for (let row = r1; row <= r2; row++) {

        let mapObject = map[row+size][q_column+size];
        mapObject.q = q_column;
        mapObject.r = row;
        mapObject.s = -q_column-row;

        // console.log(row+size, q_column+size, mapObject);

        hexes.push(new Hex({
          id:mapObject.id,
          q:q_column,
          r:row,
          s:-q_column-row,
          map:mapObject
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
    let index = 0;
    for (let col = minCol; col <= maxCol; col++) {
      for (let row = minRow + (col & 1); row <= maxRow; row += 2, index++) {
        let hex = new DoubledCoordinates({col:col, row:row}).qdoubledToCube();
        hex.col = col;
        hex.row = row;

        hex.map = {id:index, t:1};

        results.push(hex);
      }
    }
    return results;
  }
}
