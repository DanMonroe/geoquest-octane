import DS from 'ember-data';
const { attr, Model } = DS;

export default class WeaponModel extends Model {
  @attr() name;
  @attr('number', { defaultValue: 10 }) minDistanceForHit;
  @attr() maxRange;
  @attr() type;
  @attr() sound;
  @attr() damage;
  @attr() speed;
  @attr() poweruse;
  @attr() accuracy;
  @attr() fireDelay;
  @attr() reloadDelay;
}
