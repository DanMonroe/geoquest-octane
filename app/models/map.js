import Model, {attr, hasMany } from '@ember-data/model';
import {computed} from '@ember/object';
import {reads} from '@ember/object/computed';

export default class MapModel extends Model {

  @attr name;
  @attr backgroundImage;
  @attr backgroundImageWidth;
  @attr backgroundImageHeight;
  @attr({ defaultValue: 0 }) backgroundOffsetX;
  @attr({ defaultValue: 0 }) backgroundOffsetY;
  @attr({ defaultValue: "flat" }) layoutType;
  // @attr({ defaultValue: 36 }) layoutHexSizeX;
  // @attr({ defaultValue: 41 }) layoutHexSizeY;

  @attr layout;
  @reads('layout.size.x') layoutHexSizeX;
  @reads('layout.size.y') layoutHexSizeY;

  @hasMany('hex-row') hexRows;

  get backgroundFinalWidth() {
    return this.backgroundImageWidth + this.backgroundOffsetX;
  }

  get backgroundFinalHeight() {
    return this.backgroundImageHeight + this.backgroundOffsetY;
  }

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

  @computed('hexRows.[]')
  get allHexes() {
    let allHexes = [];
    this.hexRows.forEach(hexRow => {
      hexRow.get('hexes').forEach(hex => {
        allHexes.push(hex);
      });
    });

    return allHexes;
  }
}
