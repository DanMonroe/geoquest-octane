import Model, {attr, belongsTo, hasMany } from '@ember-data/model';

export default class HexModel extends Model {
  @attr col;
  @attr row;
  @attr({ defaultValue: 0 }) travelFlags;
  @attr({ defaultValue: 0 }) sightFlags;
  @attr({ defaultValue: 0 }) specialFlags; // isDock, etc

  @hasMany('tile') tiles;

  @belongsTo('hex-row') hexRow;

  // @attr hexRow;
  // @belongsTo('hex-row') hexRow;
}
