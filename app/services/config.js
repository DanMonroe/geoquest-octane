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

  toggleFieldOfView() {
    // this.game.gameboard.clearFOVLayer();
    // this.game.gameboard.clearDebugLayer();
    this.game.showFieldOfViewLayer = !this.game.showFieldOfViewLayer;
    console.log('toggleFieldOfView', this.game.showFieldOfViewLayer);
    // const fovGroup = this.camera.getFOVLayerGroup();
    // fovGroup.visible(this.game.showFieldOfViewLayer);

    if (this.game.showFieldOfViewLayer) {
      this.game.fov.setAllHexesVisibility(false);
      this.game.fov.updatePlayerFieldOfView();
    } else {
      this.game.fov.setAllHexesVisibility(true);
    }

    this.camera.stage.batchDraw();
  }

  reportAndResetPerformance() {
    console.log(performance.getEntriesByType("measure"));
    performance.clearMarks();
    performance.clearMeasures();
  }

}
