import Service from '@ember/service';

export default class ConstantsService extends Service {
  FLAGS = {
    TRAVEL: {
      SEA: {value: 1, description: 'Travel by Sea'},
      LAND: {value: 2, description: 'Travel by Land'},
      AIR: {value: 4, description: 'Travel by Air'},
      IMPASSABLE: {value: 8, description: 'Impassable'}
    },
    SIGHT: {
      IMPASSABLE: {value: 1, description: 'Impassable'}
    },
    SPECIAL: {
      DOCK: {value: 1, description: 'Dock'}
    }
  };

  FLAG_TYPE_TRAVEL = 0;
  FLAG_TYPE_VISIBILITY = 1;

  AGENTTYPES = {
    PLAYER: 0,
    ENEMY: 1,
    TRANSPORT: 2
  };

  // see notes.md
  STATE = {
    IDLE: 0,
    PATROL: 1,
    MELEE: 2,
    MISSILE: 3,
    SEARCHING: 4,
    FLEEING: 5,
    FINDHELP: 6
  };

  PATROLMETHOD = {
    RANDOM: 'random',
    STATIC: 'static'
  }
}
