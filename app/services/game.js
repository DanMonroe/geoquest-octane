import Service from '@ember/service';
import {inject as service} from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';

export default class GameService extends Service {

  @service ('map') mapService;
  @service ('transport') transport;

  @tracked enemyToPlayerDistance = 0;
  @tracked enemyStatus = '';

  @tracked gameClockEnabled = true;

  @task( function*() {
    while (this.gameClockEnabled === true) {
      yield timeout(1000);
      console.log('game tick');
    }
  }) gameClock;

    onTransportMoved(transport, targetHex) {
    let shipHex = this.transport.transportHexes[0];
    let pathDistanceToShipHex = this.mapService.findPath(this.mapService.worldMap, shipHex, targetHex);
    transport.playerDistance = pathDistanceToShipHex.length;

    this.enemyToPlayerDistance = pathDistanceToShipHex.length;
    this.enemyStatus = pathDistanceToShipHex.length <= transport.sightRange ? 'Fight' : 'Patrol';
  }
}
