import Service from '@ember/service';
import {inject as service} from '@ember/service';
import { A as emberArray } from '@ember/array';
import { isPresent } from '@ember/utils';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';

import { Player } from '../objects/agents/player'
import { Enemy } from '../objects/agents/enemy'

export default class TransportService extends Service {

  @service ('map') mapService;
  @service ('game') game;
  @service ('gameboard') gameboard;

  @tracked players = emberArray();  // Needs to be an array for animated-each
  @tracked agents = emberArray();

  @tracked transportHexes = [];
  @tracked transportPoints = [];

  @tracked moveQueueEnabled = true;
  @tracked moveQueue = emberArray();

  setupAgents(agents) {

    this.players = emberArray();
    this.agents = emberArray();

    let playerStartHex = this.mapService.hexMap.find((hex) => {
      return (agents.player.start.Q === hex.q) &&
        (agents.player.start.R === hex.r) &&
        (agents.player.start.S === hex.s)
    });

    let playerStartPoint = this.mapService.currentLayout.hexToPixel(playerStartHex);

    this.transportHexes.push(playerStartHex);
    this.transportPoints.push(playerStartPoint);

    let player = new Player();
    player.id = agents.player.index;
    player.name = agents.player.name;
    player.hex = playerStartHex;
    player.point = playerStartPoint;
    player.agentImage = `/images/transports/${agents.player.img}`;
    player.sightRange = agents.player.sightRange;
    player.speed = agents.player.speed;
    player.patrol = agents.player.patrol;
    player.currentWaypoint = -1;
    player.state = agents.player.state
    player.hexLayout = this.mapService.currentLayout;
    player.mapCenterX = this.gameboard.centerX;
    player.mapCenterY = this.gameboard.centerY;

    this.players.push(player);

    agents.game.forEach((gameAgent) => {
      let startHex = this.mapService.hexMap.find((hex) => {
        return (gameAgent.start.Q === hex.q) &&
          (gameAgent.start.R === hex.r) &&
          (gameAgent.start.S === hex.s)
      });
      // console.log('startHex', startHex);

      let startPoint = this.mapService.currentLayout.hexToPixel(startHex);

      this.transportHexes.push(startHex);
      this.transportPoints.push(startPoint);


      let enemy = new Enemy();
      enemy.id = gameAgent.index;
      enemy.name = gameAgent.name;
      enemy.hex = startHex;
      enemy.point = startPoint;
      enemy.agentImage = `/images/transports/${gameAgent.img}`;
      enemy.sightRange = gameAgent.sightRange;
      enemy.speed = gameAgent.speed;
      enemy.patrol = gameAgent.patrol;
      enemy.currentWaypoint = -1;
      enemy.state = gameAgent.state;
      enemy.hexLayout = this.mapService.currentLayout;
      enemy.mapCenterX = this.gameboard.centerX;
      enemy.mapCenterY = this.gameboard.centerY;

      this.agents.push(enemy);

      // console.log(gameAgent.name, ship);
    });

    return {
      players: this.players,
      agents: this.agents
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
    // console.log('pushTransportWaypointToMoveQueue', transport);
    agent.currentWaypoint++;
    if (agent.currentWaypoint >= agent.patrol.length) {
      agent.currentWaypoint = 0;
    }
    let currentWaypointHex = agent.patrol[agent.currentWaypoint];
    let targetHex = this.mapService.findHexByQRS(currentWaypointHex.Q, currentWaypointHex.R, currentWaypointHex.S);
    let agentHex = this.transportHexes[agent.id];
    let path = this.mapService.findPath(this.mapService.twoDimensionalMap, agentHex, targetHex);
    let moveObject = {
      agent: agent,
      path: path,
      finishedCallback: () => {
        // console.log('in move finishedCallback for ' + transport.name);
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

// console.log(this.moveQueue);
      let consoleTableItems = []
      this.moveQueue.forEach((moveObject) => {
        let logItem = {
          name: moveObject.agent.name,
          'player distance': moveObject.agent.playerDistance,
          'sight': moveObject.agent.sightRange,
          'state': moveObject.agent.state,
        };
        consoleTableItems.push(logItem);
      })
      if (consoleTableItems.length) {
        // console.table(consoleTableItems);
      }
    }
  }) moveQueueTask;

  @task(function*(transport, targetHex) {

    this.transportHexes[transport.id] = targetHex;

    transport.hex = targetHex;
    // transport.set('hex', targetHex);

    this.game.onTransportMoved(transport, targetHex);

    yield timeout(transport.speed);

  }).enqueue() moveTransportTask;

  @task(function*(ship, targetHex) {
    // let ship = this.ships.objectAt(0);
    // debugger;
    this.transportHexes[ship.id] = targetHex;

    ship.hex = targetHex;
    // ship.set('hex', targetHex);

    yield timeout(ship.speed);
  }).enqueue() moveShipToHexTask;

  moveShipAlongPath(path) {
    if (path && path.length) {

      // console.log('Moving ship along path', path);
      for (let move = 0, pathLen = path.length; move < pathLen; move++) {
        let nextHex = path[move];
        let player = this.players.objectAt(0);
        // this.moveTransportTask.perform(ship, nextHex);
        this.moveShipToHexTask.perform(player, nextHex);
      }


//       let moveObject = {
//         transport: this.ships.objectAt(0),
//         path: path,
//         finishedCallback: () => {
//           console.log('in move finishedCallback for Ship');
//           // this.pushTransportWaypointToMoveQueue(transport);
//         }
//       }
//
//       this.moveQueue.pushObject(moveObject);


      // console.log('done');
    }
  }

}
