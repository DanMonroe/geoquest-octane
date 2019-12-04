import { Basemap } from './basemap';

export class Map1 extends Basemap {

  static LAYOUT = {
    "type": "flat",
    "hexSize": 24
  };

  static AGENTS = {
    player: {
      id: 1,
      start: {
        Q: 1,
        R: 1
      }
    },

    transports: [],
    enemies: []
  };

  static TILEIMAGES = [
    "ZeshioHexKitDemo_096.png", // water
    "ZeshioHexKitDemo_104.png"  // sand
  ];

  static MAP = [
    [
      {id: 1, col: 0, row: 0, t: 1, path: {w:1, v:0, flags: 0 }},
      {id: 5, col: 1, row: 0, t: 1, path: {w:1, v:0, flags: 0 }}
    ],
    [
      {id: 2, col: 0, row: 1, t: 1, path: {w:1, v:0, flags: 0 }},
      {id: 6, col: 1, row: 1, t: 1, path: {w:1, v:0, flags: 0 }}
    ],
    [
      {id: 3, col: 0, row: 2, t: 1, path: {w:1, v:0, flags: 0 }},
      {id: 7, col: 1, row: 2, t: 1, path: {w:1, v:0, flags: 0 }}
    ],
    [
      {id: 4, col: 0, row: 3, t: 1, path: {w:1, v:0, flags: 0 }},
      {id: 8, col: 1, row: 3, t: 1, path: {w:1, v:0, flags: 0 }}
    ]
  ];
}
