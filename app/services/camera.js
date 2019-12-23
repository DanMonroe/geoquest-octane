import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import {assert} from '@ember/debug';
import {reads} from '@ember/object/computed';
// import { task, timeout } from 'ember-concurrency';

export default class CameraService extends Service {

  LAYERS = {
    GAME: 0,
    // BACKGROUNDMAP: 1,
    // HEX: 2,
    // DEBUG: 3,
    // FOV: 4,
    AGENTS: 1,
    MINIMAP: 0
  };
  GROUPS = {
    // GAME: 0,
    BACKGROUNDMAP: "map",
    HEX: "hex",
    DEBUG: "debug"
    // FOV: 4,
    // AGENTS: "agents",
    // MINIMAP: 0

  }
  // LAYERS = {
  //   GAME: 0,
  //   BACKGROUNDMAP: 1,
  //   HEX: 2,
  //   DEBUG: 3,
  //   FOV: 4,
  //   AGENTS: 5,
  //   MINIMAP: 0
  // };

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
  @tracked miniMapStage = null;

  /**
   * width and height: The size of the camera's viewport.
   *
   */
  @tracked stageWidth = 0;              // Is used?
  @tracked stageHeight = 0;             // Is used?
  @reads('stage.width') viewportWidth;  // Is used?
  @reads('stage.height') viewportHeight;// Is used?

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
    return this.stage.getLayers()[this.LAYERS.GAME];
    // return this.stage.getLayers()[this.LAYERS.HEX];
  }
  getBackgroundMapLayer() {
    return this.stage.getLayers()[this.LAYERS.BACKGROUNDMAP];
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
  getMiniMapLayer() {
    return this.miniMapStage.getLayers()[this.LAYERS.MINIMAP];
  }

  // getGameLayerGroup() {
  //   return this.getGameLayer().find("#");
  // }
  getHexLayerGroup() {
    return this.getHexLayer().find(`#${this.GROUPS.HEX}`);
  }
  getBackgroundMapLayerGroup() {
    return this.getBackgroundMapLayer().find(`#${this.GROUPS.BACKGROUNDMAP}`);
  }
  getDebugLayerGroup() {
    return this.getDebugLayer().find(`#${this.GROUPS.DEBUG}`);
  }
  // getFOVLayer() {
  //   return this.stage.getLayers()[this.LAYERS.FOV];
  // }
  // getAgentsLayer() {
  //   return this.stage.getLayers()[this.LAYERS.AGENTS];
  // }
  // getMiniMapLayer() {
  //   return this.miniMapStage.getLayers()[this.LAYERS.MINIMAP];
  // }


}
