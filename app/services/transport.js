import Service from '@ember/service';
import {inject as service} from '@ember/service';
import { A as emberArray } from '@ember/array';
import { isPresent } from '@ember/utils';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';
import Konva from 'konva';
import { Player } from '../objects/agents/player'
import { Enemy } from '../objects/agents/enemy'
// import { alias } from '@ember-decorators/object/computed';

export default class TransportService extends Service {

  @service ('map') mapService;
  @service ('game') game;
  @service ('camera') camera;
  @service ('gameboard') gameboard;
  @service ('fieldOfView') fov;

  @tracked players = emberArray();  // Needs to be an array for animated-each
  @tracked agents = emberArray();

  // @alias('players.objectAt(0)') player;

  @tracked transportHexes = [];
  @tracked transportPoints = [];

  @tracked moveQueueEnabled = true;
  @tracked moveQueue = emberArray();

  setupAgents(agents) {

    this.players = emberArray();
    this.agents = emberArray();

    let player = new Player(
      {
        player:agents.player,
        mapService:this.mapService,
        camera:this.camera,
        transportService:this
      });

    this.players.push(player);

    agents.game.forEach((gameAgent) => {
      let enemy = new Enemy({
        agent:gameAgent,
        mapService:this.mapService,
        camera:this.camera,
        transportService:this
      });
      this.agents.push(enemy);
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
    // console.log('pushTransportWaypointToMoveQueue', agent);

    //random patrol:
    let currentWaypointHex = agent.patrol[Math.floor(Math.random()*agent.patrol.length)];

    // rolling patrol:
    // agent.currentWaypoint++;
    // if (agent.currentWaypoint >= agent.patrol.length) {
    //   agent.currentWaypoint = 0;
    // }
    // let currentWaypointHex = agent.patrol[agent.currentWaypoint];

    let targetHex = this.mapService.findHexByQRS(currentWaypointHex.Q, currentWaypointHex.R, currentWaypointHex.S);
    let agentHex = this.transportHexes[agent.id];
    let path = this.mapService.findPath(this.mapService.worldMap, agentHex, targetHex);
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
    let point = this.mapService.currentLayout.hexToPixel(targetHex);

    let tween = new Konva.Tween({
      node: transport.imageObj,
      duration: 0.5,
      easing: Konva.Easings.EaseInOut,
      x: point.x - 18,
      y: point.y - 18
    });

    tween.play();

    this.game.onTransportMoved(transport, targetHex);

    yield timeout(transport.speed);

  }).enqueue() moveTransportTask;

  @task(function*(ship, targetHex) {
    // let ship = this.ships.objectAt(0);
    // debugger;
    this.transportHexes[ship.id] = targetHex;

    ship.hex = targetHex;
    let point = this.mapService.currentLayout.hexToPixel(targetHex);

    let tween = new Konva.Tween({
      node: ship.imageObj,
      duration: 0.5,
      easing: Konva.Easings.EaseInOut,
      x: point.x - 18,
      y: point.y - 18
    });

    tween.play();

    // this.moveMapIfNecessary(ship.hex);

    this.fov.updatePlayerFieldOfView(ship.hex);

    this.camera.stage.draw();

    yield timeout(ship.speed);
  }).enqueue() moveShipToHexTask;

  // todo move this to camera
  moveMapIfNecessary(shipHex) {
    let distanceFromCameraEdge = this.distanceFromCameraEdge(shipHex);
    let shouldScrollMap = this.shouldScrollMap(distanceFromCameraEdge);
    if (shouldScrollMap.right) {
      this.camera.scroll({x: -this.mapService.currentLayout.hexHorizontalSpacing, y: 0});
    }
    if (shouldScrollMap.left) {
      this.camera.scroll({x: this.mapService.currentLayout.hexHorizontalSpacing, y: 0});
    }
    if (shouldScrollMap.top) {
      this.camera.scroll({x: 0, y: -this.mapService.currentLayout.hexVerticalSpacing});
    }
    if (shouldScrollMap.bottom) {
      this.camera.scroll({x: 0, y: this.mapService.currentLayout.hexVerticalSpacing});
    }
  }

  // todo move this to camera
  distanceFromCameraEdge(shipHex) {
    let shipPoint = this.mapService.currentLayout.hexToPixel(shipHex);
    let distanceFromCameraEdge = {
      top: shipPoint.y - this.mapService.topLeftPoint.y,
      left: shipPoint.x - this.mapService.topLeftPoint.x,
      bottom: this.mapService.bottomRightPoint.y - shipPoint.y,
      right: this.mapService.bottomRightPoint.x - shipPoint.x
    };
    console.log('distanceFromCameraEdge', distanceFromCameraEdge);
    return distanceFromCameraEdge;
  }

  shouldScrollMap(distanceFromCameraEdge) {
    let player = this.players.objectAt(0);
    let sightRange = player.sightRange + 1;
    let scrollMap = {
      right: (sightRange * this.mapService.currentLayout.hexHorizontalSpacing > distanceFromCameraEdge.right),
      left: (distanceFromCameraEdge.left < sightRange * this.mapService.currentLayout.hexHorizontalSpacing),
      bottom: (sightRange * this.mapService.currentLayout.hexVerticalSpacing > distanceFromCameraEdge.bottom),
      top: (distanceFromCameraEdge.top < sightRange * this.mapService.currentLayout.hexVerticalSpacing)
    }
    console.log('shouldScrollMap', scrollMap);
    return scrollMap;
  }


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
