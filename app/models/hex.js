import Model, {attr, belongsTo, hasMany } from '@ember-data/model';
import {computed} from '@ember/object';
import {reads} from '@ember/object/computed';

export default class HexModel extends Model {
  @attr col;
  @attr row;
  @attr({ defaultValue: 0 }) travelFlags;
  @attr({ defaultValue: 0 }) sightFlags;
  @attr({ defaultValue: 0 }) specialFlags; // isDock, etc

  @attr({ defaultValue: 0 }) pathWeight;
  @attr pathFullScore;
  @attr pathScore;
  @attr heuristicDistance;
  @attr pathVisited;
  @attr pathClosed;
  @attr pathParent;
  @attr({ defaultValue: {} }) visual;

  @reads('col') q;

  @computed('col','row')
  get r() {
    return -(Math.floor(this.col / 2)) + this.row;
  }

  @computed('q','r')
  get s() {
    return -this.q - this.r;
  }

  @hasMany('tile') tiles;

  @belongsTo('hex-row') hexRow;

  // @attr hexRow;
  // @belongsTo('hex-row') hexRow;
}
