import Component from '@glimmer/component';
import {action} from '@ember/object';
import {inject as service} from '@ember/service';

export default class ConfigDialogComponent extends Component {
  tagName = '';

  @service transport;
  @service ('game') game;
  @service gameboard;
  @service camera;
  @service sound;
  @service config;


  // TODO  not really used anymore  1/8/20
  @action
  toggleDebugLayer() {
    this.game.showDebugLayer = !this.game.showDebugLayer;
    this.gameboard.showDebugLayer = this.game.showDebugLayer;
    let debugGroup = this.camera.getDebugLayerGroup();
    if (debugGroup) {
      debugGroup.visible(this.game.showDebugLayer);
    }
    // let layer = this.camera.getDebugLayer();
    // layer.visible(this.game.showDebugLayer);

    this.game.showFieldOfViewLayer = !this.game.showFieldOfViewLayer;
    this.gameboard.showFieldOfViewLayer = this.game.showFieldOfViewLayer;
    // let fovlayer = this.camera.getFOVLayer();
    // fovlayer.visible(this.game.showFieldOfViewLayer);
    let fovGroup = this.camera.getFOVLayerGroup();
    if (fovGroup) {
      fovGroup.visible(this.game.showFieldOfViewLayer);
    }
  }

  // TODO  not really used anymore  1/8/20
  @action
  toggleTiles() {
    this.game.showTileGraphics = !this.game.showTileGraphics;
    let layer = this.camera.getGameLayer();
    layer.visible(this.game.showTileGraphics);
    // this.camera.stage.draw();
    layer.draw();
  }

  @action
  toggleGameSounds() {
    this.sound.soundEnabled = !this.sound.soundEnabled;
    if (!this.sound.soundEnabled) {
      // this.sound.audio.stopAll('sounds')  // throws because no sounds playing
    }
  }

  // TODO  not really used anymore  1/8/20
  @action
  toggleHexInfo() {
    this.config.toggleHexInfo();
  }

  // TODO  not really used anymore  1/8/20
  @action
  togglePathFindingDebug() {
    this.config.togglePathFindingDebug();
  }

  @action
  toggleMoveQueue() {
    this.transport.moveQueueEnabled = !this.transport.moveQueueEnabled;

    if (this.transport.moveQueueEnabled && this.transport.moveQueueTask.isIdle) {
      this.transport.moveQueueTask.perform();
    }
  }

  @action
  toggleGameClock() {
    this.game.gameClockEnabled = !this.game.gameClockEnabled;

    if (this.game.gameClockEnabled && this.game.gameClock.isIdle) {
      this.game.gameClock.perform();
    }
  }
}
