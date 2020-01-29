import Service from '@ember/service';
import {inject as service} from '@ember/service';
import { A as emberArray } from '@ember/array';
import { isPresent } from '@ember/utils';
import { tracked } from '@glimmer/tracking';
import { timeout } from 'ember-concurrency';
import {task} from 'ember-concurrency-decorators';
import Konva from 'konva';

export default class TransportService extends Service {

  TRANSPORTMODES = {
    SEA: 0,
    LAND: 1
  };

  @service api;
  @service store;
  @service ('map') mapService;
  @service agent;
  @service game;
  @service constants;
  @service camera;
  @service gameboard;
  @service ('fieldOfView') fov;


  @tracked moveQueueEnabled = true;
  @tracked moveQueue = emberArray();

  // put the player on a specific transport
  boardTransport(transport) {
    this.game.player.boardTransport = transport;
  }

  findTransportByName(name) {
    let transport = this.game.transports.find((transport => {
      return transport.name === name;
    }))
    // console.log('findTransportByName', transport);
    return transport ? transport : null;
  }

  // Loads player, all transports, and all enemies
  async setupAgents(agents) {

    // var nodes = layer.findOne('.bar');
    // create group for player and transports/enemies separately
    let agentsLayer = this.game.camera.getAgentsLayer();
    const playerGroup = new Konva.Group({
      // id: this.camera.GROUPS.PLAYER
      name: this.camera.GROUPS.PLAYER
    });
    agentsLayer.add(playerGroup);
    const transportsEnemiesGroup = new Konva.Group({
      name: this.camera.GROUPS.AGENTS
      // id: this.camera.GROUPS.AGENTS
    });
    agentsLayer.add(transportsEnemiesGroup);


    let transportsArray = emberArray();

    if(agents.transports) {
      for (let i = 0; i < agents.transports.length; i++) {

        let transport = await this.api.loadTransport.perform(agents.transports[i]);
        transport.set('hex', this.mapService.findHexByColRow(transport.startHex.col, transport.startHex.row));
        this.agent.buildDisplayGroup(transport);
        transportsArray.push(transport);
      }
    }
    this.game.transports = transportsArray;

    // find the ship to board initially
    // let startingShip = this.findTransportByName('ship'); // TODO how to handle loading map and get on ship

    this.game.player = await this.api.loadPlayer.perform(agents.player.id)
    this.game.player.set('startHex', agents.player.start)
    this.game.player.set('hex', this.mapService.findHexByColRow(agents.player.start.col, agents.player.start.row));
    this.agent.buildDisplayGroup(this.game.player);

    // // MiniMap circle for player
    // let playerCircle = new Konva.Circle({
    //   radius: 4,
    //   fill: 'red',
    //   draggable: false,
    //   opacity: 1,
    //   listening: false
    // });
    // player.miniMapPlayerCircle = playerCircle;

    let agentsArray = emberArray();
    if(agents.enemies) {
      for (let i = 0; i < agents.enemies.length; i++) {

        let enemyAgent = await this.get('api.loadEnemy').perform(agents.enemies[i]);
        enemyAgent.set('hex', this.mapService.findHexByColRow(enemyAgent.startHex.col, enemyAgent.startHex.row));
        this.agent.buildDisplayGroup(enemyAgent);
        agentsArray.push(enemyAgent);
      }
    }
    this.game.agents = agentsArray;
  }

  setupPatrols() {
    this.moveQueue = emberArray();
    this.game.agents.forEach((agent) => {
      if (isPresent(agent.patrol) > 0) {
        console.log(`setting up patrol for ${agent.name}`);

        this.pushTransportWaypointToMoveQueue(agent)
      }
    })
  }

