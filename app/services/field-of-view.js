import Service from '@ember/service';
import {inject as service} from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class FieldOfViewService extends Service {
  @service ('map') mapService;
  @service gameboard;
  @service transport;
  @service camera;
  @service config;
  @service ('path') pathService;
  @service ('game') game;

  @tracked lastNeighborsInRangeArray = {};

  updatePlayerFieldOfView() {
// performance.mark("updatePlayerFieldOfView Start");

    let player = this.game.player;

    // recursive
    let neighborsInRangeArray = [];
    this.mapService.getNeighborHexesInRange(1, player.sightRange, player.hex, neighborsInRangeArray);
    this.clean(player.hex, neighborsInRangeArray);

    let finalFovHexes = this.buildFieldOfVisionVisibleAndBlockedHexes(neighborsInRangeArray, player.hex);

    this.mapService.updateSeenHexes(finalFovHexes);
    this.updateGameboardTilesOpacity(finalFovHexes);
    this.updateStaticEnemyOpacity(finalFovHexes);
// performance.mark("updatePlayerFieldOfView End");
// performance.measure("measure updatePlayerFieldOfView Start to updatePlayerFieldOfView End", "updatePlayerFieldOfView Start", "updatePlayerFieldOfView End");

    // this.config.reportAndResetPerformance();
  }

  clean(originHex, neighborsInRangeArray) {
    for (let n = 0, nLength = neighborsInRangeArray.length; n < nLength; n++) {
      let thisHex = neighborsInRangeArray[n];
      thisHex.visual = thisHex.visual || {};
      thisHex.fovChecked = false;
      thisHex.visual.canSee = false;
      thisHex.fovDistance = this.pathService.heuristics.hex(originHex, neighborsInRangeArray[n]); // set distance
    }
  }

  buildFieldOfVisionVisibleAndBlockedHexes(neighborsInRangeArray, playerHex) {
    // sort by distance
    let sortedByDistanceNeighbors = neighborsInRangeArray.sortBy('fovDistance').reverseObjects();

    let finalFovHexes = {
      visible: [playerHex],
      blocked: [],
      noLongerVisible: [] // hexes that used to be visible, now out of range
    }

    // set fov properties, build visible, blocked arrays
    for (let n = 0, nLength = sortedByDistanceNeighbors.length; n < nLength; n++) {
      let thisHex = sortedByDistanceNeighbors[n];

      if (!thisHex.fovChecked) {

        let returnFieldOfViewHexes = this.gameboard.isFieldOfViewBlockedForHex(playerHex, thisHex, sortedByDistanceNeighbors);
        let numVisibleHexes = returnFieldOfViewHexes.visible.length;
        let numBlockedHexes = returnFieldOfViewHexes.blocked.length;

        for (let i = 0; i < numVisibleHexes; i++) {
          returnFieldOfViewHexes.visible[i].visual.canSee = true;
          returnFieldOfViewHexes.visible[i].fovChecked = true;
          if (!finalFovHexes.visible.includes(returnFieldOfViewHexes.visible[i])) {
            finalFovHexes.visible.push(returnFieldOfViewHexes.visible[i]);
          }
        }

        for (let i = 0; i < numBlockedHexes; i++) {
          returnFieldOfViewHexes.blocked[i].visual.canSee = false;
          returnFieldOfViewHexes.blocked[i].fovChecked = true;
          if (!finalFovHexes.blocked.includes(returnFieldOfViewHexes.blocked[i])) {
            finalFovHexes.blocked.push(returnFieldOfViewHexes.blocked[i]);
          }
        }
      }
    }

    // create a list of hexes to set opacity to .5
    // these are hexes for this mapId that were visible last time player moved but now are out of range;
    if (this.lastNeighborsInRangeArray && this.lastNeighborsInRangeArray[`${this.mapService.mapIndex}`]) {
      finalFovHexes.noLongerVisible = this.lastNeighborsInRangeArray[`${this.mapService.mapIndex}`].filter((hex) => {
        return !finalFovHexes.visible.includes(hex);
      });
    }

    // if (!this.lastNeighborsInRangeArray) {
    //   this.lastNeighborsInRangeArray = [];
    // }
    this.lastNeighborsInRangeArray[`${this.mapService.mapIndex}`] = finalFovHexes.visible;
    // this.lastNeighborsInRangeArray = finalFovHexes.visible;


    return finalFovHexes;
  }

  updateStaticEnemyOpacity(finalFovHexes) {
    // get all enemies that are in finalFovHexes.visible
    // then set opacity to 1
    // get all enemies that are in finalFovHexes.noLongerVisible
    // then set opacity to 0

    let agentsLayer = this.camera.getAgentsLayer();

    this.game.agents.forEach((transportAgent) => {
      // console.log('transportAgent.name', transportAgent.name, transportAgent.imageGroup.attrs.opacity);
      if(transportAgent.imageGroup.attrs.opacity === 0){
        // make visible
        this.setStaticEnemyOpacity(transportAgent, finalFovHexes.visible, true);
      } else {
        // make non visible
        this.setStaticEnemyOpacity(transportAgent, finalFovHexes.noLongerVisible, false);
      }
      this.checkPlayerInRangeForAgent(transportAgent);
    });

    agentsLayer.draw();
  }

  // hexesToCheck visible or noLongerVisible
  setStaticEnemyOpacity(transportAgent, hexesToCheck, isVisible) {
    // console.log('setStaticEnemyOpacity', transportAgent.id, transportAgent);
    if (transportAgent.hex && hexesToCheck.includes(transportAgent.hex)) {

      let agentsLayer = this.camera.getAgentsLayer()
      let visibleAgentImages = agentsLayer.getChildren((node) => {
        // console.log('node.name()',node.name());
        return `agent${transportAgent.id}` === node.name();
      });
      visibleAgentImages.forEach(agentImageGroup => {
        agentImageGroup.to({opacity: isVisible ? 1 : 0});
      });
    }
  }

  checkPlayerInRangeForAgent(agent) {
    // TODO This has to be moved to when the player moves and/or transport moves
    // TODO enemy sightRange will probably be less than player sight range so
    // TODO it will never call playerInRange here to engage

    // console.log(this.mapService.distanceInHexes(this.game.player.hex, agent.hex), agent.sightRange);

    if(this.mapService.distanceInHexes(this.game.player.hex, agent.hex) <= agent.sightRange) {
      agent.playerInRange(); // check range
    } else {
      agent.playerOutOfRange();
    }

  }

  // update both main and mini maps
  updateGameboardTilesOpacity(finalFovHexes) {
    this.updateGameboardTilesOpacityForLayer(finalFovHexes, this.camera.getGameLayer());
    // this.updateGameboardTilesOpacityForLayer(finalFovHexes, this.camera.getMiniMapLayer());
  }

  updateGameboardTilesOpacityForLayer(finalFovHexes, layer) {
    // console.log('layer', layer);
    const hexGroup = layer.find('#hex');
    // console.log('hexGroup',hexGroup);
    if (hexGroup.length > 0) {

      const hexes = hexGroup[0];
      // console.log('hexes',hexes);

      // console.log('finalFovHexes', finalFovHexes);
      let visibleIds = finalFovHexes.visible.map(function(h){
        return h.id;
      })

      let visibleHexImages = hexes.getChildren((node) => {
      // let visibleHexImages = layer.getChildren((node) => {
        return visibleIds.includes(node.id());
      });
  // console.log('visibleHexImages', visibleHexImages);
      visibleHexImages.forEach(tile => {
        // tile.to({opacity: 0});
        tile.to({
          stroke:  this.mapService.MAPFILLOPACITY.VISIBLE,
          fill: this.mapService.MAPFILLOPACITY.VISIBLE,
          duration : this.mapService.MAPFILLTWEENDURATION
        });
        // tile.to({fillA: this.mapService.MAPFILLOPACITY.VISIBLE});
        // tile.to({opacity: this.mapService.MAPOPACITY.VISIBLE});
      });

      // No longer visible
      let noLongerVisibleIds = finalFovHexes.noLongerVisible.map(function(h){
        return h.id;
      })
      let noLongerVisibleHexImages = hexes.getChildren((node) => {
      // let noLongerVisibleHexImages = layer.getChildren((node) => {
        return noLongerVisibleIds.includes(node.id());
      });
      // remove any hex that is in visible hexes
      noLongerVisibleHexImages = noLongerVisibleHexImages.filter((node) => {
        return !visibleHexImages.includes(node);
      });

      noLongerVisibleHexImages.forEach(tile => {
        tile.to({
          fill: this.mapService.MAPFILLOPACITY.PREVIOUSLYSEEN,
          duration : this.mapService.MAPFILLTWEENDURATION
        });
        // tile.to({fill: this.mapService.MAPFILLOPACITY.PREVIOUSLYSEEN});
        // tile.to({opacity: this.mapService.MAPOPACITY.PREVIOUSLYSEEN});
      });

      this.camera.stage.batchDraw();
      // layer.batchDraw();
    }

  }
}
