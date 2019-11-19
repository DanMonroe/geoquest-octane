import Model, {attr, hasMany} from '@ember-data/model';

export default class PlayerModel extends Model {
  @attr() name;
  @attr() type; // ?
  @attr() opacity;
  @attr() startHex;
  @attr() armor;
  @attr() maxPower;
  @attr() healingSpeed;
  @attr() healingPower;
  @attr() agentImage;
  @attr() agentImageSize;
  @attr() sightRange;
  @attr() speed;
  @attr() patrol;
  @attr() currentWaypoint;
  @attr() state;
  @attr() maxHitPoints;
  @attr() currentHitPoints;
  @attr() currentPower;
  @attr() initialFlags;

  @hasMany('weapon', {async: false}) weapons;

}
