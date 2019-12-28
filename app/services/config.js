import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class ConfigService extends Service {
  @service camera;
  @service game;

  toggleDebugGroup() {
    this.game.showDebugLayer = !this.game.showDebugLayer;
    let debugGroup = this.camera.getDebugLayerGroup();
    debugGroup.visible(this.game.showDebugLayer);
    this.camera.stage.batchDraw();
  }

  togglePathFindingDebug() {
    this.game.gameboard.clearFOVLayer();
    this.game.gameboard.clearDebugLayer();

    this.game.pathFindingDebug = !this.game.pathFindingDebug;
  }


}
