import Service from '@ember/service';
import {inject as service} from '@ember/service';
import { task } from 'ember-concurrency';

export default class ApiService extends Service {
    @service ('store') store;

    @task( function*(playerId) {
        return yield this.get('store').find('player', playerId);
    }) loadPlayer;

    @task( function*(transportId) {
        return yield this.get('store').find('transport', transportId);
    }) loadTransport;

    @task( function*(enemyId) {
        return yield this.get('store').find('enemy', enemyId);
    }) loadEnemy;
}