  pushTransportWaypointToMoveQueue(agent) {
    // console.log('pushTransportWaypointToMoveQueue', agent);

    let currentWaypointHex;

    if(agent.patrolMethod === this.constants.PATROLMETHOD.RANDOM) {
      //random patrol:
      currentWaypointHex = agent.patrol[Math.floor(Math.random() * agent.patrol.length)];

    } else {
      // rolling patrol:
      agent.currentWaypoint++;
      if (agent.currentWaypoint >= agent.patrol.length) {
        agent.currentWaypoint = 0;
      }
      currentWaypointHex = agent.patrol[agent.currentWaypoint];
    }

    // let targetHex = this.game.mapService.findHexByQR(currentWaypointHex.Q, currentWaypointHex.R);
    let targetHex = this.mapService.findHexByColRow(currentWaypointHex.col, currentWaypointHex.row);

    let path = this.game.mapService.findPath(this.game.mapService.allHexesMap, agent.hex, targetHex, {agent: agent});
    let moveObject = {
      agent: agent,
      path: path,
      finishedCallback: () => {
        this.pushTransportWaypointToMoveQueue(agent);
      }
    }
    this.moveQueue.pushObject(moveObject);

  }

  removeAgentFromMoveQueue(agent) {
    // console.log('removeAgentFromMoveQueue');
    this.moveQueue = this.moveQueue.reject((thisAgent) => {
      return thisAgent.name = agent.name;
    });
  }

  @task
  *moveQueueTask() {
    console.log('in moveQueue', this.moveQueueEnabled);
    while (this.moveQueueEnabled === true) {
      // yield timeout(2000);
      yield timeout(1000);

      // if there are things to move
      if (this.moveQueue.length > 0) {

        this.moveQueue.forEach((moveObject) => {
          // is there anywhere for this object to go?
          if (moveObject.path.length > 0) {

            // grab the next waypoint
            let firstMove = moveObject.path[0]

            // attempt the move
            this.moveTransportTask.perform(moveObject.agent,firstMove);

            // we're done, remove it from the list of waypoints to go to
            moveObject.path.shiftObject();

          } else {

            // no moves left for this object
            if (typeof moveObject.finishedCallback === 'function') {
              moveObject.finishedCallback();
            }

            // remove the object from the global move list
            this.moveQueue.removeObject(moveObject);

          }
        });

      } else {
        // console.log('waiting....');
      }

//       let consoleTableItems = []
//       this.moveQueue.forEach((moveObject) => {
//         let logItem = {
//           name: moveObject.agent.name,
//           'player distance': moveObject.agent.playerDistance,
//           'sight': moveObject.agent.sightRange,
//           'state': moveObject.agent.state,
//         };
//         consoleTableItems.push(logItem);
//       })
//       if (consoleTableItems.length) {
//         // console.table(consoleTableItems);
//       }
    }
  }

  moveTransportToHex(transport, targetHex) {
    transport.hex = targetHex;
    let point = targetHex.point;

    // node: transport.imageObj,
    let tween = new Konva.Tween({
      node: transport.imageGroup,
      duration: this.constants.PLAYERMOVETWEENDURATION,
      easing: Konva.Easings.EaseInOut,
      x: point.x,
      y: point.y
    });

    tween.play();
  }

  @task
  *moveTransportTask(transport, targetHex) {

    this.moveTransportToHex(transport, targetHex);

    this.game.onTransportMoved(transport, targetHex);

    yield timeout(transport.speed);

  }
  // }).enqueue() moveTransportTask;


