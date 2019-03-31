import { BaseAgent } from './base-agent';
import { htmlSafe } from '@ember/string';

export class Enemy extends BaseAgent {

  constructor() {
    super(...arguments);
    this.type = BaseAgent.AGENTTYPES.ENEMY;
  }

  get style() {
    if (this.hexLayout && this.hex) {
      let point = this.hexLayout.hexToPixel(this.hex);
      let newx = this.mapCenterX + parseFloat(point.x - 21);   // - 30
      let newy = this.mapCenterY + parseFloat(point.y - 21);  // - 30

      return htmlSafe(`top: ${newy}px; left: ${newx}px;`);
    }
    return htmlSafe('display: none;');
  }
}

