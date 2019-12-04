import Model, {attr, hasMany } from '@ember-data/model';

export default class MapModel extends Model {

  @attr name;
  @attr({ defaultValue: "flat" }) layoutType;
  @attr({ defaultValue: 24 }) layoutHexSize;

  @hasMany('hex-row') hexRows;
}