  // @task
  // @task()
  @task({drop:true})
  *movePlayerToHexTask(targetHex) {
// console.log('move player', this.game.player, 'player hex', this.game.player.hex.colRowText, 'targetHex', targetHex);
    this.game.onBeforeMovePlayer(targetHex);

    const currentHex = this.game.player.hex;
    // this.game.player.previousHex = this.game.player.hex;
    this.game.player.hex = targetHex;

    let objectToVisuallyMove = this.game.player;

    // if the player is on a transport, move the transport
    if (this.game.player.boardedTransport) {
      // this.game.player.boardedTransport.previousHex = this.game.player.boardedTransport.hex;
      this.game.player.boardedTransport.hex = targetHex;
      objectToVisuallyMove = this.game.player.boardedTransport;
    }

    const playerMoved = this.tweenPlayerOrMap(this.game.player, objectToVisuallyMove, currentHex, targetHex);

    this.game.fov.updatePlayerFieldOfView(playerMoved);

    this.game.camera.stage.batchDraw();

    this.game.onAfterMovePlayer(targetHex);
    // yield this.game.onAfterMovePlayer(targetHex);


    yield timeout(this.game.player.speed);

  }

  shouldMovePlayer(targetWithinSightRangeBoundaryBox, targetIsNearEdge) {
    return targetWithinSightRangeBoundaryBox || targetIsNearEdge;
  }

