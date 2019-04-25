import Route from '@ember/routing/route'

import { Map1 } from 'geoquest-octane/objects/maps/map1';
import { Map2 } from 'geoquest-octane/objects/maps/map2';
import { Map3 } from 'geoquest-octane/objects/maps/map3';
import { Map4 } from 'geoquest-octane/objects/maps/map4';
import { Map5 } from 'geoquest-octane/objects/maps/map5'; // rectangular

export default class IndexRoute extends Route {
  model() {
    let data = [
      {
        mapid: 0,
        map: Map1,
        agents: {
          player: {
            name: 'ship',
            index: 0,
            start: {
              Q: 1,
              R: 0,
              S: -1
            },
            img: "ship.svg",
            sightRange: 5,
            speed: 300,
            patrol: []
          },
          game: []
        }
      },
      {
        mapid: 1,
        map: Map2,
        agents: {
          player: {
            name: 'ship',
            index: 0,
            start: {
              Q: 1,
              R: 0,
              S: -1
            },
            img: "ship.svg",
            sightRange: 5,
            speed: 300,
            patrol: []
          },
          game: [
            {
              name: 'galleon',
              index: 1,
              start: {
                Q: 1,
                R: -4,
                S: 3
              },
              img: "galleon.svg",
              sightRange: 3,
              speed: 300,
              patrol: [
                {Q: -1, R: -1, S: 2}, {Q: -2, R: -2, S: 4}, {Q: 0, R: -4, S: 4}, {Q: 2, R: -1, S: -1}, {
                  Q: 4,
                  R: -4,
                  S: 0
                }, {Q: 2, R: -5, S: 3}
              ]
            }
          ]
        }
      },
      {
        mapid: 2,
        map: Map3,
        agents: {
          player: {
            name: 'player',
            index: 0,
            opacity: 0,
            start: {
              Q: 9,
              R: 0,
              S: -9
            },
            img: "pirate.svg",
            imgSize: 32,
            sightRange: 5,
            speed: 500,
            maxHitPoints: 25,
            currentHitPoints: 25,
            maxPower: 50,
            currentPower: 50,
            armor: 2
          },
          enemies: [
            {
              name: 'galleon',
              index: 2,
              start: {
                Q: 18,
                R: -3,
                S: -15
              },
              img: "galleon.svg",
              opacity: 0,
              imgSize: 32,
              sightRange: 3,
              speed: 1600,
              pursuitSpeed: 1000,
              aggressionSpeed: 1000,  // delay time in between aggression turns
              patrolMethod: 'random',
              patrol: [{Q: 16, R: -6, S: -10}, {Q: 19, R: -4, S: -15}, {Q: 20, R: -7, S: -13}, {Q: 15, R: -3, S: -12}],
              maxHitPoints: 25,
              currentHitPoints: 25,
              maxPower: 25,
              currentPower: 25,
              armor: 2,
              weapons: [
                {
                  type: 'cannon',
                  damage: 2,
                  poweruse: 5,
                  accuracy: 80, // percentage 0 (always miss) - 100 (always hit)
                  fireDelay: 1000,
                  reloadDelay: 1500  // lower is faster
                }
              ]
            },

          ],
          transports: [
            {
              name: 'ship',
              index: 3,
              start: {
                Q: 9,
                R: 0,
                S: -9
              },
              img: "ship.svg",
              opacity: 1,
              imgSize: 32,
              sightRange: 3,
              speed: 500,
              maxHitPoints: 25,
              currentHitPoints: 25,
              maxPower: 50,
              currentPower: 50,
              armor: 2,
              weapons: [
                {
                  type: 'cannon',
                  damage: 2,
                  poweruse: 4,
                  accuracy: 80, // percentage 0 (always miss) - 100 (always hit)
                  fireDelay: 1000,
                  reloadDelay: 1500  // lower is faster
                }
              ]
            }
          ]
        }
      },

      {
        mapid: 3,
        map: Map4,
        agents: {
          player: {
            name: 'ship',
            index: 0,
            start: {
              Q: 1,
              R: 0,
              S: -1
            },
            img: "ship.svg",
            sightRange: 3,
            speed: 500,
            patrol: []
          },
          game: []
        }
      },

      {
        mapid: 4,
        map: Map5,
        agents: {
          player: {
            name: 'ship',
            index: 0,
            start: {
              Q: 4,
              R: 0,
              S: -4
            },
            img: "ship.svg",
            sightRange: 3,
            speed: 500,
            patrol: []
          },
          game: []
        }
      }



    ]

    return data;
  }
}

// patrol: [{Q: 16, R: -6, S: -10}, {Q: 19, R: -4, S: -15}, {Q: 20, R: -7, S: -13}, {Q: 15, R: -3, S: -12}],
// patrol: [{Q: 16, R: -6, S: -10}, {Q: 19, R: -4, S: -15}, {Q: 20, R: -7, S: -13}, {Q: 15, R: -3, S: -12}],


// {
//   name: 'galleon2',
//     index: 3,
//   start: {
//   Q: 10,
//     R: 2,
//     S: -12
// },
//   img: "galleon.svg",
//     opacity: 0,
//   imgSize: 32,
//   sightRange: 3,
//   speed: 400,
//   patrolMethod: 'cycle',
//   patrol: [{Q: 4, R: 7, S: -11}, {Q: 16, R: -4, S: -12}, {Q: 7, R: 2, S: -9}],
//   maxHitPoints: 60,
//   currentHitPoints: 25
// }
