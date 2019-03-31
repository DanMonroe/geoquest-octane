import Service from '@ember/service';
import {inject as service} from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class PlayService extends Service {

  @service ('map') mapService;
  @service ('transport') transport;

  @tracked enemyToPlayerDistance = 0;
  @tracked enemyStatus = '';

  onTransportMoved(transport, targetHex) {
    let shipHex = this.transport.transportHexes[0];
    let pathDistanceToShipHex = this.mapService.findPath(this.mapService.twoDimensionalMap, shipHex, targetHex);
    transport.playerDistance = pathDistanceToShipHex.length;

    this.enemyToPlayerDistance = pathDistanceToShipHex.length;
    this.enemyStatus = pathDistanceToShipHex.length <= transport.sightRange ? 'Fight' : 'Patrol';

  }
}
