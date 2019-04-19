import Service from '@ember/service';
import {inject as service} from '@ember/service';
import { A as emberArray } from '@ember/array';
import { isPresent } from '@ember/utils';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';
import Konva from 'konva';
import { Player } from '../objects/agents/player'
import { Enemy } from '../objects/agents/enemy'
import { Transport } from '../objects/agents/transport'
// import { alias } from '@ember-decorators/object/computed';

export default class TransportService extends Service {

  TRANSPORTMODES = {
    SEA: 0,
    LAND: 1
  };

  @service ('map') mapService;
  @service ('game') game;
  @service ('camera') camera;
  @service ('gameboard') gameboard;
  @service ('fieldOfView') fov;

  @tracked player = null;
  @tracked agents = emberArray();
  @tracked transports = emberArray();


  @tracked moveQueueEnabled = true;
  @tracked moveQueue = emberArray();

  // put the player on a specific transport
  boardTransport(transport) {
    this.game.player.boardTransport = transport;
  }

  findTransportByName(name) {
    let transport = this.transports.find((transport => {
      return transport.name === name;
    }))
    // console.log('findTransportByName', transport);
    return transport;
  }

  setupAgents(agents) {

    this.player = null;
    this.transports = emberArray();
    this.agents = emberArray();

    agents.transports.forEach((transportAgent) => {
      let transport = new Transport({
        agent:transportAgent,
        mapService:this.mapService,
        camera:this.camera,
        transportService:this
      });
      // console.log('adding transport', transport);
      this.transports.push(transport);
    });

    // find the ship to board initially
    let startingShip = this.findTransportByName('ship');

    let player = new Player(
      {
        player:agents.player,
        mapService:this.mapService,
        camera:this.camera,
        game:this.game,
        transportService:this,
        travelAbilityFlags: this.game.FLAGS.TRAVEL.SEA,
        boardedTransport: startingShip
      });

    this.player = player;
    this.game.player = player;

    agents.enemies.forEach((gameAgent) => {
      let enemy = new Enemy({
        agent:gameAgent,
        mapService:this.mapService,
        camera:this.camera,
        transportService:this
      });
      this.agents.push(enemy);
    });

    return {
      player: this.player,
      agents: this.agents,
      transports: this.transports
    };

  }

  setupPatrols() {
    this.moveQueue = emberArray();
    this.agents.forEach((agent) => {
      if (isPresent(agent.patrol) > 0) {
        // console.log(`setting up patrol for ${transport.name}`);

        this.pushTransportWaypointToMoveQueue(agent)
      }
    })
  }

  pushTransportWaypointToMoveQueue(agent) {
    // console.log('pushTransportWaypointToMoveQueue', agent);

    let currentWaypointHex;

    if(agent.patrolMethod === 'random') {
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

    let targetHex = this.mapService.findHexByQRS(currentWaypointHex.Q, currentWaypointHex.R, currentWaypointHex.S);
    // let agentHex = this.transportHexes[agent.id];
    let path = this.mapService.findPath(this.mapService.worldMap, agent.hex, targetHex);
    let moveObject = {
      agent: agent,
      path: path,
      finishedCallback: () => {
        this.pushTransportWaypointToMoveQueue(agent);
      }
    }
    this.moveQueue.pushObject(moveObject);

  }

  @task( function*() {
    // console.log('in moveQueue', this.moveQueueEnabled);
    while (this.moveQueueEnabled === true) {
      yield timeout(600);
      // yield timeout(1000);

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
  }) moveQueueTask;

  @task(function*(transport, targetHex) {

    transport.hex = targetHex;
    let point = this.mapService.currentLayout.hexToPixel(targetHex);

    let tween = new Konva.Tween({
      node: transport.imageObj,
      duration: 0.5,
      easing: Konva.Easings.EaseInOut,
      x: point.x - 18,
      y: point.y - 18
    });

    tween.play();

    // debugging:
    this.gameboard.enemyHex = `Q:${targetHex.q} R:${targetHex.r} S:${targetHex.s}`;

    this.game.onTransportMoved(transport, targetHex);

    yield timeout(transport.speed);

  }) moveTransportTask;
  // }).enqueue() moveTransportTask;


  @task(function*(playerObj, targetHex) {

    playerObj.hex = targetHex;

    // for debugging:
    this.gameboard.playerHex = `Q:${targetHex.q} R:${targetHex.r} S:${targetHex.s}`;

    let point = this.mapService.currentLayout.hexToPixel(targetHex);

    let objectToVisuallyMove = playerObj;

    // if the player is on a transport, move the transport
    if (playerObj.boardedTransport) {
      playerObj.boardedTransport.hex = targetHex;
      objectToVisuallyMove = playerObj.boardedTransport;

      // for debugging:
      this.gameboard.shipHex = `Q:${targetHex.q} R:${targetHex.r} S:${targetHex.s}`;
    }

    let tween = new Konva.Tween({
      node: objectToVisuallyMove.imageObj,
      duration: 0.5,
      easing: Konva.Easings.EaseInOut,
      x: point.x - 18,
      y: point.y - 18
    });

    tween.play();

    this.fov.updatePlayerFieldOfView(playerObj.hex);

    this.camera.stage.draw();

    yield timeout(playerObj.speed);

  // }) movePlayerToHexTask;
  }).enqueue() movePlayerToHexTask;

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
