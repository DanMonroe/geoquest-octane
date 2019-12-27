import Model, {attr, hasMany} from '@ember-data/model';

export default class TransportModel extends Model {
  @attr name;
  @attr type;
  @attr opacity;
  @attr startHex;
  @attr agentImage;
  @attr agentImageSize;
  @attr siteRange;
  @attr opacity;
  @attr armor;
  @attr maxPower;
  @attr respawnTime;
  @attr healingSpeed;
  @attr healingPower;
  @attr agentImage;
  @attr agentImageSize;
  @attr sightRange;
  @attr speed;
  @attr patrol;
  @attr currentWaypoint;
  @attr state;
  @attr maxHitPoints;
  @attr currentHitPoints;
  @attr currentPower;
  @attr({ defaultValue: 0 }) travelFlags;
  @attr({ defaultValue: 0 }) sightFlags;
  // @attr initialFlags;

  @hasMany('weapon', {async: true}) weapons;
}
