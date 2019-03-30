import Service from '@ember/service';
import {inject as service} from '@ember/service';
import { A as emberArray } from '@ember/array';
import Ship from '../objects/transports/ship'
// import { Ship } from '../objects/transports/ship'
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';

export default class TransportService extends Service {

  @service ('map') mapService;
  @service ('gameboard') gameboard;

  @tracked ships = emberArray();

  @tracked transportHexes = [];
  @tracked transportPoints = [];

  @tracked moveQueueEnabled = true;
  @tracked moveQueue = emberArray();

  setupShips(transports) {

    this.ships = emberArray();

    transports.forEach((transport) => {
      let startHex = this.mapService.hexMap.find((hex) => {
        return (transport.start.Q === hex.q) &&
          (transport.start.R === hex.r) &&
          (transport.start.S === hex.s)
      });
      // console.log('startHex', startHex);

      let startPoint = this.mapService.currentLayout.hexToPixel(startHex);

      this.transportHexes.push(startHex);
      this.transportPoints.push(startPoint);

      let ship = Ship.create({
        id: transport.index,
        name: transport.name,
        hex: startHex,
        point: startPoint,
        shipImage: `/images/transports/${transport.img}`,
        sightRange: transport.sightRange,
        speed: transport.speed,
        patrol: transport.patrol,
        currentWaypoint: -1,

        hexLayout: this.mapService.currentLayout,
        mapCenterX: this.gameboard.centerX,
        mapCenterY: this.gameboard.centerY
      });

      this.ships.push(ship);

      // console.log(transport.name, ship);
    });

    return this.ships;

  }

  setupPatrols() {
    this.ships.forEach((transport) => {
      if (transport.patrol.length > 0) {
        // console.log(`setting up patrol for ${transport.name}`);

        this.pushTransportWaypointToMoveQueue(transport)
      }
    })
  }

  pushTransportWaypointToMoveQueue(transport) {
    // console.log('pushTransportWaypointToMoveQueue', transport);
    transport.currentWaypoint++;
    if (transport.currentWaypoint >= transport.patrol.length) {
      transport.currentWaypoint = 0;
    }
    let currentWaypointHex = transport.patrol[transport.currentWaypoint];
    let targetHex = this.mapService.findHexByQRS(currentWaypointHex.Q, currentWaypointHex.R, currentWaypointHex.S);
    let transportHex = this.transportHexes[transport.id];
    let path = this.mapService.findPath(this.mapService.twoDimensionalMap, transportHex, targetHex);
    let moveObject = {
      transport: transport,
      path: path,
      finishedCallback: () => {
        // console.log('in move finishedCallback for ' + transport.name);
        this.pushTransportWaypointToMoveQueue(transport);
      }
    }
    this.moveQueue.pushObject(moveObject);

  }

  @task( function*() {
    // console.log('in moveQueue', this.moveQueueEnabled);
    while (this.moveQueueEnabled === true) {
      yield timeout(600);
      // yield timeout(1000);

      if (this.moveQueue.length > 0) {
        // console.log(`found ${this.moveQueue.length} move objects`);
        this.moveQueue.forEach((moveObject) => {
          // console.log(moveObject);

          if (moveObject.path.length > 0) {
            let firstMove = moveObject.path[0]
// console.log(`moving ${moveObject.transport.name} to`, firstMove);
            this.moveTransportTask.perform(moveObject.transport,firstMove);
            moveObject.path.shiftObject();
          } else {
// console.log(`no moves left for moving ${moveObject.transport.name}`);
            if (typeof moveObject.finishedCallback === 'function') {
              moveObject.finishedCallback();
            }
            this.moveQueue.removeObject(moveObject);

          }
        });

      } else {
        // console.log('waiting....');
      }
    }
  }) moveQueueTask;

  @task(function*(transport, targetHex) {

    this.transportHexes[transport.id] = targetHex;

    transport.set('hex', targetHex);

    yield timeout(transport.speed);

  }).enqueue() moveTransportTask;

  @task(function*(ship, targetHex) {
    // let ship = this.ships.objectAt(0);
    // debugger;
    this.transportHexes[ship.id] = targetHex;

    ship.set('hex', targetHex);

    yield timeout(ship.speed);
  }).enqueue() moveShipToHexTask;

  moveShipAlongPath(path) {
    if (path && path.length) {

      // console.log('Moving ship along path', path);
      for (let move = 0, pathLen = path.length; move < pathLen; move++) {
        let nextHex = path[move];
        let ship = this.ships.objectAt(0);
        // this.moveTransportTask.perform(ship, nextHex);
        this.moveShipToHexTask.perform(ship, nextHex);
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
