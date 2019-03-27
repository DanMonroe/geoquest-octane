// import { BaseTransport } from './base-transport';
// import { tracked } from '@glimmer/tracking';
// // import { computed } from '@ember/object';
// import { htmlSafe } from '@ember/string';
//
// export class Ship extends BaseTransport {
//   id = null;
//   @tracked point;
//   @tracked mapCenterX;
//   @tracked mapCenterY;
//   @tracked hex;
//   @tracked hexLayout;
//
//   constructor() {
//     super(...arguments);
//
//     this.id = arguments[0].id;
//     this.mapCenterX = arguments[0].mapCenterX;
//     this.mapCenterY = arguments[0].mapCenterY;
//     this.hex = arguments[0].hex;
//     this.hexLayout = arguments[0].hexLayout;
//     this.point = arguments[0].point;
//   }
//
//   customstyle() {
//     debugger;
//
//     if (this.hexLayout && this.hex) {
//
//       let point = this.hexLayout.hexToPixel(this.hex);
// // console.log('ship:', this.mapCenterX, this.mapCenterY, this.hex, point);
//       let newx = this.mapCenterX + parseFloat(point.x - 5);   // - 30
//       let newy = this.mapCenterY + parseFloat(point.y + 7);  // - 30
//
//       return htmlSafe(`top: ${newy}px; left: ${newx}px;`);
//       // return htmlSafe(`top: ${newy}px; left: ${newx}px;`);
//     }
//     return htmlSafe('display: none;');
//   }
// }

import EmberObject, { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default EmberObject.extend({
  name: 'Ship',

  style: computed('mapCenterX', 'mapCenterY', 'hex', 'hexLayout', function() {
    // debugger;
    if (this.hexLayout && this.hex) {

      let point = this.hexLayout.hexToPixel(this.hex);
      let newx = this.mapCenterX + parseFloat(point.x - 21);   // - 30
      let newy = this.mapCenterY + parseFloat(point.y - 21);  // - 30
// console.log('ship:', this.mapCenterX, this.mapCenterY, this.hex, point, newx, newy);

      return htmlSafe(`top: ${newy}px; left: ${newx}px;`);
    }
    return htmlSafe('display: none;');
  })

});
