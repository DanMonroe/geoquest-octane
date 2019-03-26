import Service from '@ember/service';
import { Hex } from '../objects/hex';
import {assert} from '@ember/debug';


export default class HexService extends Service {

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
}