  tweenPlayerOrMap(player, objectToVisuallyMove, currentHex, targetHex) {
    // node: objectToVisuallyMove.imageObj,

    // TODO here 1/1/20  something is up with fov seen hexes
    let movePlayer = true;

    /**
     * move player or map?
     *
     * 1/6/20:
     * if within the sight range box, move player
     * if within sight range of edge of map AND moving that/or opposite direction, move player
     *
     *
     *
     *
     * if the player is within sightRange of the edge of the map
     * and there is additional portions of the map beyond the edge of the camera viewport
     * then tween map
     *
     * otherwise, tween player
     *
     *
     */
    console.group('tweenPlayerOrMap');

    const adjustmentPoint = this.mapService.distanceInPoint(currentHex, targetHex)

// console.log('   this.camera.mapOffsetY', this.camera.mapOffsetY);
// console.log('   this.camera.bottomSightRangeBoundary', this.camera.bottomSightRangeBoundary);
//     // movePlayer = this.playerMoveIsWithinSightRangeOfMapEdge(targetHex);
//     const playerMoveIsWithinSightRangeOfMapEdge = this.playerMoveIsWithinSightRangeOfMapEdge(adjustmentPoint, targetHex);
//     const playerMoveIsNearEdge = this.playerMoveIsNearEdge(adjustmentPoint, targetHex)
//     const mapAreaAvailableOtherSideOfSightRangeBox = this.mapAreaAvailableOtherSideOfSightRangeBox(adjustmentPoint, targetHex)
//     movePlayer = playerMoveIsNearEdge || playerMoveIsWithinSightRangeOfMapEdge || (playerMoveIsWithinSightRangeOfMapEdge && mapAreaAvailableOtherSideOfSightRangeBox);

    // console.log('movePlayer', movePlayer, `${playerMoveIsNearEdge}, ${playerMoveIsWithinSightRangeOfMapEdge}, ${mapAreaAvailableOtherSideOfSightRangeBox}`);


    const playerMoveIsNearEdge = this.playerMoveIsNearEdge(targetHex);
    const playerMoveWillBeInsideSightRangeBoundary = this.playerMoveWillBeInsideSightRangeBoundary(targetHex);

    movePlayer = this.shouldMovePlayer(playerMoveIsNearEdge, playerMoveWillBeInsideSightRangeBoundary);

    console.log('movePlayer', movePlayer, `
      playerMoveIsNearEdge: ${playerMoveIsNearEdge},
      playerMoveWillBeInsideSightRangeBoundary: ${playerMoveWillBeInsideSightRangeBoundary}

      `);

    // movePlayer = false;

    if (movePlayer) {
      console.log(' +++ moving player', objectToVisuallyMove.imageGroup.getX(),objectToVisuallyMove.imageGroup.getY());

      console.log('new x', playerMoveIsNearEdge ? this.camera.mapOffsetX : targetHex.point.x);
      console.log('new y', playerMoveIsNearEdge ? this.camera.mapOffsetY : targetHex.point.y);
      const tween = new Konva.Tween({
        node: objectToVisuallyMove.imageGroup,
        duration: this.constants.PLAYERMOVETWEENDURATION,
        // duration: this.constants.PLAYERMOVETWEENDURATION,
        easing: Konva.Easings.EaseInOut,
        x: playerMoveIsNearEdge ? this.camera.mapOffsetX : targetHex.point.x,
        y: playerMoveIsNearEdge ? this.camera.mapOffsetY : targetHex.point.y,
        // x: targetHex.point.x + this.camera.mapOffsetX,
        // y: targetHex.point.y + this.camera.mapOffsetY
      });
      tween.play();

    } else {

      // console.log('move map from ', this.camera.mapOffsetX, this.camera.mapOffsetY, adjustmentPoint);
      this.camera.adjustMapOffset(adjustmentPoint);
      // this.camera.mapOffsetX -= adjustmentPoint.x;
      // this.camera.mapOffsetY -= adjustmentPoint.y;

      console.log(' --- moving map to ', this.camera.mapOffsetX, this.camera.mapOffsetY, adjustmentPoint);

      this.camera.backgroundImageObj.to({
        x: this.camera.mapOffsetX,
        y: this.camera.mapOffsetY,
        duration: this.constants.PLAYERMOVETWEENDURATION
      });

      // also move tile hex info
      const tileHexInfoGroup = this.camera.getHexInfoGroup();
      if (tileHexInfoGroup) {
        tileHexInfoGroup.to({
          x: tileHexInfoGroup.x() - adjustmentPoint.x,
          y: tileHexInfoGroup.y() - adjustmentPoint.y,
          duration: this.constants.PLAYERMOVETWEENDURATION
        });
      }

      // this move fog of war.  is there a better way
      const hexGroup = this.camera.getHexLayerGroup();
      if (hexGroup) {
        hexGroup.to({
          x: tileHexInfoGroup.x() - adjustmentPoint.x,
          y: tileHexInfoGroup.y() - adjustmentPoint.y,
          duration: this.constants.PLAYERMOVETWEENDURATION
        });
      }

      // also move FOV layer
      const fovGroup = this.camera.getFOVLayerGroup();
      if (fovGroup) {
        fovGroup.to({
          x: tileHexInfoGroup.x() - adjustmentPoint.x,
          y: tileHexInfoGroup.y() - adjustmentPoint.y,
          duration: this.constants.PLAYERMOVETWEENDURATION
        });
      }

      // also move agents layer
      const agentsLayer = this.camera.getEnemiesGroup(); // same for transports
      if (agentsLayer) {
        agentsLayer.to({
          x: tileHexInfoGroup.x() - adjustmentPoint.x,
          y: tileHexInfoGroup.y() - adjustmentPoint.y,
          duration: this.constants.PLAYERMOVETWEENDURATION
        });
      }

    }
console.log(`mapOffsetY, ${this.camera.mapOffsetY}
mapOffsetX, ${this.camera.mapOffsetX}
`);
// console.log('   this.camera.bottomSightRangeBoundary', this.camera.bottomSightRangeBoundary);
console.groupEnd();
    return movePlayer;

  }

  playerMoveWillBeInsideSightRangeBoundary(targetHex) {
    return this.camera.hexIsInsideSightRangeBoundary(targetHex);
  }

  playerMoveIsNearEdge(targetHex) {
    const range = this.game.player.sightRange-1;
    let nearLeftEdge = targetHex.col <= range;
    let nearRightEdge = targetHex.col >= ((this.mapService.numMapColumns-1) - range);
    let nearTopEdge = targetHex.row <= range;
    let nearBottomEdge = targetHex.row >= ((this.mapService.numMapRows-1) - range);

    console.log(`nearLeftEdge: ${nearLeftEdge}   targetHex.col <= range = ${targetHex.col} <= ${range}`);
    return nearLeftEdge || nearTopEdge || nearRightEdge || nearBottomEdge;
  }

