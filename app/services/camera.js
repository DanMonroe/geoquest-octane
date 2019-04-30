import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import {assert} from '@ember/debug';
import { task, timeout } from 'ember-concurrency';

export default class CameraService extends Service {

  LAYERS = {
    GAME: 0,
    HEX: 1,
    DEBUG: 2,
    FOV: 3,
    AGENTS: 4,
  };

  @service ('map') mapService;
  @service ('gameboard') gameboard;  // remove this ?

  /**
   * x and y: The current position of the camera.
   * In this implementation, we are assuming that (x,y)
   * points to the top left corner of visible portion of the map.
   */
  @tracked x = 0;
  @tracked y = 0;

  // camera viewport
  // viewport = null;

  // camera stage
  @tracked stage = null;

  /**
   * width and height: The size of the camera's viewport.
   *
   */
  @tracked stageWidth = 0;
  @tracked stageHeight = 0;


  /**
   * maxX and maxY: The limit for the camera's position
   * — The lower limit will nearly always be (0,0),
   *  and in this case the upper limit is equal to the
   *  size of the world minus the size of the camera's viewport.
   */
  get maxX() {
    let maxX = this.worldX - this.viewportWidth;
    return maxX;
  }

  get maxY() {
    let maxY = this.worldY - this.viewportHeight;
    return maxY;
  }

  // TODO do we need worldX / worldY set?  if not, delete this method
  initCamera() {
    assert("Must set currentLayout and worldMap", this.mapService.currentLayout && this.mapService.worldMap);

    let hexWidth = this.mapService.currentLayout.hexWidth;
    let hexHeight = this.mapService.currentLayout.hexHeight;

    let mapRows = this.mapService.worldMap.length
    let mapColumns = this.mapService.worldMap[0].length

    let worldX = 0;
    if ((mapColumns % 2) === 1) {   // odd rows
      worldX = (((mapColumns+1) / 2) * (hexWidth * 1.5)) - (hexWidth * .75);
    } else { // even
      worldX = (mapColumns / 2) * (hexWidth * 1.5);
    }

    this.set('worldX', worldX);

    let worldY = Math.round((mapRows * hexHeight) + (hexHeight / 2));
    this.set('worldY', worldY);

  }

  getGameLayer() {
    return this.stage.getLayers()[this.LAYERS.GAME];
  }
  getHexLayer() {
    return this.stage.getLayers()[this.LAYERS.HEX];
  }
  getDebugLayer() {
    return this.stage.getLayers()[this.LAYERS.DEBUG];
  }
  getFOVLayer() {
    return this.stage.getLayers()[this.LAYERS.FOV];
  }
  getAgentsLayer() {
    return this.stage.getLayers()[this.LAYERS.AGENTS];
  }


}
