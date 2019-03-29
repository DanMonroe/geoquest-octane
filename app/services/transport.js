import Service from '@ember/service';
import {inject as service} from '@ember/service';
import { A as emberArray } from '@ember/array';
import Ship from '../objects/transports/ship'
// import { Ship } from '../objects/transports/ship'
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';


import ENV from 'geoquest-octane/config/environment';

export default class TransportService extends Service {

  @service ('map') mapService;
  @service ('gameboard') gameboard;

  @tracked ships = emberArray();
  // @tracked shipHex = null;
  // @tracked shipPoint = null;
  // @tracked galleonHex = null;
  // @tracked galleonPoint = null;

  @tracked transportHexes = [];
  @tracked transportPoints = [];

  // TRANSPORTS = {
  //   SHIP: 0,
  //   GALLEON: 1
  // };

  setupShips() {

    ENV.game.transports.forEach((transport) => {
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
        shipImage: transport.img,
        sightRange: transport.sightRange,
        hexLayout: this.mapService.currentLayout,
        mapCenterX: this.gameboard.centerX,
        mapCenterY: this.gameboard.centerY
      });

      this.ships.push(ship);

      console.log(transport.name, ship);
    });

    return this.ships;
    // // SHIP
    // let startShipHex = this.mapService.hexMap.find((hex) => {
    //   return (ENV.game.ship.start.Q === hex.q) &&
    //     (ENV.game.ship.start.R === hex.r) &&
    //     (ENV.game.ship.start.S === hex.s)
    // });
    // console.log('startShipHex', startShipHex);
    //
    // this.transportHexes.push(startShipHex);
    // this.transportPoints.push(this.mapService.currentLayout.hexToPixel(startShipHex));
    //
    // ships.push(Ship.create({
    //   id: this.TRANSPORTS.SHIP,
    //   hex: this.transportHexes[this.TRANSPORTS.SHIP],
    //   point: this.transportPoints[this.TRANSPORTS.SHIP],
    //   shipImage: "images/ship.svg",
    //   sightRange: 4
    // }));

    // GALLEON
  }

  // setupShip() {
  //   let startShipHex = this.mapService.hexMap.find((hex) => {
  //     return (ENV.game.ship.start.Q === hex.q) &&
  //       (ENV.game.ship.start.R === hex.r) &&
  //       (ENV.game.ship.start.S === hex.s)
  //   });
  //   console.log('startShipHex', startShipHex);
  //
  //   this.shipHex = startShipHex;
  //   let shipPoint = this.mapService.currentLayout.hexToPixel(startShipHex)
  //
  //   console.log('shipPoint', shipPoint);
  //   this.shipPoint = shipPoint;
  //
  //   let startGalleonHex = this.mapService.hexMap.find((hex) => {
  //     return (ENV.game.galleon.start.Q === hex.q) &&
  //       (ENV.game.galleon.start.R === hex.r) &&
  //       (ENV.game.galleon.start.S === hex.s)
  //   });
  //   console.log('startGalleonHex', startGalleonHex);
  //
  //   this.galleonHex = startGalleonHex;
  //   let galleonPoint = this.mapService.currentLayout.hexToPixel(startGalleonHex)
  //
  //   console.log('GalleonPoint', galleonPoint);
  //   this.galleonPoint = galleonPoint;
  //
  //   let ships = emberArray();
  //
  //   // ships.push(new Ship({
  //   //   id: 1,
  //   //   mapCenterX: this.gameboard.centerX,
  //   //   mapCenterY: this.gameboard.centerY,
  //   //   hexLayout: this.mapService.currentLayout,
  //   //   hex: this.shipHex,
  //   //   point: this.shipPoint
  //   // }));
  //
  //   ships.push(Ship.create({
  //     id: 1,
  //     mapCenterX: this.gameboard.centerX,
  //     mapCenterY: this.gameboard.centerY,
  //     hexLayout: this.mapService.currentLayout,
  //     hex: this.shipHex,
  //     point: this.shipPoint,
  //     shipImage: "images/ship.svg",
  //     siteRange: 4
  //   }));
  //   // ships.push(Ship.create({
  //   //   id: 1,
  //   //   mapCenterX: this.gameboard.centerX,
  //   //   mapCenterY: this.gameboard.centerY,
  //   //   hexLayout: this.mapService.currentLayout,
  //   //   hex: this.shipHex,
  //   //   point: this.shipPoint
  //   // }));
  //
  //   ships.push(Ship.create({
  //     id: 2,
  //     mapCenterX: this.gameboard.centerX,
  //     mapCenterY: this.gameboard.centerY,
  //     hexLayout: this.mapService.currentLayout,
  //     hex: this.galleonHex,
  //     point: this.galleonPoint,
  //     shipImage: "images/galleon.svg",
  //     siteRange: 3
  //   }));
  //
  //   this.ships = ships;
  // }

  @task(function*(ship, targetHex) {
    // console.log('Moving to', targetHex);
    this.transportHexes[ENV.game.transports[0].index] = targetHex;
    // this.shipHex = targetHex;
    ship.set('hex', targetHex);
    yield timeout(300);
    // console.log('done move');
  }).enqueue() moveShipToHexTask;

  moveShipAlongPath(path) {
    if (path && path.length) {
      // console.log('Moving ship along path', path);
      for (let move = 0, pathLen = path.length; move < pathLen; move++) {
        let nextHex = path[move];
        let ship = this.ships.objectAt(0);
        this.moveShipToHexTask.perform(ship, nextHex);
      }
      // })
      console.log('done');
    }
  }

}
