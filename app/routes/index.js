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
        map: Map2,
        sounds: []
      },

      {
        mapid: 1,
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
            sightRange: 4,
            speed: 500,
            maxHitPoints: 25,
            currentHitPoints: 25,
            maxPower: 50,
            currentPower: 50,
            healingSpeed: 10000,
            healingPower: 1,
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
              speed: 2000,
              pursuitSpeed: 1500,
              aggressionSpeed: 1500,  // delay time in between aggression turns
              respawnTime: 10000,
              patrolMethod: 'random',
              patrol: [{Q: 16, R: -6, S: -10}, {Q: 19, R: -4, S: -15}, {Q: 20, R: -7, S: -13}, {Q: 15, R: -3, S: -12}],
              maxHitPoints: 25,
              currentHitPoints: 5,
              maxPower: 25,
              currentPower: 25,
              healingSpeed: 16000,
              healingPower: 1,
              armor: 2,
              weapons: [
                {
                  minDistanceForHit: 10,
                  type: 'cannon',
                  damage: 2.5,
                  speed: 3, // projectile speed
                  poweruse: 5,
                  accuracy: 0.05, // percentage 0 (always accurate) - 1 (shoot any direction)
                  fireDelay: 1500,
                  reloadDelay: 1500  // lower is faster
                }
              ]
            },
            {
              name: 'tower',
              index: 3,
              start: {
                Q: 11,
                R: -5,
                S: -6
              },
              img: "roundtower.svg",
              opacity: 0,
              imgSize: 32,
              sightRange: 3,
              speed: 1600,
              pursuitSpeed: 1000,
              aggressionSpeed: 1000,  // delay time in between aggression turns
              respawnTime: 10000,
              patrolMethod: 'static',
              patrol: [],
              maxHitPoints: 25,
              currentHitPoints: 5,
              maxPower: 25,
              currentPower: 125,
              healingSpeed: 16000,
              healingPower: 1,
              armor: 2,
              weapons: [
                {
                  minDistanceForHit: 20,
                  type: 'arrow',
                  damage: 1,
                  speed: 8, // projectile speed
                  poweruse: 1,
                  accuracy: 0.05, // percentage 0 (always accurate) - 1 (shoot any direction)
                  fireDelay: 300,
                  reloadDelay: 1000  // lower is faster
                }
              ]
            }

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
              respawnTime: 5000,
              maxHitPoints: 25,
              currentHitPoints: 25,
              maxPower: 50,
              currentPower: 50,
              healingSpeed: 12000,
              healingPower: 1,
              armor: 2,
              weapons: [
                {
                  minDistanceForHit: 10,
                  type: 'cannon',
                  sound: 'cannon1',
                  speed: 3, // projectile speed
                  damage: 3,
                  poweruse: 4,
                  accuracy: 0.05, // percentage 0 (always accurate) - 1 (shoot any direction)
                  fireDelay: 1000,
                  reloadDelay: 1500  // lower is faster
                }
              ]
            }
          ]
        },
        sounds: [
          {
            name: 'cannon1',
            file: 'cannon1.mp3'
          },
          {
            name: 'cannon2',
            file: 'cannon2.mp3'
          }
        ]
      },
      {
        mapid: 2,
        map: Map1,
        agents: {
          player: {
            name: 'player',
            index: 0,
            opacity: 0,
            start: {
              Q: 0,
              R: 0,
              S: 0
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

          ],
          transports: [
            {
              name: 'ship',
              index: 3,
              start: {
                Q: 0,
                R: 0,
                S: 0
              },
              img: "ship.svg",
              opacity: 1,
              imgSize: 32,
              sightRange: 3,
              speed: 500,
              respawnTime: 5000,
              maxHitPoints: 25,
              currentHitPoints: 25,
              maxPower: 50,
              currentPower: 50,
              armor: 2,
              weapons: [
                {
                  minDistanceForHit: 10,
                  type: 'cannon',
                  sound: 'cannon2',
                  damage: 2,
                  poweruse: 4,
                  accuracy: 80, // percentage 0 (always miss) - 100 (always hit)
                  fireDelay: 1000,
                  reloadDelay: 1500  // lower is faster
                }
              ]
            }
          ]
        },
        sounds: [
          {
            name: 'cannon1',
            file: 'cannon1.mp3'
          },
          {
            name: 'cannon2',
            file: 'cannon2.mp3'
          }
        ]
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
