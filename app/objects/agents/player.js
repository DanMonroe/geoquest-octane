import { BaseAgent } from './base-agent';
import { htmlSafe } from '@ember/string';

export class Player extends BaseAgent {

  static transportHexIndex = 0;

  constructor() {
    super(...arguments);
    this.type = BaseAgent.AGENTTYPES.PLAYER;
  }

  get style() {
    if (this.hexLayout && this.hex) {

      let agentsHexOnMap = this.mapService.findHexByQRS(this.hex.q, this.hex.r, this.hex.s);
      let point = this.hexLayout.hexToPixel(agentsHexOnMap);
      let newx = parseFloat(point.x + this.camera.x + 4);   // - 30
      let newy = parseFloat(point.y + this.camera.y + 4);  // - 30
      // let newx = parseFloat(point.x + this.mapService.currentLayout.halfHexWidth + this.camera.x);   // - 30
      // let newy = parseFloat(point.y + this.mapService.currentLayout.halfHexWidth + this.camera.y);  // - 30

      return htmlSafe(`top: ${newy}px; left: ${newx}px;`);
    }
    return htmlSafe('display: none;');
  }

}

