import { BaseAgentModel } from './base-agent';
import { Point } from '../objects/point'

export default class PlayerModel extends BaseAgentModel {

  fire(targetHex) {
  // fire(mousecoords) {
    console.log('Player Fire!');

    if (!this.weapons || this.weapons.length === 0) {
      console.log('no weapons');
      return;
    }

    let weapon = this.weapons.firstObject;
    // let weapon = this.weapons[0];
    if (!this.agent.canFireWeapon(this, weapon.poweruse)) {
      console.log('no power!');
      return
    }

    if (this.agent.fireWeapon.isRunning) {
      console.log('waiting to reload');
      return;
    }

    let startPoint = this.point;
    // let targetPoint = new Point({x:mousecoords.x, y:mousecoords.y}); // harder to aim
    let targetPoint = targetHex.point;

    this.agent.fireWeapon.perform(this, weapon, startPoint, targetPoint);
  }
}
