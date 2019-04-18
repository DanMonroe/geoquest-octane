import Component from '@ember/component';
import move from 'ember-animated/motions/move';

export default Component.extend({
  agents: null,
  hex: null,
  point: null,
  agentImage: null,
  hexLayout: null,
  sightRange: 1,
  speed: null,
  patrol: null,
  currentWaypoint: -1,

  transition: function * ({ keptSprites }) {
    keptSprites.forEach(move);
  },


});

