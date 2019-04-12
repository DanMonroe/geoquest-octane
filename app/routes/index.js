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
              speed: 600,
              patrol: [
                {Q: 0, R: -4, S: 4}, {Q: 4, R: -4, S: 0}, {Q: 1, R: 0, S: -1}, {Q: 4, R: -1, S: -3}, {Q: 0, R: -1, S: 1}
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
            name: 'ship',
            index: 0,
            start: {
              Q: -2,
              R: 3,
              S: -1
            },
            img: "ship.svg",
            sightRange: 5,
            speed: 500,
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
              speed: 600,
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
