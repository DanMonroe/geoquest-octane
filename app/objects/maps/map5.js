import { Basemap } from './basemap';

export class Map5 extends Basemap {

  static TILEIMAGES = [
    "ZeshioHexKitDemo_096.png", // water
    "ZeshioHexKitDemo_104.png"  // sand
  ];

  //{id: 210,col: 10,row: 0, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null}}
  static MAP =
    [
      [
        {id: 1, col: 0,row: 0, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null}},
        {id: 4, col: 1,row: 0, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null}},
        {id: 7, col: 2,row: 0, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null}},
        {id: 10,col: 3,row: 0, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null}},
        {id: 13,col: 4,row: 0, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null}},
        {id: 16,col: 5,row: 0, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null}}
      ],
      [
        {id: 2,col: 0,row: 1, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null}},
        {id: 5,col: 1,row: 1, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null}},
        {id: 8,col: 2,row: 1, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null}},
        {id:11,col: 3,row: 1, t: 1, path: {f:0, g:0, h:0, w:1, visited:false, closed:false, parent:null}},
        {id:14,col: 4,row: 1, t: 1, path: {f:0, g:0, h:0, w:1, visited:false, closed:false, parent:null}},
        {id:17,col: 5,row: 1, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null}}
      ],
      [
        {id:3, col: 0,row: 2, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null}},
        {id:6, col: 1,row: 2, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null}},
        {id:9, col: 2,row: 2, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null}},
        {id:12,col: 3,row: 2, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null}},
        {id:15,col: 4,row: 2, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null}},
        {id:18,col: 5,row: 2, t: 0, path: {f:0, g:0, h:0, w:0, visited:false, closed:false, parent:null}}
      ]

    ];
}
