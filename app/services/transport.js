import Service from '@ember/service';
import {inject as service} from '@ember/service';
import { A as emberArray } from '@ember/array';
import { isPresent } from '@ember/utils';
import { tracked } from '@glimmer/tracking';
import { timeout } from 'ember-concurrency';
import {task} from 'ember-concurrency-decorators';
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

  @service ('api') api;
  @service ('store') store;
  @service ('map') mapService;
  @service ('game') game;
  @service ('camera') camera;
  @service ('gameboard') gameboard;
  @service ('fieldOfView') fov;

  // @tracked player = null;
  // @tracked agents = emberArray();
  // @tracked transports = emberArray();


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

  async setupAgents(agents) {

    // let player = null;
  let transportsArray = emberArray();
    // this.agents = emberArray();

  if(agents.transports) {
    for (let i = 0; i < agents.transports.length; i++) {

      // agents.transports.forEach((transportAgentId) => {

      // agents.transports.forEach((transportAgent) => {
      let mirageTransportAgent = await this.get('api.loadTransport').perform(agents.transports[i]);

      // this.store.find('transport', transportAgentId).then(mirageTransportAgent => {
      let transport = new Transport({
        agent: mirageTransportAgent,
        // agent:transportAgent,
        mapService: this.mapService,
        camera: this.camera,
        game: this.game,
        transportService: this,
        gameboard: this.gameboard,
      });
      // console.log('adding transport', transport);
      // if (mirageTransportAgent.travelFlags) {
        // mirageTransportAgent.travelFlags.forEach((/*flag*/) => {
          // this.game.turnOnTransportTravelAbilityFlag(transportAgent, flag); // TODO implement
        // });
      // }

      transportsArray.push(transport);
      // });

    }
  }

    // find the ship to board initially
    let startingShip = this.findTransportByName('ship'); // TODO how to handle loading map and get on ship

    // let player = new Player(
    //   {
    //     player:agents.player,
    //     game:this.game,
    //     travelAbilityFlags: 0,
    //     boardedTransport: null
    //   }
    //     // boardedTransport: startingShip
    // );

    let miragePlayer = await this.api.loadPlayer.perform(agents.player.id)

    // set starting hex for this map
    miragePlayer.set('startHex', agents.player.start)

        // player:agents.player,
    let player = new Player(
      {
        player:miragePlayer,
        mapService:this.mapService,
        camera:this.camera,
        game:this.game,
        gameboard:this.gameboard,
        transportService:this,
        // travelAbilityFlags: this.game.FLAGS.TRAVEL.LAND,
        boardedTransport: null
      }
    );
        // boardedTransport: startingShip,
    // miragePlayer.travelFlags.forEach(flag => {
      // console.log('flag', flag);
      // this.game.turnOnPlayerTravelAbilityFlag(flag);   // TODO set from map file
    // });
        // travelAbilityFlags: this.game.FLAGS.TRAVEL.SEA,

    // MiniMap circle for player
    let playerCircle = new Konva.Circle({
      radius: 4,
      fill: 'red',
      draggable: false,
      opacity: 1,
      listening: false
    });
    player.miniMapPlayerCircle = playerCircle;


    let agentsArray = emberArray();
    if(agents.enemies) {
      for (let i = 0; i < agents.enemies.length; i++) {
        // agents.enemies.forEach((gameAgent) => {

        let mirageEnemyAgent = await this.get('api.loadEnemy').perform(agents.enemies[i]);

        let enemy = new Enemy({
          agent: mirageEnemyAgent,
          mapService: this.mapService,
          camera: this.camera,
          game: this.game,
          transportService: this,
          gameboard: this.gameboard,
        });
        // if (mirageEnemyAgent.travelFlags) {
        //   mirageEnemyAgent.travelFlags.forEach((/*flag*/) => {
        //     // this.game.turnOnAgentTravelAbilityFlag(gameAgent, flag);  // TODO implement
        //   });
        // }
        agentsArray.push(enemy);
        // this.game.agents.push(enemy);
      }
    }

    return {
      player: player,
      agents: agentsArray,
      transports: transportsArray
    };

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

    let targetHex = this.game.mapService.findHexByQR(currentWaypointHex.Q, currentWaypointHex.R);
    // let targetHex = this.game.mapService.findHexByQRS(currentWaypointHex.Q, currentWaypointHex.R, currentWaypointHex.S);

    let path = this.game.mapService.findPathEmberData(this.game.mapService.allHexesMap, agent.hex, targetHex, {agent: agent});
    // let path = this.game.mapService.findPathEmberData(this.game.mapService.worldMap, agent.hex, targetHex);
    // let path = this.game.mapService.findPath(this.game.mapService.worldMap, agent.hex, targetHex);
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
      yield timeout(2000);
      // yield timeout(1000);
      // debugger;

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
  };

  moveTransportToHex(transport, targetHex) {
    transport.hex = targetHex;
    let point = targetHex.point;
    // let point = targetHex.mapObject.point;
    // let point = this.game.mapService.currentLayout.hexToPixel(targetHex);

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
    this.game.gameboard.playerHex = `Q:${targetHex.q} R:${targetHex.r}`;
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
