import { Basemap } from './basemap';

export class Map1 extends Basemap {

  static TILEIMAGES = [
    "ZeshioHexKitDemo_096.png", // water
    "ZeshioHexKitDemo_104.png",  // sand
    "ZeshioHexKitDemo_000.png", // lava
    "ZeshioHexKitDemo_005.png", // cool lava rock
    "ZeshioHexKitDemo_023.png",
    "ZeshioHexKitDemo_047.png",
    "ZeshioHexKitDemo_102.png", // palm trees
  ];

  static MAP = [
      [
        null,
        null,
        null,
        {id: 21, col: 3, row: 0, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} },
        {id: 28, col: 4, row: 0, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} },
        {id: 35, col: 5, row: 0, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} },
        {id: 42, col: 6, row: 0, t: 1, path: {f:0, g:0, h:0, w:1, visited:false, closed:false, parent:null} },
      ],

      [
        null,
        null,
        {id: 15, col: 2, row: 1, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} },
        {id: 22, col: 3, row: 1, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} },
        {id: 29, col: 4, row: 1, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} },
        {id: 36, col: 5, row: 1, t: 1, path: {f:0, g:0, h:0, w:1, visited:false, closed:false, parent:null} },
        {id: 43, col: 6, row: 1, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} },
      ],

      [
        null,
        {id: 9, col: 1, row: 2, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} },
        {id: 16, col: 2, row: 2, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} },
        {id: 23, col: 3, row: 2, t: 6, path: {f:0, g:0, h:0, w:1, visited:false, closed:false, parent:null} },
        {id: 30, col: 4, row: 2, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} },
        {id: 37, col: 5, row: 2, t: 1, path: {f:0, g:0, h:0, w:1, visited:false, closed:false, parent:null} },
        {id: 44, col: 6, row: 2, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} },
      ],

      [
        {id: 3, col: 0, row: 3, t: 5, path: {f:0, g:0, h:0, w:1, visited:false, closed:false, parent:null} },
        {id: 10, col: 1, row: 3, t: 2, path: {f:0, g:0, h:0, w:1, visited:false, closed:false, parent:null} },
        {id: 17, col: 2, row: 3, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} },
        {id: 24, col: 3, row: 3, t: 1, path: {f:0, g:0, h:0, w:1, visited:false, closed:false, parent:null} },
        {id: 31, col: 4, row: 3, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} },
        {id: 38, col: 5, row: 3, t: 6, path: {f:0, g:0, h:0, w:1, visited:false, closed:false, parent:null} },
        {id: 45, col: 6, row: 3, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} },
      ],

      [
        {id: 4, col: 0, row: 4, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} },
        {id: 11, col: 1, row: 4, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} },
        {id: 18, col: 2, row: 4, t: 2, path: {f:0, g:0, h:0, w:1, visited:false, closed:false, parent:null} },
        {id: 25, col: 3, row: 4, t: 3, path: {f:0, g:0, h:0, w:1, visited:false, closed:false, parent:null} },
        {id: 32, col: 4, row: 4, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} },
        {id: 39, col: 5, row: 4, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} },
        null
      ],

      [
        {id: 5, col: 0, row: 5, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} },
        {id: 12, col: 1, row: 5, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} },
        {id: 19, col: 2, row: 5, t: 4, path: {f:0, g:0, h:0, w:1, visited:false, closed:false, parent:null} },
        {id: 26, col: 3, row: 5, t: 2, path: {f:0, g:0, h:0, w:1, visited:false, closed:false, parent:null} },
        {id: 33, col: 4, row: 5, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} },
        null,
        null
      ],

      [
        {id: 6, col: 0, row: 6, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} },
        {id: 13, col: 1, row: 6, t: 1, path: {f:0, g:0, h:0, w:1, visited:false, closed:false, parent:null} },
        {id: 20, col: 2, row: 6, t: 2, path: {f:0, g:0, h:0, w:1, visited:false, closed:false, parent:null} },
        {id: 27, col: 3, row: 6, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} },
        null,
        null,
        null
      ]

    ];
}
