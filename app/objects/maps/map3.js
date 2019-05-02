import { Basemap } from './basemap';

export class Map3 extends Basemap {

  static LAYOUT = {
    "type": "flat",
    "hexSize": 24
  };

  static TILEIMAGES = [
    "ZeshioHexKitDemo_096.png", // water
    "ZeshioHexKitDemo_104.png",  // sand
    "ZeshioHexKitDemo_102.png", // palm trees
    "ZeshioHexKitDemo_115.png" // coin

  ];

  static MAP =

[[
{id: 1,col: 0,row: 0, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 11,col: 1,row: 0, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 21,col: 2,row: 0, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 31,col: 3,row: 0, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 41,col: 4,row: 0, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 51,col: 5,row: 0, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 61,col: 6,row: 0, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 71,col: 7,row: 0, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 81,col: 8,row: 0, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 91,col: 9,row: 0, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 101,col: 10,row: 0, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 111,col: 11,row: 0, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:0, visited:false, closed:false, parent:null}}
,{id: 121,col: 12,row: 0, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:0, visited:false, closed:false, parent:null}}
,{id: 131,col: 13,row: 0, t: 2, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 141,col: 14,row: 0, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 151,col: 15,row: 0, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 161,col: 16,row: 0, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 171,col: 17,row: 0, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 181,col: 18,row: 0, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 191,col: 19,row: 0, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 201,col: 20,row: 0, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 211,col: 21,row: 0, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 221,col: 22,row: 0, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 231,col: 23,row: 0, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
],
[
{id: 2,col: 0,row: 1, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 12,col: 1,row: 1, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 22,col: 2,row: 1, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 32,col: 3,row: 1, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 42,col: 4,row: 1, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 52,col: 5,row: 1, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 62,col: 6,row: 1, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 72,col: 7,row: 1, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 82,col: 8,row: 1, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 92,col: 9,row: 1, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 102,col: 10,row: 1, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 112,col: 11,row: 1, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:0, visited:false, closed:false, parent:null}}
,{id: 122,col: 12,row: 1, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:0, visited:false, closed:false, parent:null}}
,{id: 132,col: 13,row: 1, t: 2, path: {f:0, g:0, h:0, flags: 2, w:1, v:0, visited:false, closed:false, parent:null}}
,{id: 142,col: 14,row: 1, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 152,col: 15,row: 1, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 162,col: 16,row: 1, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 172,col: 17,row: 1, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 182,col: 18,row: 1, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 192,col: 19,row: 1, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 202,col: 20,row: 1, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 212,col: 21,row: 1, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 222,col: 22,row: 1, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 232,col: 23,row: 1, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
],
[
{id: 3,col: 0,row: 2, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 13,col: 1,row: 2, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 23,col: 2,row: 2, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 33,col: 3,row: 2, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 43,col: 4,row: 2, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 53,col: 5,row: 2, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 63,col: 6,row: 2, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 73,col: 7,row: 2, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 83,col: 8,row: 2, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 93,col: 9,row: 2, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 103,col: 10,row: 2, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:0, visited:false, closed:false, parent:null}}
,{id: 113,col: 11,row: 2, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:0, visited:false, closed:false, parent:null}}
,{id: 123,col: 12,row: 2, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:0, visited:false, closed:false, parent:null}}
,{id: 133,col: 13,row: 2, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:0, visited:false, closed:false, parent:null}}
,{id: 143,col: 14,row: 2, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 153,col: 15,row: 2, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 163,col: 16,row: 2, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 173,col: 17,row: 2, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 183,col: 18,row: 2, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 193,col: 19,row: 2, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 203,col: 20,row: 2, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 213,col: 21,row: 2, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 223,col: 22,row: 2, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 233,col: 23,row: 2, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
],
[
{id: 4,col: 0,row: 3, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 14,col: 1,row: 3, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 24,col: 2,row: 3, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 34,col: 3,row: 3, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 44,col: 4,row: 3, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 54,col: 5,row: 3, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 64,col: 6,row: 3, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 74,col: 7,row: 3, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 84,col: 8,row: 3, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 94,col: 9,row: 3, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 104,col: 10,row: 3, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:0, visited:false, closed:false, parent:null}}
,{id: 114,col: 11,row: 3, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:0, visited:false, closed:false, parent:null}}
,{id: 124,col: 12,row: 3, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:0, visited:false, closed:false, parent:null}}
,{id: 134,col: 13,row: 3, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:0, visited:false, closed:false, parent:null}}
,{id: 144,col: 14,row: 3, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 154,col: 15,row: 3, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 164,col: 16,row: 3, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 174,col: 17,row: 3, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 184,col: 18,row: 3, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 194,col: 19,row: 3, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 204,col: 20,row: 3, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 214,col: 21,row: 3, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 224,col: 22,row: 3, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 234,col: 23,row: 3, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
],
[
{id: 5,col: 0,row: 4, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 15,col: 1,row: 4, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 25,col: 2,row: 4, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 35,col: 3,row: 4, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 45,col: 4,row: 4, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 55,col: 5,row: 4, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 65,col: 6,row: 4, t: [1,3], props: {dock: true}, path: {f:0, g:0, h:0, flags: 2, w:1, v:0, visited:false, closed:false, parent:null}}
,{id: 75,col: 7,row: 4, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 85,col: 8,row: 4, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 95,col: 9,row: 4, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 105,col: 10,row: 4, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 115,col: 11,row: 4, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 125,col: 12,row: 4, t: [1,3], props: {dock: true}, path: {f:0, g:0, h:0, flags: 2, w:1, v:0, visited:false, closed:false, parent:null}}
,{id: 135,col: 13,row: 4, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 145,col: 14,row: 4, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 155,col: 15,row: 4, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 165,col: 16,row: 4, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 175,col: 17,row: 4, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 185,col: 18,row: 4, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 195,col: 19,row: 4, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 205,col: 20,row: 4, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 215,col: 21,row: 4, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 225,col: 22,row: 4, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 235,col: 23,row: 4, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
],
[
{id: 6,col: 0,row: 5, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 16,col: 1,row: 5, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 26,col: 2,row: 5, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 36,col: 3,row: 5, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 46,col: 4,row: 5, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 56,col: 5,row: 5, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 66,col: 6,row: 5, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 76,col: 7,row: 5, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 86,col: 8,row: 5, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 96,col: 9,row: 5, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 106,col: 10,row: 5, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 116,col: 11,row: 5, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 126,col: 12,row: 5, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 136,col: 13,row: 5, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 146,col: 14,row: 5, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 156,col: 15,row: 5, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 166,col: 16,row: 5, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 176,col: 17,row: 5, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 186,col: 18,row: 5, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 196,col: 19,row: 5, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 206,col: 20,row: 5, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 216,col: 21,row: 5, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 226,col: 22,row: 5, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 236,col: 23,row: 5, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
],
[
{id: 7,col: 0,row: 6, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 17,col: 1,row: 6, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 27,col: 2,row: 6, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 37,col: 3,row: 6, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 47,col: 4,row: 6, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 57,col: 5,row: 6, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 67,col: 6,row: 6, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 77,col: 7,row: 6, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 87,col: 8,row: 6, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 97,col: 9,row: 6, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 107,col: 10,row: 6, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 117,col: 11,row: 6, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 127,col: 12,row: 6, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 137,col: 13,row: 6, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 147,col: 14,row: 6, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 157,col: 15,row: 6, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 167,col: 16,row: 6, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 177,col: 17,row: 6, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 187,col: 18,row: 6, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 197,col: 19,row: 6, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 207,col: 20,row: 6, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 217,col: 21,row: 6, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 227,col: 22,row: 6, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 237,col: 23,row: 6, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
],
[
{id: 8,col: 0,row: 7, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 18,col: 1,row: 7, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 28,col: 2,row: 7, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 38,col: 3,row: 7, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 48,col: 4,row: 7, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 58,col: 5,row: 7, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 68,col: 6,row: 7, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 78,col: 7,row: 7, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 88,col: 8,row: 7, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 98,col: 9,row: 7, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 108,col: 10,row: 7, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 118,col: 11,row: 7, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 128,col: 12,row: 7, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 138,col: 13,row: 7, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 148,col: 14,row: 7, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 158,col: 15,row: 7, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 168,col: 16,row: 7, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 178,col: 17,row: 7, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 188,col: 18,row: 7, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 198,col: 19,row: 7, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 208,col: 20,row: 7, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 218,col: 21,row: 7, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 228,col: 22,row: 7, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 238,col: 23,row: 7, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
],
[
{id: 9,col: 0,row: 8, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 19,col: 1,row: 8, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 29,col: 2,row: 8, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 39,col: 3,row: 8, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 49,col: 4,row: 8, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 59,col: 5,row: 8, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 69,col: 6,row: 8, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 79,col: 7,row: 8, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 89,col: 8,row: 8, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 99,col: 9,row: 8, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 109,col: 10,row: 8, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 119,col: 11,row: 8, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 129,col: 12,row: 8, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 139,col: 13,row: 8, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 149,col: 14,row: 8, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 159,col: 15,row: 8, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 169,col: 16,row: 8, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 179,col: 17,row: 8, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 189,col: 18,row: 8, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 199,col: 19,row: 8, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 209,col: 20,row: 8, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 219,col: 21,row: 8, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 229,col: 22,row: 8, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 239,col: 23,row: 8, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
],
[
{id: 10,col: 0,row: 9, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 20,col: 1,row: 9, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 30,col: 2,row: 9, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 40,col: 3,row: 9, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 50,col: 4,row: 9, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 60,col: 5,row: 9, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 70,col: 6,row: 9, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 80,col: 7,row: 9, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 90,col: 8,row: 9, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 100,col: 9,row: 9, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 110,col: 10,row: 9, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 120,col: 11,row: 9, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 130,col: 12,row: 9, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 140,col: 13,row: 9, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 150,col: 14,row: 9, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 160,col: 15,row: 9, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 170,col: 16,row: 9, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 180,col: 17,row: 9, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 190,col: 18,row: 9, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 200,col: 19,row: 9, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 210,col: 20,row: 9, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
,{id: 220,col: 21,row: 9, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 230,col: 22,row: 9, t: 0, path: {f:0, g:0, h:0, flags: 1, w:0, visited:false, closed:false, parent:null}}
,{id: 240,col: 23,row: 9, t: 1, path: {f:0, g:0, h:0, flags: 2, w:1, v:1, visited:false, closed:false, parent:null}}
],

]
}
