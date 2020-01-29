import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import {assert} from '@ember/debug';
import {reads} from '@ember/object/computed';
import {timeout} from 'ember-concurrency';
import {task} from 'ember-concurrency-decorators';

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
    DEBUG: "debug",
    FOV: "fov",
    HEXINFO: "hexinfo",
    SCROLLREC: "scrollrec",
    // FOV: 4,
    AGENTS: "agents",
    PLAYER: "player"
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
  @service constants;

  /**
   * x and y: The current position of the background map.
   * In this implementation, we are assuming that (x,y)
   * points to the top left corner of visible portion of the map.
   */
  // @tracked x = 0;
  // @tracked y = 0;
  // @tracked mapOffsetX = -8;
  // @tracked mapOffsetY = -35;
  @tracked mapOffsetX;
  @tracked mapOffsetY;

  // camera viewport
  // viewport = null;

  // camera stage
  @tracked stage = null;
  @tracked miniMapStage = null;

  // @tracked stageScale = 100;
  // @tracked stageScale = 50;
  @tracked stageScale = 75;

  /**
   * width and height: The size of the camera's viewport.
   *
   */
  @tracked stageWidth = 0;              // Is used?
  @tracked stageHeight = 0;             // Is used?
  @reads('stage.attrs.width') viewportWidth;
  @reads('stage.attrs.height') viewportHeight;

  @tracked scrollContainerWidth = 0;
  @tracked scrollContainerHeight = 0;

  @tracked worldX = 0;
  @tracked worldY = 0;


  @tracked backgroundImageObj;

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

  get maxNumberOfVisibleHexesX() {
    if (this.scrollContainerWidth && this.mapService.currentLayout) {
      // debugger;
      const numHexPairs = Math.floor(this.scrollContainerWidth / this.mapService.currentLayout.hexPairWidth);
      const remainderWidth = this.scrollContainerWidth % this.mapService.currentLayout.hexPairWidth
      const numHexes = (numHexPairs * 2) + Math.floor(remainderWidth / this.mapService.currentLayout.hexWidth);
      // console.log('getMaxNumberOfVisibleHexesX  this.scrollContainerWidth/hexPairWidth/hexWidth/numHexPairs/numHexes', this.scrollContainerWidth, this.mapService.currentLayout.hexPairWidth, this.mapService.currentLayout.hexWidth, numHexPairs, numHexes);
      return numHexes;
    }
    return 0;
  }

  get maxNumberOfVisibleHexesY() {
    if (this.scrollContainerHeight && this.mapService.currentLayout) {
      // debugger;
      const hexHeight = this.mapService.currentLayout.hexHeight;
      const numHexes = Math.floor(this.scrollContainerHeight / hexHeight);
      // console.log('getMaxNumberOfVisibleHexesY  this.scrollContainerHeight/hexHeight/numHexes', this.scrollContainerHeight, hexHeight, numHexes);
      return numHexes;
    }
    return 0;
  }

  // TODO do we need worldX / worldY set?  if not, delete this method
  initCamera() {
    assert("Must set currentLayout and worldMap", this.mapService.currentLayout && this.mapService.worldMap);

    // debugger;
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

  // @tracked bottomSightRangeBoundary;
  // @tracked topSightRangeBoundary;
  // @tracked leftSightRangeBoundary;
  // @tracked rightSightRangeBoundary;

  get bottomSightRangeBoundary() {
    // console.log('bottomSightRangeBoundary',this.scrollContainerHeight - this.mapService.playerVerticalSightRange - this.mapOffsetY);
    // console.log('bottomSightRangeBoundary', this.scrollContainerHeight - this.mapService.playerVerticalSightRange - this.mapOffsetY,
    //   `${this.scrollContainerHeight} - ${this.mapService.playerVerticalSightRange} - ${this.mapOffsetY}`);
    const height = ( this.worldY && this.worldY < this.scrollContainerHeight) ? this.worldY : this.scrollContainerHeight;

    return height - this.mapService.playerVerticalSightRange - this.mapOffsetY;
    // return this.scrollContainerHeight - this.mapService.playerVerticalSightRange - this.mapOffsetY;
  }

  get topSightRangeBoundary() {
    // console.log('topSightRangeBoundary', this.mapService.playerVerticalSightRange - this.mapOffsetY,
    //   `${this.mapService.playerVerticalSightRange} - ${this.mapOffsetY}`);
    return this.mapService.playerVerticalSightRange - this.mapOffsetY;
  }

  get leftSightRangeBoundary() {
    return this.mapService.playerHorizontalSightRange - this.mapOffsetX;
  }

  get rightSightRangeBoundary() {
    const width = ( this.worldX && this.worldX < this.scrollContainerWidth) ? this.worldX : this.scrollContainerWidth;
    return width - this.mapService.playerHorizontalSightRange - this.mapOffsetX;
    // return this.scrollContainerWidth - this.mapService.playerHorizontalSightRange - this.mapOffsetX;
  }

  hexIsInsideSightRangeBoundary(targetHex) {
    console.log(targetHex.point);
    console.log(`
bottom  ${targetHex.point.y} <= ${this.bottomSightRangeBoundary} (scrollContainerHeight ${this.scrollContainerHeight} - verticalSightRange ${this.mapService.playerVerticalSightRange} - mapOffsetY ${this.mapOffsetY}),
top     ${targetHex.point.y} >= ${this.topSightRangeBoundary} (verticalSightRange ${this.mapService.playerVerticalSightRange} - mapOffsetY ${this.mapOffsetY}),
left    ${targetHex.point.x} >= ${this.leftSightRangeBoundary} (horizontalSightRange ${this.mapService.playerHorizontalSightRange} - mapOffsetX ${this.mapOffsetX}),
righ    ${targetHex.point.x} <= ${this.rightSightRangeBoundary} (scrollContainerWidth ${this.scrollContainerWidth} - horizontalSightRange ${this.mapService.playerHorizontalSightRange} - mapOffsetX ${this.mapOffsetX})

    `);
    return (
      targetHex.point.y <= this.bottomSightRangeBoundary &&
      targetHex.point.y >= this.topSightRangeBoundary &&
      targetHex.point.x >= this.leftSightRangeBoundary &&
      targetHex.point.x <= this.rightSightRangeBoundary
    );
  }

  adjustMapOffset(adjustmentPoint) {
    this.mapOffsetX -= adjustmentPoint.x;
    this.mapOffsetY -= adjustmentPoint.y;
    console.log('                    adjustMapOffset adjustmentPoint', adjustmentPoint, this.mapOffsetX, this.mapOffsetY);
  }
  // setSightRangeBoundaries() {
  //   // since this.game.camera.backgroundImageObj uses functions to get x() and y() then this can't be tracked
  //   // call this whenever the player moves outside the Boundary (when the map scrolls)
  //   // map offset y = this.game.camera.backgroundImageObj.y()
  //   // map offset x = this.game.camera.backgroundImageObj.x()
  //   if (this.backgroundImageObj) {
  //     this.bottomSightRangeBoundary = this.scrollContainerHeight - (this.mapService.playerVerticalSightRange - this.mapOffsetY);
  //     this.topSightRangeBoundary = this.mapService.playerVerticalSightRange - this.mapOffsetY;
  //     this.leftSightRangeBoundary = this.mapService.playerHorizontalSightRange - this.mapOffsetX;
  //     this.rightSightRangeBoundary = this.scrollContainerWidth - (this.mapService.playerHorizontalSightRange - this.mapOffsetX);
  //   }
  // }

  get stageScaleDisplay() {
    // console.log(this.stageScale);
    if (this.stage) {
      const newScale = this.stageScale/100;
      // console.log('newScale', newScale);
      this.stage.setScale({
        x: newScale,
        y: newScale
      });
      this.stage.batchDraw();
    }
    return this.stageScale;
  }

  @task
  *scaleStageBy(inc) {
    let speed = 400;
    while (true) {
      this.incrementProperty('stageScale', inc);
      yield timeout(speed);
      speed = Math.max(50, speed * 0.8);
    }
  }

  getGameLayer() {
    return this.stage.getLayers()[this.LAYERS.GAME];
  }
  getHexLayer() {
    return this.stage.getLayers()[this.LAYERS.GAME];
  }
  getBackgroundMapLayer() {
    return this.stage.getLayers()[this.LAYERS.BACKGROUNDMAP];
  }
  getDebugLayer() {
    return this.stage.getLayers()[this.LAYERS.GAME];
    // return this.stage.getLayers()[this.LAYERS.DEBUG];
  }
  getFOVLayer() {
    return this.stage.getLayers()[this.LAYERS.GAME];
    // return this.stage.getLayers()[this.LAYERS.FOV];
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
    return this.getGameLayer().find(`#${this.GROUPS.BACKGROUNDMAP}`);
    // return this.getBackgroundMapLayer().find(`#${this.GROUPS.BACKGROUNDMAP}`);
  }
  getDebugLayerGroup() {
    let group = this.getDebugLayer().find(`#${this.GROUPS.DEBUG}`);
    if (group.length) {
      return group[0];
    }
    return group;
  }
  getScrollRecGroup() {
    let group = this.getDebugLayer().find(`#${this.GROUPS.SCROLLREC}`);
    if (group.length) {
      return group[0];
    }
    return group;

  }

  getHexInfoGroup() {
    let group = this.getDebugLayer().find(`#${this.GROUPS.HEXINFO}`);
    if (group.length) {
      return group[0];
    }
    return group;
  }
  getFOVLayerGroup() {
    let group = this.getFOVLayer().find(`#${this.GROUPS.FOV}`);
    if (group.length) {
      return group[0];
    }
    return group;
  }

  getAgentGroup(agentType) {
    let player, agent;
    switch (agentType) {
      case this.constants.AGENTTYPES.PLAYER:
        player = this.getAgentsLayer().findOne(`.${this.GROUPS.PLAYER}`);
        return player;
        // return this.getAgentsLayer().find(`#${this.GROUPS.PLAYER}`);
      case this.constants.AGENTTYPES.ENEMY:
      case this.constants.AGENTTYPES.TRANSPORT:
        agent = this.getAgentsLayer().findOne(`.${this.GROUPS.AGENTS}`);
        return agent;
        // return this.getAgentsLayer().find(`#${this.GROUPS.AGENTS}`);
      default:
    }

    return null;
  }

  getPlayerGroup() {
    return this.getAgentGroup(this.constants.AGENTTYPES.PLAYER);
  }

  getTransportsGroup() {
    return this.getAgentGroup(this.constants.AGENTTYPES.TRANSPORT);
  }

  getEnemiesGroup() {
    return this.getAgentGroup(this.constants.AGENTTYPES.ENEMY);
  }

  // getMiniMapLayer() {
  //   return this.miniMapStage.getLayers()[this.LAYERS.MINIMAP];
  // }


}
