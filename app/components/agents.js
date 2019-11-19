import Component from '@ember/component';
import move from 'ember-animated/motions/move';
import {task} from 'ember-concurrency-decorators';

export default class AgentsComponent extends Component {
  agents = null;
  hex = null;
  point = null;
  agentImage = null;
  hexLayout = null;
  sightRange = 1;
  speed = null;
  patrol = null;
  currentWaypoint = -1;

  @task
  *transition(context) {
    let { keptSprites } = context;
    yield keptSprites.forEach(move);
  }

}


