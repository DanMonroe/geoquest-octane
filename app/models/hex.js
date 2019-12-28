import Model, {attr, belongsTo, hasMany } from '@ember-data/model';
import {computed} from '@ember/object';
import {reads} from '@ember/object/computed';
import { Point } from '../objects/point'

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
  @attr layout;
  @attr({ defaultValue: {} }) visual;

  @reads('col') q;
  @reads('layout.orientation') layoutOrientation;
  @reads('layout.size') layoutSize;
  @reads('layout.origin') layoutOrigin;

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

  @computed('layoutOrientation.{type,f0,f1,f2,f3}','layoutSize.{x,y}','q','r','col','row','layoutOrigin.{x,y}')
  get point() {
    if(this.layoutOrientation.type === 'flat') {
      let x = (this.layoutOrientation.f0 * this.q + this.layoutOrientation.f1 * this.r) * this.layoutSize.x;
      let y = (this.layoutOrientation.f2 * this.q + this.layoutOrientation.f3 * this.r) * this.layoutSize.y;
      return new Point({x:x + this.layoutOrigin.x, y:y + this.layoutOrigin.y});
    } else {
      // oddr_offset_to_pixel
      let x = this.layoutSize.x * Math.sqrt(3) * (this.col + (0.5 * (this.row & 1)));
      let y = this.layoutSize.x * (3 / 2) * this.row;
      return new Point({x: x, y: y});
    }
  }

  @computed('layoutOrientation.type', 'layoutSize.x')
  get hexWidth() {
    const hexWidth = Math.round(this.layoutOrientation.type === 'flat' ?
      2 * this.layoutSize.x : Math.sqrt(3) * this.layoutSize.x);
    return hexWidth;
  }

  @computed('layoutOrientation.type', 'layoutSize.y')
  get hexHeight() {
    const hexHeight = Math.round(this.layoutOrientation.type === 'flat' ?
      Math.sqrt(3) * this.layoutSize.y : 2 * this.layoutSize.y);
    return hexHeight;
  }

  get polygonCorners() {

    let corners = [];

    const center = this.point;

    for (let i = 0; i < 6; i++) {
      // let offset = this.hexCornerOffset(i);
      const angle = 2.0 * Math.PI * (this.layoutOrientation.start_angle - i) / 6.0;

      let offset = {
        x: this.layoutSize.x * Math.cos(angle),
        y: this.layoutSize.y * Math.sin(angle)
      }

      corners.push(new Point({x:center.x + offset.x, y:center.y + offset.y}));
    }
    return corners;
  }

}
