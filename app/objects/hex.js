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
  map = null;

  constructor() {
    this.id = arguments[0].id;
    this.q = arguments[0].q;
    this.r = arguments[0].r;
    this.s = arguments[0].s;
    this.map = arguments[0].map;

    assert('q + r + s must be 0', Math.round(this.q + this.r + this.s) === 0);
  }
}
