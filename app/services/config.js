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

  toggleScrollRectGroup() {
    this.game.showScrollRectangle = !this.game.showScrollRectangle;
    let scrollRectGroup = this.camera.getScrollRecGroup();
    scrollRectGroup.visible(this.game.showScrollRectangle);
    this.camera.stage.batchDraw();
  }

  toggleHexInfo() {
    this.game.showTileHexInfo = !this.game.showTileHexInfo;
    const tileHexInfoGroup = this.camera.getHexInfoGroup();
    tileHexInfoGroup.visible(this.game.showTileHexInfo);
    this.camera.stage.batchDraw();
  }

  togglePathFindingDebug() {
    this.game.gameboard.clearFOVLayer();
    this.game.gameboard.clearDebugLayer();

    this.game.pathFindingDebug = !this.game.pathFindingDebug;
  }

  reportAndResetPerformance() {
    console.log(performance.getEntriesByType("measure"));
    performance.clearMarks();
    performance.clearMeasures();
  }

}
