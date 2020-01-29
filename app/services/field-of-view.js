import Service from '@ember/service';
import {inject as service} from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class FieldOfViewService extends Service {
  @service ('map') mapService;
  @service gameboard;
  @service transport;
  @service camera;
  @service config;
  @service constants;
  @service ('path') pathService;
  @service ('agent') agentService;
  @service game;

  @tracked lastNeighborsInRangeArray = {};

  updatePlayerFieldOfView() {
// performance.mark("updatePlayerFieldOfView Start");
    let player = this.game.player;

    const originHex = player.hex;
    // const originHex = player.previousHex || player.hex;
    // console.log('updatePlayerFieldOfView player.hex', player.hex.colRowText);

    // recursive
    let neighborsInRangeArray = [];
    this.mapService.getNeighborHexesInRange(1, player.sightRange, originHex, neighborsInRangeArray);
    this.clean(originHex, neighborsInRangeArray);

    // console.log('neighborsInRangeArray', neighborsInRangeArray);

    let finalFovHexes = this.buildFieldOfVisionVisibleAndBlockedHexes(neighborsInRangeArray, originHex);

    // console.log('finalFovHexes 1', finalFovHexes);
    // this.consoleLogHexIds('visible', finalFovHexes.visible);
    // this.consoleLogHexIds('noLongerVisible', finalFovHexes.noLongerVisible);



    this.mapService.updateSeenHexes(finalFovHexes);
    console.log('finalFovHexes 2', finalFovHexes);
    this.updateGameboardTilesOpacity(finalFovHexes);
    // console.log('finalFovHexes 3', finalFovHexes);
    // if (!foo) {
    this.updateAgentOpacity(finalFovHexes);
    // console.log('finalFovHexes 4', finalFovHexes);
// performance.mark("updatePlayerFieldOfView End");
// performance.measure("measure updatePlayerFieldOfView Start to updatePlayerFieldOfView End", "updatePlayerFieldOfView Start", "updatePlayerFieldOfView End");

    // }
    // this.config.reportAndResetPerformance();
  }

  consoleLogHexIds (label, hexes) {
    let hexIds = '';
    hexes.forEach(hex => {
      if (hexIds) {
        hexIds += ', ';
      }
      hexIds += `[${hex.id}/${hex.colRowText}]`;
    });
    console.log(`hexes-${label} length`, hexes.length, hexIds);

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

  updateAgentOpacity(finalFovHexes) {
    // get all agent that are in finalFovHexes.visible
    // then set opacity to 1
    // get all agent that are in finalFovHexes.noLongerVisible
    // then set opacity to 0

    // let agentsLayer = this.camera.getAgentsLayer();

    const agents = [...this.game.agents, ...this.game.transports];

    agents.forEach((transportAgent) => {
    // this.game.agents.forEach((transportAgent) => {
    // this.game.agents.forEach((transportAgent) => {
      // console.log('transportAgent.name', transportAgent.name, transportAgent.imageGroup.attrs.opacity);
      if(transportAgent.imageGroup.attrs.opacity === 0){
        // make visible
        this.setAgentOpacity(transportAgent, finalFovHexes.visible, true);
      } else {
        // make non visible
        this.setAgentOpacity(transportAgent, finalFovHexes.noLongerVisible, false);
      }
      if (transportAgent.type === this.game.constants.AGENTTYPES.ENEMY) {
        this.checkPlayerInRangeForAgent(transportAgent);
      }
    });

    this.camera.stage.batchDraw();
    // agentsLayer.draw();
  }

  // hexesToCheck visible or noLongerVisible
  setAgentOpacity(transportAgent, hexesToCheck, isVisible) {
    // console.log('setAgentOpacity', transportAgent.id, transportAgent);
    if (transportAgent.hex && hexesToCheck.includes(transportAgent.hex)) {

      let keyPrefix = 'agent';
      switch (transportAgent.type) {
        case this.game.constants.AGENTTYPES.ENEMY:
          keyPrefix = 'agent';
          break;
        case this.game.constants.AGENTTYPES.TRANSPORT:
          keyPrefix = 'transport';
          break;
        default:
      }

      let visibleAgentImages = this.camera.getTransportsGroup().getChildren((node) => {
      // let visibleAgentImages = this.camera.getAgentsLayer().getChildren((node) => {
        return `${keyPrefix}${transportAgent.id}` === node.name();
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
      this.agentService.playerInRange(agent); // check range
    } else {
      this.agentService.playerOutOfRange(agent);
    }

  }

  setAllHexesVisibility(isVible) {
    const hexGroup = this.camera.getGameLayer().find('#hex');
    if (hexGroup.length > 0) {

      const hexes = hexGroup[0].children;
      hexes.forEach((tile) => {
        tile.to({
          fill: isVible ? this.constants.MAPFILLOPACITY.VISIBLE : this.constants.MAPFILLOPACITY.HIDDEN,
          duration : 0
        });
      });
    }
  }

  // update both main and mini maps
  updateGameboardTilesOpacity(finalFovHexes) {
    this.updateGameboardTilesOpacityForLayer(finalFovHexes, this.camera.getGameLayer());
    // this.updateGameboardTilesOpacityForLayer(finalFovHexes, this.camera.getMiniMapLayer());
  }

  updateGameboardTilesOpacityForLayer(finalFovHexes, layer) {
    if(this.game.showFieldOfViewLayer) {
      // console.log('layer', layer);
      const hexGroup = layer.find('#hex');
      // console.log('hexGroup',hexGroup);
      console.log('updateGameboardTilesOpacityForLayer');
      if (hexGroup.length > 0) {

        const hexes = hexGroup[0];
        // console.log('hexes',hexes);
        //
        // console.log('finalFovHexes', finalFovHexes);

        let visibleIds = finalFovHexes.visible.map(function (h) {
          return h.id;
        })

        let visibleHexImages = hexes.getChildren((node) => {
          // let visibleHexImages = layer.getChildren((node) => {
          return visibleIds.includes(node.id());
        });
        // console.log('visibleHexImages', visibleHexImages);
        visibleHexImages.forEach((tile) => {
          // tile.to({opacity: 0});

          // const fillcolor = `rgb(${index*10},0,0)`;
          // console.log('fillcolor', fillcolor);
          tile.to({
            // stroke: 'rgba(226,148,0,.75)',
            // stroke:  this.constants.MAPFILLOPACITY.VISIBLE,
            // fill: this.constants.MAPFILLOPACITY.DEBUGVISIBLE,
            // fill: fillcolor,
            fill: this.constants.MAPFILLOPACITY.VISIBLE,
            duration: this.constants.MAPFILLTWEENDURATION
          });
        });

        // No longer visible
        let noLongerVisibleIds = finalFovHexes.noLongerVisible.map(function (h) {
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
            fill: this.constants.MAPFILLOPACITY.PREVIOUSLYSEEN,
            duration: this.constants.MAPFILLTWEENDURATION
          });
          // tile.to({fill: this.constants.MAPFILLOPACITY.PREVIOUSLYSEEN});
          // tile.to({opacity: this.constants.MAPOPACITY.PREVIOUSLYSEEN});
        });

        this.camera.stage.batchDraw();
        // layer.batchDraw();
      }
    }
  }
}