  mapAreaAvailableOtherSideOfSightRangeBox(adjustmentPoint, targetHex) {
    let mapAreaAvailableOtherSideOfSightRangeBox;

    // let nearLeftEdge = false;
    // let nearRightEdge = false;
    let isAreaNorth = false;
    // let nearBottomEdge = false;
    // let mapRows = this.mapService.worldMap.length
    // let mapColumns = this.mapService.worldMap[0].length

    // if (adjustmentPoint.x < 0) {
    //   nearLeftEdge = targetHex.col <= this.game.player.sightRange;
    // }
    // if (adjustmentPoint.y < 0) {
    // nearTopEdge = targetHex.row <= this.game.player.sightRange;
    // }
    // if (adjustmentPoint.x > 0) {
    // nearRightEdge = targetHex.col >= ((mapColumns-1) - this.game.player.sightRange);
    // }
    if (adjustmentPoint.y < 0) {
// console.log('going north', this.camera.mapOffsetY, 'this.camera.mapOffsetY < 0', this.camera.mapOffsetY < 0);
      isAreaNorth = this.camera.mapOffsetY < 0;
    }
    mapAreaAvailableOtherSideOfSightRangeBox = isAreaNorth;
    // mapAreaAvailableOtherSideOfSightRangeBox = nearLeftEdge || nearTopEdge || nearRightEdge || nearBottomEdge;
    // console.log('mapAreaAvailableOtherSideOfSightRangeBox: adjustmentPoint', adjustmentPoint, 'mapAreaAvailableOtherSideOfSightRangeBox', mapAreaAvailableOtherSideOfSightRangeBox);
    return mapAreaAvailableOtherSideOfSightRangeBox;
  }
  /**
   * Check to see if the player is within sight range of map edge
   *
   */
  playerMoveIsWithinSightRangeOfMapEdge(adjustmentPoint, targetHex) {
    let outOfRangeTop = false;
    let outOfRangeBottom = false;
    // const outOfRangeLeft = targetHex.point.x <= this.camera.leftSightRangeBoundary;
    if (adjustmentPoint.y < 0) {
      outOfRangeTop = (targetHex.point.y - this.camera.mapOffsetY) <= this.camera.topSightRangeBoundary;
    }
    // const outOfRangeRight = targetHex.point.x >= this.camera.rightSightRangeBoundary;
    if (adjustmentPoint.y > 0) {
      // outOfRangeBottom = ((targetHex.point.y - adjustmentPoint.y) - this.camera.mapOffsetY) >= this.camera.bottomSightRangeBoundary;
      outOfRangeBottom = (targetHex.point.y - this.camera.mapOffsetY) >= this.camera.bottomSightRangeBoundary;
    }

    console.log('outOfRangeTop', outOfRangeTop, `${(targetHex.point.y - this.camera.mapOffsetY)} <= ${this.camera.topSightRangeBoundary}`);
    console.log('outOfRangeBottom', outOfRangeBottom, `${(targetHex.point.y - this.camera.mapOffsetY)} >= ${this.camera.bottomSightRangeBoundary}`);
    // console.log('targetHex.point, outOfRangeLeft || outOfRangeTop || outOfRangeRight || outOfRangeBottom', targetHex.point, outOfRangeLeft, outOfRangeTop, outOfRangeRight, outOfRangeBottom);
    return (outOfRangeTop || outOfRangeBottom) === false;  // Nothing out of range, player move is in range
    // return (outOfRangeLeft || outOfRangeTop || outOfRangeRight || outOfRangeBottom) === false;  // Nothing out of range, player move is in range
  }

  movePlayerAlongPath(path) {
    if (path && path.length) {
      for (let move = 0, pathLen = path.length; move < pathLen; move++) {
        let nextHex = path[move];

        this.movePlayerToHexTask.perform(nextHex);
      }
    }
  }

}
