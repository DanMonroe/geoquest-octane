import Model, {attr, hasMany } from '@ember-data/model';
import {computed} from '@ember/object';

export default class MapModel extends Model {

  @attr name;
  @attr({ defaultValue: "flat" }) layoutType;
  @attr({ defaultValue: 24 }) layoutHexSize;

  @hasMany('hex-row') hexRows;

  @computed('hexRows.[]')
  get tileImages() {
    let tileSet = new Set();
    this.hexRows.forEach(hexRow => {
      hexRow.get('hexes').forEach(hex => {
        hex.get('tiles').forEach(tile => {
          if (!tileSet.has(tile.get('name'))) {
            tileSet.add(tile.get('name'));
          }
        });
      });
    });
    return [...tileSet];
  }

  @computed('hexRows.[]')
  get hexGrid() {
    let hexGrid = [];
    this.hexRows.forEach(hexRow => {
      let row = [];
      hexRow.get('hexes').forEach(hex => {
        row.push(hex);
      });
      hexGrid.push(row);
    });

    return hexGrid;
  }
}
