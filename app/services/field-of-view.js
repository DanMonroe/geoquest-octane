import Service from '@ember/service';
import {inject as service} from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class FieldOfViewService extends Service {
  @service ('map') mapService;
  @service ('gameboard') gameboard;
  @service ('transport') transport;
  @service ('camera') camera;
  @service ('path') pathService;
  @service ('game') game;

  @tracked lastNeighborsInRangeArray = null;

  updatePlayerFieldOfView() {
    let player = this.game.player;

    // recursive
    let neighborsInRangeArray = [];
    this.mapService.getNeighborHexesInRange(1, player.sightRange, player.hex, neighborsInRangeArray);
    this.clean(player.hex, neighborsInRangeArray);

    let finalFovHexes = this.buildFieldOfVisionVisibleAndBlockedHexes(neighborsInRangeArray, player.hex);
// console.log('finalFovHexes', finalFovHexes);

    this.updateGameboardTilesOpacity(finalFovHexes);
    this.updateStaticEnemyOpacity(finalFovHexes);
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
    // these are hexes that were visible last time player moved but now are out of range;
    if (this.lastNeighborsInRangeArray) {
      finalFovHexes.noLongerVisible = this.lastNeighborsInRangeArray.filter((hex) => {
        // debugger;
        return !finalFovHexes.visible.includes(hex);
      });
    }

    this.lastNeighborsInRangeArray = finalFovHexes.visible;


    return finalFovHexes;
  }

  updateStaticEnemyOpacity(finalFovHexes) {
    // get all enemies that are in finalFovHexes.visible
    // then set opacity to 1
    // get all enemies that are in finalFovHexes.noLongerVisible
    // then set opacity to 0

    let agentsLayer = this.camera.getAgentsLayer();

    this.transport.agents.forEach((transportAgent) => {
      // console.log('transportAgent.name', transportAgent.name, transportAgent.imageGroup.attrs.opacity);
      if(transportAgent.imageGroup.attrs.opacity === 0){

        // make visible
        this.setStaticEnemyOpacity(transportAgent, finalFovHexes.visible, 1);
        // if (transportAgent.hex && finalFovHexes.visible.includes(transportAgent.hex)) {
        //   // debugger;
        //   let visibleAgentImages = agentsLayer.getChildren((node) => {
        //     // console.log('node', node, node.id, transportAgent.id);
        //     return `agent${transportAgent.id}` === node.name();
        //   });
        //   visibleAgentImages.forEach(agentImageGroup => {
        //     agentImageGroup.to({opacity: 1});
        //   });
        // }
      } else {
        // make non visible
        this.setStaticEnemyOpacity(transportAgent, finalFovHexes.noLongerVisible, 0);
        // if (transportAgent.hex && finalFovHexes.noLongerVisible.includes(transportAgent.hex)) {
        //   // debugger;
        //   let visibleAgentImages = agentsLayer.getChildren((node) => {
        //     // console.log('node', node, node.id, transportAgent.id);
        //     return `agent${transportAgent.id}` === node.name();
        //   });
        //   visibleAgentImages.forEach(agentImageGroup => {
        //     agentImageGroup.to({opacity: 0});
        //   });
        // }

      }
    });

    agentsLayer.draw();
  }

  // hexesToCheck visible or noLongerVisible
  setStaticEnemyOpacity(transportAgent, hexesToCheck, opacityToSet) {
    let agentsLayer = this.camera.getAgentsLayer()
    if (transportAgent.hex && hexesToCheck.includes(transportAgent.hex)) {
      let visibleAgentImages = agentsLayer.getChildren((node) => {
        return `agent${transportAgent.id}` === node.name();
      });
      visibleAgentImages.forEach(agentImageGroup => {
        agentImageGroup.to({opacity: opacityToSet});
      });
    }
  }

  updateGameboardTilesOpacity(finalFovHexes) {
    let visibleIds = finalFovHexes.visible.map(function(h){
      return h.id;
    })

    let gameLayer = this.camera.getGameLayer();

    let visibleHexImages = gameLayer.getChildren((node) => {
      return visibleIds.includes(node.id());
    });

    visibleHexImages.forEach(tile => {
      tile.to({opacity: 1});
    });

    // No longer visible
    let noLongerVisibleIds = finalFovHexes.noLongerVisible.map(function(h){
      return h.id;
    })
    let noLongerVisibleHexImages = gameLayer.getChildren((node) => {
      return noLongerVisibleIds.includes(node.id());
    });
    // remove any hex that is in visible hexes
    noLongerVisibleHexImages = noLongerVisibleHexImages.filter((node) => {
      return !visibleHexImages.includes(node);
    });

    noLongerVisibleHexImages.forEach(tile => {
      tile.to({opacity: .4});
    });

    gameLayer.draw();
  }
}
