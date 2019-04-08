import { Point } from './point';
import { Hex } from './hex';

export class Layout {

  static POINTY = {
      type:'pointy',
      f0:Math.sqrt(3.0),
      f1:Math.sqrt(3.0) / 2.0,
      f2:0.0,
      f3:3.0 / 2.0,
      b0:Math.sqrt(3.0) / 3.0,
      b1:-1.0 / 3.0,
      b2:0.0,
      b3:2.0 / 3.0,
      start_angle:0.5
    };

  static FLAT = {
      type:'flat',
      f0:3.0 / 2.0,
      f1:0.0,
      f2:Math.sqrt(3.0) / 2.0,
      f3:Math.sqrt(3.0),
      b0:2.0 / 3.0,
      b1:0.0,
      b2:-1.0 / 3.0,
      b3:Math.sqrt(3.0) / 3.0,
      start_angle:0.0
  };

  orientation = null;
  size = null;
  origin = null;
  _hexWidth = 0;
  _halfHexWidth = 0;
  _hexPairWidth = 0;
  _hexHeight = 0;

  constructor(args) {
    this.orientation = args.orientation;
    this.size = args.size;
    this.origin = args.origin;

    this.hexWidth = this.orientation.type === 'flat' ?
      2 * this.size.x :
      Math.sqrt(3) * this.size.x;

    this.hexHeight = this.orientation.type === 'flat' ?
      Math.sqrt(3) * this.size.y :
      2 * this.size.y;

    this.hexPairWidth = Math.round(this.hexWidth * 1.5);
    this.halfHexWidth = Math.round(this.hexWidth * .5);

  }

  get hexWidth() {
    return this._hexWidth;
  }

  set hexWidth(width) {
    this._hexWidth = width;
  }

  get halfHexWidth() {
    return this._halfHexWidth;
  }

  set halfHexWidth(width) {
    this._halfHexWidth = width;
  }

  get hexHeight() {
    return this._hexHeight;
  }

  set hexHeight(height) {
    this._hexHeight = height;
  }

  get hexPairWidth() {
    return this._hexPairWidth;
  }

  set hexPairWidth(width) {
    this._hexPairWidth = width;
  }

  hexToPixel(h) {
    let M = this.orientation;
    let size = this.size;
    let origin = this.origin;
    let x = (M.f0 * h.q + M.f1 * h.r) * size.x;
    let y = (M.f2 * h.q + M.f3 * h.r) * size.y;

    // console.log('hexToPixel', x, y, M.f0, M.f1, M.f2, M.f3, size);

    return new Point({x:x + origin.x, y:y + origin.y});
  }

  evenq_offset_to_pixel(hex) {
    let size = this.size;
    let x = size.x * 3 / 2 * hex.q;
    let y = size.y * Math.sqrt(3) * (hex.r - 0.5 * (hex.q));
    return new Point({x: x, y: y});
  }

  pixelToHex(p) {
    let M = this.orientation;
    let size = this.size;
    let origin = this.origin;
    let pt = new Point({x:(p.x - origin.x) / size.x, y:(p.y - origin.y) / size.y});
    let q = M.b0 * pt.x + M.b1 * pt.y;
    let r = M.b2 * pt.x + M.b3 * pt.y;

    // console.log('pixelToHex', q, r, M.b1, M.b2, M.b3, p);

    // var q2 = ( 2./3 * pt.x                        ) / size.x
    // var r2 = (-1./3 * pt.x  + Math.sqrt(3)/3 * pt.y) / size.y
    // console.log('pixelToHex', q, q2, r, r2);

    return new Hex({q:q, r:r, s:-q - r});
  }

  hexCornerOffset(corner) {
    let M = this.orientation;
    let size = this.size;
    let angle = 2.0 * Math.PI * (M.start_angle - corner) / 6.0;

    return new Point({x:size.x * Math.cos(angle), y:size.y * Math.sin(angle)});
  }

  polygonCorners(hex) {
    let corners = [];
    let center = this.hexToPixel(hex);
    for (let i = 0; i < 6; i++) {
      let offset = this.hexCornerOffset(i);
// console.log(offset);
      corners.push(new Point({x:center.x + offset.x, y:center.y + offset.y}));
    }
    return corners;
  }
}
