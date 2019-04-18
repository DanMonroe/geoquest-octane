import { tracked } from '@glimmer/tracking';

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
  point = null;
  agentImage = null;
  sightRange = 1;
  speed = null;
  patrol = null;
  currentWaypoint = -1;
  @tracked mapService = null;
  @tracked camera = null;
  @tracked game = null;
  @tracked transportService;

  @tracked travelAbilityFlags = 0;
}
