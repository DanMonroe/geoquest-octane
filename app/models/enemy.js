import DS from 'ember-data';
const { attr, Model } = DS;

export default class EnemyModel extends Model {
  @attr() name;
  @attr() type;
  @attr() hex;
  @attr() startHex;
  @attr() armor;
  @attr() respawnTime;
  @attr() patrolMethod;
  @attr() maxPower;
  @attr() healingSpeed;
  @attr() healingPower;
  @attr() agentImage;
  @attr() agentImageSize;
  @attr() sightRange;
  @attr() speed;
  @attr() pursuitSpeed;
  @attr() aggressionSpeed;
  @attr() patrol;
  @attr() currentWaypoint;
  @attr() state;
  @attr() maxHitPoints;
  @attr() currentHitPoints;
  @attr() currentPower;
  @attr() initialFlags;
  @attr() weapons;

}
