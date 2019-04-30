import { Basemap } from './basemap';

export class Map1 extends Basemap {

  static LAYOUT = {
    "type": "pointy",
    "hexSize": 24
  };

  static TILEIMAGES = [
    "ZeshioHexKitDemo_096.png", // water
    "ZeshioHexKitDemo_104.png"  // sand
  ];

  static MAP = [
    [
      {id: 1, col: 0, row: 0, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} },
      {id: 5, col: 1, row: 0, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} }
    ],
    [
      {id: 2, col: 0, row: 1, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} },
      {id: 6, col: 1, row: 1, t: 1, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} }
    ],
    [
      {id: 3, col: 0, row: 2, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} },
      {id: 7, col: 1, row: 2, t: 1, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} }
    ],
    [
      {id: 4, col: 0, row: 3, t: 0, path: {f:0, g:0, h:0, w:1, visited:false, closed:false, parent:null} },
      {id: 8, col: 1, row: 3, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null} }
    ]
  ];
}
