import {assert} from '@ember/debug';

export class Hex {

  static DIRECTIONS = [
    {dir:'SE', q:1, r:0, s:-1},
    {dir:'NE', q:1, r:-1,s: 0},
    {dir:'N', q:0, r:-1,s: 1},
    {dir:'NW', q:-1,r: 0,s: 1},
    {dir:'SW', q:-1,r: 1,s: 0},
    {dir:'S', q:0, r:1, s:-1}
  ];

  id = null;

  q = null;
  r = null;
  s = null;
  col = null;
  row = null;
  map = null;

  props = null;

  constructor(args) {
    // let {id, q, r, s, map} = args;
    this.id = args.id;
    this.q = args.q;
    this.r = args.r;
    this.s = args.s;
    this.col = args.col;
    this.row = args.row;
    this.map = args.map;
    this.props = args.props;

    assert('q + r + s must be 0', Math.round(this.q + this.r + this.s) === 0);
  }

  add(b) {
    return new Hex({q:this.q + b.q, r:this.r + b.r, s:this.s + b.s});
  }

  // subtract(b) {
  //   return new Hex({q:this.q - b.q, r:this.r - b.r, s:this.s - b.s});
  // },
  // scale(k) {
  //   return new Hex({q:this.q * k, r:this.r * k, s:this.s * k});
  // },
  // rotateLeft() {
  //   return new Hex({q:-this.s, r:-this.q, s:-this.r});
  // },
  // rotateRight() {
  //   return new Hex({q:-this.r, r:-this.s, s:-this.q });
  // },
  direction(direction) {
    console.warn('Does this need to update based on column because of double coordinates?')
    debugger;
    return Hex.DIRECTIONS[direction];
  }

  neighbor(direction) {
    return this.add(this.direction(direction));
  }

  // diagonalNeighbor(direction) {
  //   return this.add(this.diagonals[direction]);
  // },
  // len() {
  //   return (Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s)) / 2;
  // },
  // distance(b) {
  //   return this.subtract(b).len();
  // },
  round() {
    var qi = Math.round(this.q);
    var ri = Math.round(this.r);
    var si = Math.round(this.s);
    var q_diff = Math.abs(qi - this.q);
    var r_diff = Math.abs(ri - this.r);
    var s_diff = Math.abs(si - this.s);
    if (q_diff > r_diff && q_diff > s_diff) {
      qi = -ri - si;
    }
    else if (r_diff > s_diff) {
      ri = -qi - si;
    }
    else {
      si = -qi - ri;
    }
    return new Hex({q:qi, r:ri, s:si});
  }

  lerp(b, t) {
    return new Hex({q:this.q * (1.0 - t) + b.q * t, r:this.r * (1.0 - t) + b.r * t, s:this.s * (1.0 - t) + b.s * t});
  }

  linedraw(b) {
    var N = this.distance(b);
    var a_nudge = new Hex({q:this.q + 0.000001, r:this.r + 0.000001, s:this.s - 0.000002});
    var b_nudge = new Hex({q:b.q + 0.000001, r:b.r + 0.000001, s:b.s - 0.000002});
    var results = [];
    var step = 1.0 / Math.max(N, 1);
    for (var i = 0; i <= N; i++) {
      results.push(a_nudge.lerp(b_nudge, step * i).round());
    }
    return results;
  }
}
