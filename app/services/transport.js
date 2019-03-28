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
  @tracked shipHex = null;
  @tracked shipPoint = null;

  setupShip() {
    let startShipHex = this.mapService.hexMap.find((hex) => {
      return (ENV.game.ship.start.Q === hex.q) &&
        (ENV.game.ship.start.R === hex.r) &&
        (ENV.game.ship.start.S === hex.s)
    });
    console.log('startShipHex', startShipHex);

    this.shipHex = startShipHex;
    let shipPoint = this.mapService.currentLayout.hexToPixel(startShipHex)

    console.log('shipPoint', shipPoint);
    this.shipPoint = shipPoint;

    let ships = emberArray();

    // ships.push(new Ship({
    //   id: 1,
    //   mapCenterX: this.gameboard.centerX,
    //   mapCenterY: this.gameboard.centerY,
    //   hexLayout: this.mapService.currentLayout,
    //   hex: this.shipHex,
    //   point: this.shipPoint
    // }));

    ships.push(Ship.create({
      id: 1,
      mapCenterX: this.gameboard.centerX,
      mapCenterY: this.gameboard.centerY,
      hexLayout: this.mapService.currentLayout,
      hex: this.shipHex,
      point: this.shipPoint
    }));
    // ships.push(Ship.create({
    //   id: 1,
    //   mapCenterX: this.gameboard.centerX,
    //   mapCenterY: this.gameboard.centerY,
    //   hexLayout: this.mapService.currentLayout,
    //   hex: this.shipHex,
    //   point: this.shipPoint
    // }));

    this.ships = ships;
  }

  @task(function*(ship, targetHex) {
    // console.log('Moving to', targetHex);
    this.shipHex = targetHex;
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
