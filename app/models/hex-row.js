import Model, {belongsTo, hasMany } from '@ember-data/model';

export default class HexRowModel extends Model {

  @belongsTo('map') map;

  @hasMany('hex', {async: true}) hexes;
}
