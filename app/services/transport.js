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

    let transportsArray = emberArray();

    if(agents.transports) {
      for (let i = 0; i < agents.transports.length; i++) {

        let transport = await this.get('api.loadTransport').perform(agents.transports[i]);
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
      duration: 0.5,
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
  @task({drop:true})
  *movePlayerToHexTask(playerObj, targetHex) {
// console.log('move', 'playerObj', playerObj, 'targetHex', targetHex);
    this.game.onBeforeMovePlayer(targetHex);

    playerObj.hex = targetHex;

    let point = targetHex.point;
    // let point = this.game.mapService.currentLayout.hexToPixel(targetHex);

    // for debugging:
    this.game.gameboard.playerHex = `Q:${targetHex.q} R:${targetHex.r} col:${targetHex.col} row:${targetHex.row}`;
    this.game.gameboard.playerXY = `X:${Math.round(point.x)} Y:${Math.round(point.y)}`;

    let objectToVisuallyMove = playerObj;

    // if the player is on a transport, move the transport
    if (playerObj.boardedTransport) {
      playerObj.boardedTransport.hex = targetHex;
      objectToVisuallyMove = playerObj.boardedTransport;

      // for debugging:
      this.game.gameboard.shipHex = `Q:${targetHex.q} R:${targetHex.r}`;
      this.game.gameboard.shipXY = `X:${Math.round(point.x)} Y:${Math.round(point.y)}`;

    }

      // node: objectToVisuallyMove.imageObj,
    let tween = new Konva.Tween({
      node: objectToVisuallyMove.imageGroup,
      duration: 0.5,
      easing: Konva.Easings.EaseInOut,
      x: point.x,
      y: point.y
    });
      // x: point.x - 18,
      // y: point.y - 18

    tween.play();

    this.game.fov.updatePlayerFieldOfView();
    // this.game.fov.updatePlayerFieldOfView(playerObj.hex);

    this.game.camera.stage.batchDraw();

    this.game.onAfterMovePlayer(targetHex);
    // yield this.game.onAfterMovePlayer(targetHex);


    yield timeout(playerObj.speed);

  }

  movePlayerAlongPath(path) {
    if (path && path.length) {
      for (let move = 0, pathLen = path.length; move < pathLen; move++) {
        let nextHex = path[move];

        let player = this.game.player;
        this.movePlayerToHexTask.perform(player, nextHex);
      }
    }
  }

}
