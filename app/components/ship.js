import Component from '@ember/component';
import move from 'ember-animated/motions/move';
// import { htmlSafe } from '@ember/string';
// import { computed } from '@ember/object';

export default Component.extend({
  hex: null,
  point: null,
  shipImage: null,
  hexLayout: null,
  mapCenterX: 0,
  mapCenterY: 0,
  siteRange: 1,
  speed: null,
  patrol: null,
  currentWaypoint: -1,

  transition: function * ({ keptSprites }) {
    keptSprites.forEach(move);
  },

//   style: computed('mapCenterX', 'mapCenterY', 'hex', 'hexLayout', function() {
//     debugger;
//     if (this.hexLayout && this.hex) {
//
//       let point = this.hexLayout.hexToPixel(this.hex);
// // console.log('ship:', this.mapCenterX, this.mapCenterY, this.hex, point);
//       let newx = this.mapCenterX + parseFloat(point.x - 5);   // - 30
//       let newy = this.mapCenterY + parseFloat(point.y + 7);  // - 30
//
//       return htmlSafe(`top: ${newy}px; left: ${newx}px;`);
//     }
//     return htmlSafe('display: none;');
//   })
//


});

// import Component from '@glimmer/component';
// import move from 'ember-animated/motions/move';
// import { tracked } from '@glimmer/tracking';
// import { htmlSafe } from '@ember/string';
// import { computed } from '@ember/object';
//
// export default class ShipComponent extends Component {
//
//   @tracked ships = null;
//   @tracked hexLayout = null;
//   @tracked hex = null;
//   @tracked q = null;
//   @tracked r = null;
//   @tracked s = null;
//   @tracked point = null;
//   @tracked mapCenterX = 0;
//   @tracked mapCenterX = 0;
//   @tracked shipImage = "images/ship.svg";
//
//   constructor() {
//     super(...arguments);
//
//     this.ships= arguments[1].ships;
//     this.hexLayout=arguments[1].hexLayout;
//     this.q=arguments[1].q;
//     this.r=arguments[1].r;
//     this.s=arguments[1].s;
//     this.hex=arguments[1].hex;
//     this.point=arguments[1].point;
//     this.mapCenterX=arguments[1].mapCenterX;
//     this.mapCenterY=arguments[1].mapCenterY;
//
//     console.log(this);
//   }
//
//   transition = function * ({ keptSprites }) {
//     keptSprites.forEach(move);
//   }
//
//     style: computed('mapCenterX', 'mapCenterY', 'hex', 'hexLayout', function() {
//     if (this.hexLayout && this.hex) {
//
//       let point = this.hexLayout.hexToPixel(this.hex);
// // console.log('ship:', this.mapCenterX, this.mapCenterY, this.hex, point);
//       let newx = this.mapCenterX + parseFloat(point.x - 5);   // - 30
//       let newy = this.mapCenterY + parseFloat(point.y + 7);  // - 30
//
//       return htmlSafe(`top: ${newy}px; left: ${newx}px;`);
//     }
//     return htmlSafe('display: none;');
//   })
//
//
//   style() {
//     // debugger;
//     // console.log('customstyle');
//     // console.log(this.mapCenterX);
//     // console.log(this.hex);
//     // console.log(this.point);
//     // console.log(this.point.x);
//     if (this.hexLayout && this.hex) {
//
//       let point = this.hexLayout.hexToPixel(this.hex);
// // console.log('ship:', this.mapCenterX, this.mapCenterY, this.hex, point);
//       let newx = this.mapCenterX + parseFloat(point.x - 5);   // - 30
//       let newy = this.mapCenterY + parseFloat(point.y + 7);  // - 30
//
//       // return htmlSafe(`top: ${newy}px; left: ${newx}px;`);
//     }
//     return htmlSafe('display: none;');
//   }
// }
