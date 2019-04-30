import Service from '@ember/service';
import {inject as service} from '@ember/service';

export default class FieldOfViewService extends Service {
  @service ('map') mapService;
  @service ('gameboard') gameboard;
  @service ('transport') transport;
  @service ('camera') camera;
  @service ('path') pathService;
  @service ('game') game;

  updatePlayerFieldOfView() {
    let player = this.game.player;

    // recursive
    let neighborsInRangeArray = [];
    this.mapService.getNeighborHexesInRange(1, player.sightRange, player.hex, neighborsInRangeArray);
    this.clean(player.hex, neighborsInRangeArray);

    let finalFovHexes = this.buildFieldOfVisionVisibleAndBlockedHexes(neighborsInRangeArray, player.hex);
// console.log('finalFovHexes', finalFovHexes);

    this.updateGameboardTilesOpacity(finalFovHexes);
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
      blocked: []
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

    return finalFovHexes;
  }

  updateGameboardTilesOpacity(finalFovHexes) {
    let visibleIds = finalFovHexes.visible.map(function(h){
      return h.id;
    })

    let gameLayer = this.camera.getGameLayer();
    let visibleHexeImages = gameLayer.getChildren((node) => {
      return visibleIds.includes(node.id());
    });

    visibleHexeImages.forEach(tile => {
      tile.to({opacity: 1});
    });

    gameLayer.draw();
  }
}
