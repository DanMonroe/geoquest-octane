import Service from '@ember/service';
import {inject as service} from '@ember/service';

export default class FieldOfViewService extends Service {
  @service ('map') mapService;
  @service ('gameboard') gameboard;
  @service ('transport') transport;
  @service ('camera') camera;
  @service ('path') pathService;

  updatePlayerFieldOfView() {
    let player = this.transport.players.objectAt(0);
    // let start = performance.now();
    let neighborsInRangeArray = [];
    this.mapService.getNeighborHexesInRange(1, player.sightRange, player.hex, neighborsInRangeArray);
    // let getNeighborHexesInRangeTime = performance.now();
    // console.log('getNeighborHexesInRange time', getNeighborHexesInRangeTime -  start);

    // this.console.log(player.hex, neighborsInRangeArray);

    this.clean(player.hex, neighborsInRangeArray);

    let finalFovHexes = this.buildFieldOfVisionVisibleAndBlockedHexes(neighborsInRangeArray, player.hex);

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
    // console.log('sortedByDistanceNeighbors', sortedByDistanceNeighbors);

    let finalFovHexes = {
      visible: [playerHex],
      blocked: []
    }
    // set fov properties, build visible, blocked arrays
    for (let n = 0, nLength = sortedByDistanceNeighbors.length; n < nLength; n++) {
      let thisHex = sortedByDistanceNeighbors[n];
// console.log(thisHex.id, thisHex.fovChecked, thisHex);
      if (!thisHex.fovChecked) {

        // thisHex.fovChecked = true;

        let returnFieldOfViewHexes = this.gameboard.isFieldOfViewBlockedForHex(playerHex, thisHex, sortedByDistanceNeighbors);
// console.log('returnFieldOfViewHexes', returnFieldOfViewHexes);
        let numVisibleHexes = returnFieldOfViewHexes.visible.length;
        let numBlockedHexes = returnFieldOfViewHexes.blocked.length;
        for (let i = 0; i < numVisibleHexes; i++) {
          // console.log('  visible:', returnFieldOfViewHexes.visible[i].id);
          returnFieldOfViewHexes.visible[i].visual.canSee = true;
          returnFieldOfViewHexes.visible[i].fovChecked = true;
          if (!finalFovHexes.visible.includes(returnFieldOfViewHexes.visible[i])) {
            finalFovHexes.visible.push(returnFieldOfViewHexes.visible[i]);
          }
        }
        for (let i = 0; i < numBlockedHexes; i++) {
          // console.log('  blocked:', returnFieldOfViewHexes.blocked[i].id);
          returnFieldOfViewHexes.blocked[i].visual.canSee = false;
          returnFieldOfViewHexes.blocked[i].fovChecked = true;
          if (!finalFovHexes.blocked.includes(returnFieldOfViewHexes.blocked[i])) {
            finalFovHexes.blocked.push(returnFieldOfViewHexes.blocked[i]);
          }
        }
        // } else {
        //   console.log('already checked', thisHex.id, thisHex);
      }
    }
    // console.log('finalFovHexes', finalFovHexes.visible, finalFovHexes.blocked);

    return finalFovHexes;
  }

  updateGameboardTilesOpacity(finalFovHexes) {
    let visibleIds = finalFovHexes.visible.map(function(h){
      return h.id;
    })

    let gameLayer = this.camera.stage.getLayers()[this.camera.LAYERS.GAME];
    let visibleHexeImages = gameLayer.getChildren((node) => {
      return visibleIds.includes(node.id());
    });

    visibleHexeImages.forEach(tile => {
      tile.to({opacity: 1});
    });
      // tile.opacity(1);

    gameLayer.draw();
    // this.camera.stage.draw();
  }
}
