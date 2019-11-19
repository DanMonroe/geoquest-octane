import Service from '@ember/service';
import {inject as service} from '@ember/service';
import {task} from 'ember-concurrency-decorators';

export default class ApiService extends Service {
    @service ('store') store;

    @task
    *loadPlayer(playerId) {
      return yield this.store.findRecord('player', playerId, {
        include: 'weapons'
      });
    };

    @task
    *loadTransport(transportId) {
      return yield this.store.findRecord('transport', transportId, {
        include: 'weapons'
      });
    };

    @task
    *loadEnemy(enemyId) {
      return yield this.store.findRecord('enemy', enemyId, {
        include: 'weapons'
      });
    };
}
