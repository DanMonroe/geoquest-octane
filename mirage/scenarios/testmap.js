import { Layout } from 'geoquest-octane/objects/layout'
import { Point } from 'geoquest-octane/objects/point'

export default function(server) {

  // FLAGS = {
//   TRAVEL: {
//     SEA: 1,
//     LAND: 2
//   }
// };

  const layout = new Layout({
    orientation: Layout.FLAT,
    size: new Point({x:36, y:41.5}),
    origin: new Point({x:0, y:0})
  });


  // {id: 1,col: 0,row: 0, t: 96, path: {flags: 1, w:0}}
  const hex0_0 = server.create('hex', {layout: layout, col: 0, row: 0, travelFlags: 1, tiles: []});
  const hex1_0 = server.create('hex', {layout: layout, col: 1, row: 0, travelFlags: 1, tiles: []});
  const hex2_0 = server.create('hex', {layout: layout, col: 2, row: 0, travelFlags: 1, tiles: []});
  const hex3_0 = server.create('hex', {layout: layout, col: 3, row: 0, travelFlags: 1, tiles: []});
  const hex4_0 = server.create('hex', {layout: layout, col: 4, row: 0, travelFlags: 1, tiles: []});
  const hex5_0 = server.create('hex', {layout: layout, col: 5, row: 0, travelFlags: 1, tiles: []});
  const hex6_0 = server.create('hex', {layout: layout, col: 6, row: 0, travelFlags: 1, tiles: []});
  const hex7_0 = server.create('hex', {layout: layout, col: 7, row: 0, travelFlags: 1, tiles: []});
  const hex8_0 = server.create('hex', {layout: layout, col: 8, row: 0, travelFlags: 1, tiles: []});
  const hex9_0 = server.create('hex', {layout: layout, col: 9, row: 0, travelFlags: 1, tiles: []});
  const hex10_0 = server.create('hex', {layout: layout, col: 10, row: 0, travelFlags: 1, tiles: []});
  const hex11_0 = server.create('hex', {layout: layout, col: 11, row: 0, travelFlags: 1, tiles: []}); // 12

  const hex0_1 = server.create('hex', {layout: layout, col: 0, row: 1, travelFlags: 1, tiles: []});
  const hex1_1 = server.create('hex', {layout: layout, col: 1, row: 1, travelFlags: 1, tiles: []});
  const hex2_1 = server.create('hex', {layout: layout, col: 2, row: 1, travelFlags: 1, tiles: []});
  // const hex2_1 = server.create('hex', {layout: layout, col: 2, row: 1, travelFlags: 1, sightFlags: 1, tiles: []});
  const hex3_1 = server.create('hex', {layout: layout, col: 3, row: 1, travelFlags: 1, tiles: []});
  const hex4_1 = server.create('hex', {layout: layout, col: 4, row: 1, travelFlags: 1, tiles: []});
  const hex5_1 = server.create('hex', {layout: layout, col: 5, row: 1, travelFlags: 1, tiles: []});
  const hex6_1 = server.create('hex', {layout: layout, col: 6, row: 1, travelFlags: 1, tiles: []});
  const hex7_1 = server.create('hex', {layout: layout, col: 7, row: 1, travelFlags: 1, tiles: []});
  const hex8_1 = server.create('hex', {layout: layout, col: 8, row: 1, travelFlags: 1, tiles: []});
  const hex9_1 = server.create('hex', {layout: layout, col: 9, row: 1, travelFlags: 1, tiles: []});
  const hex10_1 = server.create('hex', {layout: layout, col: 10, row: 1, travelFlags: 1, tiles: []});
  const hex11_1 = server.create('hex', {layout: layout, col: 11, row: 1, travelFlags: 1, tiles: []}); // 24

  const  hex0_2 = server.create('hex', {layout: layout, col: 0, row:  2, travelFlags: 1, tiles: []});
  const  hex1_2 = server.create('hex', {layout: layout, col: 1, row:  2, travelFlags: 1, tiles: []});
  const  hex2_2 = server.create('hex', {layout: layout, col: 2, row:  2, travelFlags: 1, tiles: []});
  const  hex3_2 = server.create('hex', {layout: layout, col: 3, row:  2, travelFlags: 1, tiles: []});
  const  hex4_2 = server.create('hex', {layout: layout, col: 4, row:  2, travelFlags: 1, tiles: []});
  const  hex5_2 = server.create('hex', {layout: layout, col: 5, row:  2, travelFlags: 2, tiles: []});
  const  hex6_2 = server.create('hex', {layout: layout, col: 6, row:  2, travelFlags: 2, tiles: []});
  const  hex7_2 = server.create('hex', {layout: layout, col: 7, row:  2, travelFlags: 2, tiles: []});
  const  hex8_2 = server.create('hex', {layout: layout, col: 8, row:  2, travelFlags: 1, tiles: []});
  const  hex9_2 = server.create('hex', {layout: layout, col: 9, row:  2, travelFlags: 1, tiles: []});
  const hex10_2 = server.create('hex', {layout: layout, col: 10, row: 2, travelFlags: 1, tiles: []});
  const hex11_2 = server.create('hex', {layout: layout, col: 11, row: 2, travelFlags: 1, tiles: []}); // 36

  const  hex0_3 = server.create('hex', {layout: layout, col: 0, row:  3, travelFlags: 1, tiles: []});
  const  hex1_3 = server.create('hex', {layout: layout, col: 1, row:  3, travelFlags: 1, tiles: []});
  const  hex2_3 = server.create('hex', {layout: layout, col: 2, row:  3, travelFlags: 1, tiles: []});
  const  hex3_3 = server.create('hex', {layout: layout, col: 3, row:  3, travelFlags: 2, tiles: []}); // 40
  const  hex4_3 = server.create('hex', {layout: layout, col: 4, row:  3, travelFlags: 2, tiles: []});
  const  hex5_3 = server.create('hex', {layout: layout, col: 5, row:  3, travelFlags: 1, sightFlags: 1, tiles: []});
  const  hex6_3 = server.create('hex', {layout: layout, col: 6, row:  3, travelFlags: 2, tiles: []});
  const  hex7_3 = server.create('hex', {layout: layout, col: 7, row:  3, travelFlags: 2, tiles: []});
  const  hex8_3 = server.create('hex', {layout: layout, col: 8, row:  3, travelFlags: 2, tiles: []});
  const  hex9_3 = server.create('hex', {layout: layout, col: 9, row:  3, travelFlags: 1, tiles: []});
  const hex10_3 = server.create('hex', {layout: layout, col: 10, row: 3, travelFlags: 1, tiles: []});
  const hex11_3 = server.create('hex', {layout: layout, col: 11, row: 3, travelFlags: 1, tiles: []}); // 48

  const  hex0_4 = server.create('hex', {layout: layout, col: 0, row:  4, travelFlags: 1, tiles: []});
  const  hex1_4 = server.create('hex', {layout: layout, col: 1, row:  4, travelFlags: 1, tiles: []}); // 50
  const  hex2_4 = server.create('hex', {layout: layout, col: 2, row:  4, travelFlags: 1, tiles: []});
  const  hex3_4 = server.create('hex', {layout: layout, col: 3, row:  4, travelFlags: 2, tiles: []});
  const  hex4_4 = server.create('hex', {layout: layout, col: 4, row:  4, travelFlags: 1, sightFlags: 1, tiles: []});
  const  hex5_4 = server.create('hex', {layout: layout, col: 5, row:  4, travelFlags: 1, sightFlags: 1, tiles: []});
  const  hex6_4 = server.create('hex', {layout: layout, col: 6, row:  4, travelFlags: 1, sightFlags: 1, tiles: []});
  const  hex7_4 = server.create('hex', {layout: layout, col: 7, row:  4, travelFlags: 2, tiles: []});
  const  hex8_4 = server.create('hex', {layout: layout, col: 8, row:  4, travelFlags: 2, tiles: []});
  const  hex9_4 = server.create('hex', {layout: layout, col: 9, row:  4, travelFlags: 2, tiles: []});
  const hex10_4 = server.create('hex', {layout: layout, col: 10, row: 4, travelFlags: 1, tiles: []});
  const hex11_4 = server.create('hex', {layout: layout, col: 11, row: 4, travelFlags: 1, tiles: []}); // 60

  const  hex0_5 = server.create('hex', {layout: layout, col: 0, row:  5, travelFlags: 1, tiles: []});
  const  hex1_5 = server.create('hex', {layout: layout, col: 1, row:  5, travelFlags: 1, tiles: []});
  const  hex2_5 = server.create('hex', {layout: layout, col: 2, row:  5, travelFlags: 1, tiles: []});
  const  hex3_5 = server.create('hex', {layout: layout, col: 3, row:  5, travelFlags: 2, tiles: []});
  const  hex4_5 = server.create('hex', {layout: layout, col: 4, row:  5, travelFlags: 1, sightFlags: 1, tiles: []});
  const  hex5_5 = server.create('hex', {layout: layout, col: 5, row:  5, travelFlags: 1, sightFlags: 1, tiles: []});
  const  hex6_5 = server.create('hex', {layout: layout, col: 6, row:  5, travelFlags: 2, sightFlags: 1, tiles: []});
  const  hex7_5 = server.create('hex', {layout: layout, col: 7, row:  5, travelFlags: 2, tiles: []});
  const  hex8_5 = server.create('hex', {layout: layout, col: 8, row:  5, travelFlags: 2, tiles: []});
  const  hex9_5 = server.create('hex', {layout: layout, col: 9, row:  5, travelFlags: 2, tiles: []}); // 70
  const hex10_5 = server.create('hex', {layout: layout, col: 10, row: 5, travelFlags: 1, tiles: []});
  const hex11_5 = server.create('hex', {layout: layout, col: 11, row: 5, travelFlags: 1, tiles: []}); // 72

  const  hex0_6 = server.create('hex', {layout: layout, col: 0, row:  6, travelFlags: 1, tiles: []});
  const  hex1_6 = server.create('hex', {layout: layout, col: 1, row:  6, travelFlags: 1, tiles: []});
  const  hex2_6 = server.create('hex', {layout: layout, col: 2, row:  6, travelFlags: 2, tiles: []});
  const  hex3_6 = server.create('hex', {layout: layout, col: 3, row:  6, travelFlags: 2, tiles: []});
  const  hex4_6 = server.create('hex', {layout: layout, col: 4, row:  6, travelFlags: 2, tiles: []});
  const  hex5_6 = server.create('hex', {layout: layout, col: 5, row:  6, travelFlags: 1, sightFlags: 1, tiles: []});
  const  hex6_6 = server.create('hex', {layout: layout, col: 6, row:  6, travelFlags: 1, sightFlags: 1, tiles: []});
  const  hex7_6 = server.create('hex', {layout: layout, col: 7, row:  6, travelFlags: 2, tiles: []}); // 80
  const  hex8_6 = server.create('hex', {layout: layout, col: 8, row:  6, travelFlags: 2, tiles: []});
  const  hex9_6 = server.create('hex', {layout: layout, col: 9, row:  6, travelFlags: 2, tiles: []});
  const hex10_6 = server.create('hex', {layout: layout, col: 10, row: 6, travelFlags: 1, tiles: []});
  const hex11_6 = server.create('hex', {layout: layout, col: 11, row: 6, travelFlags: 1, tiles: []}); // 84

  const  hex0_7 = server.create('hex', {layout: layout, col: 0, row:  7, travelFlags: 1, tiles: []});
  const  hex1_7 = server.create('hex', {layout: layout, col: 1, row:  7, travelFlags: 1, tiles: []});
  const  hex2_7 = server.create('hex', {layout: layout, col: 2, row:  7, travelFlags: 2, tiles: []});
  const  hex3_7 = server.create('hex', {layout: layout, col: 3, row:  7, travelFlags: 2, tiles: []});
  const  hex4_7 = server.create('hex', {layout: layout, col: 4, row:  7, travelFlags: 1, sightFlags: 1, tiles: []});
  const  hex5_7 = server.create('hex', {layout: layout, col: 5, row:  7, travelFlags: 2, tiles: []}); // 90
  const  hex6_7 = server.create('hex', {layout: layout, col: 6, row:  7, travelFlags: 2, tiles: []});
  const  hex7_7 = server.create('hex', {layout: layout, col: 7, row:  7, travelFlags: 1, tiles: []});
  const  hex8_7 = server.create('hex', {layout: layout, col: 8, row:  7, travelFlags: 2, tiles: []});
  const  hex9_7 = server.create('hex', {layout: layout, col: 9, row:  7, travelFlags: 2, tiles: []});
  const hex10_7 = server.create('hex', {layout: layout, col: 10, row: 7, travelFlags: 1, tiles: []});
  const hex11_7 = server.create('hex', {layout: layout, col: 11, row: 7, travelFlags: 1, tiles: []}); // 96

  const  hex0_8 = server.create('hex', {layout: layout, col: 0, row:  8, travelFlags: 1, tiles: []});
  const  hex1_8 = server.create('hex', {layout: layout, col: 1, row:  8, travelFlags: 1, tiles: []});
  const  hex2_8 = server.create('hex', {layout: layout, col: 2, row:  8, travelFlags: 2, tiles: []});
  const  hex3_8 = server.create('hex', {layout: layout, col: 3, row:  8, travelFlags: 2, tiles: []}); // 100
  const  hex4_8 = server.create('hex', {layout: layout, col: 4, row:  8, travelFlags: 2, tiles: []});
  const  hex5_8 = server.create('hex', {layout: layout, col: 5, row:  8, travelFlags: 2, tiles: []});
  const  hex6_8 = server.create('hex', {layout: layout, col: 6, row:  8, travelFlags: 1, tiles: []});
  const  hex7_8 = server.create('hex', {layout: layout, col: 7, row:  8, travelFlags: 1, tiles: []});
  const  hex8_8 = server.create('hex', {layout: layout, col: 8, row:  8, travelFlags: 1, tiles: []});
  const  hex9_8 = server.create('hex', {layout: layout, col: 9, row:  8, travelFlags: 1, tiles: []});
  const hex10_8 = server.create('hex', {layout: layout, col: 10, row: 8, travelFlags: 1, tiles: []});
  const hex11_8 = server.create('hex', {layout: layout, col: 11, row: 8, travelFlags: 1, tiles: []}); // 108

  const  hex0_9 = server.create('hex', {layout: layout, col: 0, row:  9, travelFlags: 1, tiles: []});
  const  hex1_9 = server.create('hex', {layout: layout, col: 1, row:  9, travelFlags: 1, tiles: []}); // 110
  const  hex2_9 = server.create('hex', {layout: layout, col: 2, row:  9, travelFlags: 1, tiles: []});
  const  hex3_9 = server.create('hex', {layout: layout, col: 3, row:  9, travelFlags: 1, tiles: []});
  const  hex4_9 = server.create('hex', {layout: layout, col: 4, row:  9, travelFlags: 2, tiles: []});
  const  hex5_9 = server.create('hex', {layout: layout, col: 5, row:  9, travelFlags: 1, tiles: []});
  const  hex6_9 = server.create('hex', {layout: layout, col: 6, row:  9, travelFlags: 1, tiles: []});
  const  hex7_9 = server.create('hex', {layout: layout, col: 7, row:  9, travelFlags: 1, tiles: []});
  const  hex8_9 = server.create('hex', {layout: layout, col: 8, row:  9, travelFlags: 1, tiles: []});
  const  hex9_9 = server.create('hex', {layout: layout, col: 9, row:  9, travelFlags: 1, tiles: []});
  const hex10_9 = server.create('hex', {layout: layout, col: 10, row: 9, travelFlags: 1, tiles: []});
  const hex11_9 = server.create('hex', {layout: layout, col: 11, row: 9, travelFlags: 1, tiles: []}); // 120

  const  hex0_10 = server.create('hex', {layout: layout, col: 0, row: 10, travelFlags: 1, tiles: []});
  const  hex1_10 = server.create('hex', {layout: layout, col: 1, row: 10, travelFlags: 1, tiles: []});
  const  hex2_10 = server.create('hex', {layout: layout, col: 2, row: 10, travelFlags: 1, tiles: []});
  const  hex3_10 = server.create('hex', {layout: layout, col: 3, row: 10, travelFlags: 1, tiles: []});
  const  hex4_10 = server.create('hex', {layout: layout, col: 4, row: 10, travelFlags: 1, tiles: []});
  const  hex5_10 = server.create('hex', {layout: layout, col: 5, row: 10, travelFlags: 1, tiles: []});
  const  hex6_10 = server.create('hex', {layout: layout, col: 6, row: 10, travelFlags: 1, tiles: []});
  const  hex7_10 = server.create('hex', {layout: layout, col: 7, row: 10, travelFlags: 1, tiles: []});
  const  hex8_10 = server.create('hex', {layout: layout, col: 8, row: 10, travelFlags: 1, tiles: []});
  const  hex9_10 = server.create('hex', {layout: layout, col: 9, row: 10, travelFlags: 1, tiles: []}); // 130
  const hex10_10 = server.create('hex', {layout: layout, col: 10, row:10, travelFlags: 1, tiles: []});
  const hex11_10 = server.create('hex', {layout: layout, col: 11, row:10, travelFlags: 1, tiles: []}); // 132

  const  hex0_11 = server.create('hex', {layout: layout, col: 0, row: 11, travelFlags: 1, tiles: []});
  const  hex1_11 = server.create('hex', {layout: layout, col: 1, row: 11, travelFlags: 1, tiles: []});
  const  hex2_11 = server.create('hex', {layout: layout, col: 2, row: 11, travelFlags: 1, tiles: []});
  const  hex3_11 = server.create('hex', {layout: layout, col: 3, row: 11, travelFlags: 1, tiles: []});
  const  hex4_11 = server.create('hex', {layout: layout, col: 4, row: 11, travelFlags: 1, tiles: []});
  const  hex5_11 = server.create('hex', {layout: layout, col: 5, row: 11, travelFlags: 1, tiles: []});
  const  hex6_11 = server.create('hex', {layout: layout, col: 6, row: 11, travelFlags: 1, tiles: []});
  const  hex7_11 = server.create('hex', {layout: layout, col: 7, row: 11, travelFlags: 1, tiles: []}); // 140
  const  hex8_11 = server.create('hex', {layout: layout, col: 8, row: 11, travelFlags: 1, tiles: []});
  const  hex9_11 = server.create('hex', {layout: layout, col: 9, row: 11, travelFlags: 1, tiles: []});
  const hex10_11 = server.create('hex', {layout: layout, col: 10, row:11, travelFlags: 1, tiles: []});
  const hex11_11 = server.create('hex', {layout: layout, col: 11, row:11, travelFlags: 1, tiles: []}); // 144

  const hexRow1 = server.create('hex-row', {hexes: [hex0_0, hex1_0, hex2_0, hex3_0, hex4_0, hex5_0, hex6_0, hex7_0, hex8_0, hex9_0, hex10_0, hex11_0]});
  const hexRow2 = server.create('hex-row', {hexes: [hex0_1, hex1_1, hex2_1, hex3_1, hex4_1, hex5_1, hex6_1, hex7_1, hex8_1, hex9_1, hex10_1, hex11_1]});
  const hexRow3 = server.create('hex-row', {hexes: [hex0_2, hex1_2, hex2_2, hex3_2, hex4_2, hex5_2, hex6_2, hex7_2, hex8_2, hex9_2, hex10_2, hex11_2]});
  const hexRow4 = server.create('hex-row', {hexes: [hex0_3, hex1_3, hex2_3, hex3_3, hex4_3, hex5_3, hex6_3, hex7_3, hex8_3, hex9_3, hex10_3, hex11_3]});
  const hexRow5 = server.create('hex-row', {hexes: [hex0_4, hex1_4, hex2_4, hex3_4, hex4_4, hex5_4, hex6_4, hex7_4, hex8_4, hex9_4, hex10_4, hex11_4]});
  const hexRow6 = server.create('hex-row', {hexes: [hex0_5, hex1_5, hex2_5, hex3_5, hex4_5, hex5_5, hex6_5, hex7_5, hex8_5, hex9_5, hex10_5, hex11_5]});
  const hexRow7 = server.create('hex-row', {hexes: [hex0_6, hex1_6, hex2_6, hex3_6, hex4_6, hex5_6, hex6_6, hex7_6, hex8_6, hex9_6, hex10_6, hex11_6]});
  const hexRow8 = server.create('hex-row', {hexes: [hex0_7, hex1_7, hex2_7, hex3_7, hex4_7, hex5_7, hex6_7, hex7_7, hex8_7, hex9_7, hex10_7, hex11_7]});
  const hexRow9 = server.create('hex-row', {hexes: [hex0_8, hex1_8, hex2_8, hex3_8, hex4_8, hex5_8, hex6_8, hex7_8, hex8_8, hex9_8, hex10_8, hex11_8]});
  const hexRow10= server.create('hex-row', {hexes: [hex0_9, hex1_9, hex2_9, hex3_9, hex4_9, hex5_9, hex6_9, hex7_9, hex8_9, hex9_9, hex10_9, hex11_9]});
  const hexRow11= server.create('hex-row', {hexes: [hex0_10, hex1_10, hex2_10, hex3_10, hex4_10, hex5_10, hex6_10, hex7_10, hex8_10, hex9_10, hex10_10, hex11_10]});
  const hexRow12= server.create('hex-row', {hexes: [hex0_11, hex1_11, hex2_11, hex3_11, hex4_11, hex5_11, hex6_11, hex7_11, hex8_11, hex9_11, hex10_11, hex11_11]});


  server.create('map', {
    id: 1,
    layout: layout,

    // layoutHexSizeX: 36,
    // layoutHexSizeY: 41.5,

    name: 'Test Map 1',
    backgroundImage: 'testhex1.png',
    backgroundImageWidth: 612,
    backgroundImageHeight: 828,
    backgroundOffsetX: -8,
    backgroundOffsetY: -35,
    hexRows: [hexRow1,hexRow2,hexRow3,hexRow4,hexRow5,hexRow6,hexRow7,hexRow8,hexRow9,hexRow10,hexRow11,hexRow12]
  });
}
