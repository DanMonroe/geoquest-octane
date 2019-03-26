import { Point } from './point';

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

  constructor() {
    this.orientation = arguments[0].orientation;
    this.size = arguments[0].size;
    this.origin = arguments[0].origin;
  }

  hexToPixel(h) {
    let M = this.orientation;
    let size = this.size;
    let origin = this.origin;
    let x = (M.f0 * h.q + M.f1 * h.r) * size.x;
    let y = (M.f2 * h.q + M.f3 * h.r) * size.y;
    return new Point({x:x + origin.x, y:y + origin.y});
  }

  pixelToHex(p) {
    let M = this.orientation;
    let size = this.size;
    let origin = this.origin;
    let pt = new Point({x:(p.x - origin.x) / size.x, y:(p.y - origin.y) / size.y});
    let q = M.b0 * pt.x + M.b1 * pt.y;
    let r = M.b2 * pt.x + M.b3 * pt.y;
    return new Point({q:q, r:r, s:-q - r});
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
      corners.push(new Point({x:center.x + offset.x, y:center.y + offset.y}));
    }
    return corners;
  }
}
