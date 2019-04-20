import { tracked } from '@glimmer/tracking';
import { Point } from '../point'

export class BaseAgent {
  // @tracked hexLayout = null;
  // @tracked hex = null;

  static AGENTTYPES = {
    PLAYER: 0,
    ENEMY: 1,
    TRANSPORT: 2
  };

  type = null;

  @tracked hex = null;

  get point() {
    if (this.mapService && this.mapService.currentLayout) {
      return this.mapService.currentLayout.hexToPixel(this.hex);
    }
    return new Point({x: 0, y: 0});
  }
  agentImage = null;
  sightRange = 1;
  speed = null;
  patrol = null;
  currentWaypoint = -1;

  @tracked maxHitPoints;
  @tracked currentHitPoints;

  @tracked mapService = null;
  @tracked camera = null;
  @tracked game = null;
  @tracked transportService;
  @tracked gameboard;

  @tracked travelAbilityFlags = 0;

  get healthPercentage() {
    if (!this.currentHitPoints || this.currentHitPoints <= 0) {
      return 0;
    }

    let healthPercentage = Math.round((this.currentHitPoints / this.maxHitPoints) * 100);

    return Math.min(healthPercentage, 100);
  }

  updateHealthBar() {
    let bar = this.imageGroup.getChildren((node) =>{
      return node.attrs && node.attrs.id === 'hp';
    });
    if (bar) {
      // console.log('this.healthPercentage', this.healthPercentage);
      bar.width( 30 * (this.healthPercentage/100) );
      bar.fill(this.healthPercentage < 25 ? 'red' : 'green')
      this.camera.getAgentsLayer().draw();
    }
  }
}
