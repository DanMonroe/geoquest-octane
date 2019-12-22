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
// console.log('constructor of layout class', args);
    this.orientation = args.orientation;
    this.size = args.size;
    this.origin = args.origin;

    this.hexWidth = Math.round(this.orientation.type === 'flat' ?
      2 * this.size.x :
      Math.sqrt(3) * this.size.x);

    this.hexHeight = Math.round(this.orientation.type === 'flat' ?
      Math.sqrt(3) * this.size.y :
      2 * this.size.y);

    this.hexPairWidth = Math.round(this.hexWidth * 1.5);
    this.halfHexWidth = Math.round(this.hexWidth * .5);
    this.hexHorizontalSpacing = Math.round(this.hexWidth * .75);
    this.hexVerticalSpacing = this.hexHeight;

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

  hexToPixel(hex) {
    if(this.orientation.type === 'flat') {
      let M = this.orientation;
      let size = this.size;
      let origin = this.origin;
      let x = (M.f0 * hex.q + M.f1 * hex.r) * size.x;
      let y = (M.f2 * hex.q + M.f3 * hex.r) * size.y;
      return new Point({x:x + origin.x, y:y + origin.y});
    } else {
      // oddr_offset_to_pixel
      let size = this.size;
      let x = size.x * Math.sqrt(3) * (hex.col + (0.5 * (hex.row & 1)));
      let y = size.x * (3 / 2) * hex.row;
      return new Point({x: x, y: y});
    }
  }

  oddr_offset_to_pixel(hex) {
    let size = this.size;
    let x = size.x * Math.sqrt(3) * (hex.col + (0.5 * (hex.row & 1)));
    let y = size.x * (3 / 2) * hex.row;
    return new Point({x: x, y: y});
  }

  evenq_offset_to_pixel(hex) {
    let size = this.size;
    let x = size.x * 3 / 2 * hex.q;
    let y = size.y * Math.sqrt(3) * (hex.r - 0.5 * (hex.q));
    return new Point({x: x, y: y});
  }

  pointy_hex_to_pixel(hex) {
    let size = this.size;
    var x = size.x * (Math.sqrt(3) * hex.q + (Math.sqrt(3) / 2) * hex.r);
    var y = size.y * ((3 / 2) * hex.r)
    return new Point({x: x, y: y});
  }

  pixelToHex(p) {
    let size = this.size;
    let origin = this.origin;
    let point = new Point({x: (p.x - origin.x) / size.x, y: (p.y - origin.y) / size.y});

    if(this.orientation.type === 'flat') {
      let M = this.orientation;
      let q = M.b0 * point.x + M.b1 * point.y;
      let r = M.b2 * point.x + M.b3 * point.y;

      // console.log('pixelToHex', q, r, M.b1, M.b2, M.b3, p);

      // var q2 = ( 2./3 * pt.x                        ) / size.x
      // var r2 = (-1./3 * pt.x  + Math.sqrt(3)/3 * pt.y) / size.y
      // console.log('pixelToHex', q, q2, r, r2);

      return new Hex({q: q, r: r, s: -q - r});
    } else {
      // var q = h.col - (h.row + offset * (h.row & 1)) / 2;
      // var r = h.row;
      // var s = -q - r;
      // return new Hex(q, r, s);

      // var col = cube.x + (cube.z - (cube.z&1)) / 2
      // var row = cube.z
      // return OffsetCoord(col, row)

      // let pt = new Point({x: (p.x - origin.x) / size.x, y: (p.y - origin.y) / size.y});

      var q = (Math.sqrt(3)/3 * point.x  -  1/3 * point.y) / size.x
      var r = (                        2/3 * point.y) / size.y
      // return hex_round(Hex(q, r))
      return new Hex({q: q, r: r, s: -q - r});
    }
  }

  // xyObj should be a json obj {x:xcoord, y:ycoord }
  pixelToHexCoordinate(xyObj) {
    let size = this.size;
    let origin = this.origin;
    let point = new Point({x: (xyObj.x - origin.x) / size.x, y: (xyObj.y - origin.y) / size.y});

    if(this.orientation.type === 'flat') {
      let M = this.orientation;
      let q = M.b0 * point.x + M.b1 * point.y;
      let r = M.b2 * point.x + M.b3 * point.y;

      return this.roundHexCoordinates({q: q, r: r, s: -q - r});
    } else {
      const q = (Math.sqrt(3)/3 * point.x  -  1/3 * point.y) / size.x
      const r = (2/3 * point.y) / size.y
      // return hex_round(Hex(q, r))
      // return {q: q, r: r, s: -q - r};
      return this.roundHexCoordinates({q: q, r: r, s: -q - r});
    }
  }

  // QRScoords = {q: q, r: r, s: s}
  roundHexCoordinates(QRScoords) {
    let qi = Math.round(QRScoords.q);
    let ri = Math.round(QRScoords.r);
    let si = Math.round(QRScoords.s);
    let q_diff = Math.abs(qi - QRScoords.q);
    let r_diff = Math.abs(ri - QRScoords.r);
    let s_diff = Math.abs(si - QRScoords.s);
    if (q_diff > r_diff && q_diff > s_diff) {
      qi = -ri - si;
    }
    else if (r_diff > s_diff) {
      ri = -qi - si;
    }
    else {
      si = -qi - ri;
    }
    return {q:qi, r:ri, s:si};
  }

  hexCornerOffset(corner) {
    let M = this.orientation;
    let size = this.size;
    let angle = 2.0 * Math.PI * (M.start_angle - corner) / 6.0;

    return new Point({x:size.x * Math.cos(angle), y:size.y * Math.sin(angle)});
  }

  polygonCorners(hex) {
    let corners = [];
    // let center = this.oddr_offset_to_pixel(hex);
    debugger;
    let center = hex.point;
    // let center = this.hexToPixel(hex);

    // console.log('hex', hex);
    // console.log('center', center);

    for (let i = 0; i < 6; i++) {
      let offset = this.hexCornerOffset(i);
// console.log(offset);
      corners.push(new Point({x:center.x + offset.x, y:center.y + offset.y}));
    }
    return corners;
  }
}
