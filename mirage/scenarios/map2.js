export default function(server, water1, sand1) {

  // FLAGS = {
//   TRAVEL: {
//     SEA: 1,
//     LAND: 2
//   }
// };

  // {id: 1,col: 0,row: 0, t: 96, path: {flags: 1, w:0}}
  const hex0_0 = server.create('hex', {col: 0, row: 0, travelFlags: 1, tiles: [water1]});
  const hex1_0 = server.create('hex', {col: 1, row: 0, travelFlags: 1, tiles: [water1]});
  const hex2_0 = server.create('hex', {col: 2, row: 0, travelFlags: 1, tiles: [water1]});
  const hex3_0 = server.create('hex', {col: 3, row: 0, travelFlags: 1, tiles: [water1]});
  const hex4_0 = server.create('hex', {col: 4, row: 0, travelFlags: 1, tiles: [water1]});
  const hex5_0 = server.create('hex', {col: 5, row: 0, travelFlags: 1, tiles: [water1]});
  const hex6_0 = server.create('hex', {col: 6, row: 0, travelFlags: 1, tiles: [water1]});
  const hex7_0 = server.create('hex', {col: 7, row: 0, travelFlags: 1, tiles: [water1]});
  const hex8_0 = server.create('hex', {col: 8, row: 0, travelFlags: 1, tiles: [water1]});
  const hex9_0 = server.create('hex', {col: 9, row: 0, travelFlags: 1, tiles: [water1]});
  const hex10_0 = server.create('hex', {col: 10, row: 0, travelFlags: 1, tiles: [water1]});
  const hex11_0 = server.create('hex', {col: 11, row: 0, travelFlags: 1, tiles: [water1]});
  const hex12_0 = server.create('hex', {col: 12, row: 0, travelFlags: 1, tiles: [water1]});
  const hex13_0 = server.create('hex', {col: 13, row: 0, travelFlags: 1, tiles: [water1]});

  const hex0_1 = server.create('hex', {col: 0, row: 1, travelFlags: 1, tiles: [water1]});
  const hex1_1 = server.create('hex', {col: 1, row: 1, travelFlags: 1, tiles: [water1]});
  const hex2_1 = server.create('hex', {col: 2, row: 1, travelFlags: 2, sightFlags: 1, tiles: [sand1]});
  const hex3_1 = server.create('hex', {col: 3, row: 1, travelFlags: 1, tiles: [water1]});
  const hex4_1 = server.create('hex', {col: 4, row: 1, travelFlags: 1, tiles: [water1]});
  const hex5_1 = server.create('hex', {col: 5, row: 1, travelFlags: 1, tiles: [water1]});
  const hex6_1 = server.create('hex', {col: 6, row: 1, travelFlags: 1, tiles: [water1]});
  const hex7_1 = server.create('hex', {col: 7, row: 1, travelFlags: 1, tiles: [water1]});
  const hex8_1 = server.create('hex', {col: 8, row: 1, travelFlags: 1, tiles: [water1]});
  const hex9_1 = server.create('hex', {col: 9, row: 1, travelFlags: 1, tiles: [water1]});
  const hex10_1 = server.create('hex', {col: 10, row: 1, travelFlags: 1, tiles: [water1]});
  const hex11_1 = server.create('hex', {col: 11, row: 1, travelFlags: 1, tiles: [water1]});
  const hex12_1 = server.create('hex', {col: 12, row: 1, travelFlags: 1, tiles: [water1]});
  const hex13_1 = server.create('hex', {col: 13, row: 1, travelFlags: 1, tiles: [water1]});

  const  hex0_2 = server.create('hex', {col: 0, row:  2, travelFlags: 1, tiles: [water1]});
  const  hex1_2 = server.create('hex', {col: 1, row:  2, travelFlags: 1, tiles: [water1]});
  const  hex2_2 = server.create('hex', {col: 2, row:  2, travelFlags: 1, tiles: [water1]});
  const  hex3_2 = server.create('hex', {col: 3, row:  2, travelFlags: 1, tiles: [water1]});
  const  hex4_2 = server.create('hex', {col: 4, row:  2, travelFlags: 1, tiles: [water1]});
  const  hex5_2 = server.create('hex', {col: 5, row:  2, travelFlags: 1, tiles: [water1]});
  const  hex6_2 = server.create('hex', {col: 6, row:  2, travelFlags: 1, tiles: [water1]});
  const  hex7_2 = server.create('hex', {col: 7, row:  2, travelFlags: 1, tiles: [water1]});
  const  hex8_2 = server.create('hex', {col: 8, row:  2, travelFlags: 1, tiles: [water1]});
  const  hex9_2 = server.create('hex', {col: 9, row:  2, travelFlags: 2, sightFlags: 1, tiles: [sand1]});
  const hex10_2 = server.create('hex', {col: 10, row: 2, travelFlags: 1, tiles: [water1]});
  const hex11_2 = server.create('hex', {col: 11, row: 2, travelFlags: 1, tiles: [water1]});
  const hex12_2 = server.create('hex', {col: 12, row: 2, travelFlags: 1, tiles: [water1]});
  const hex13_2 = server.create('hex', {col: 13, row: 2, travelFlags: 1, tiles: [water1]});

  const  hex0_3 = server.create('hex', {col: 0, row:  3, travelFlags: 1, tiles: [water1]});
  const  hex1_3 = server.create('hex', {col: 1, row:  3, travelFlags: 1, tiles: [water1]});
  const  hex2_3 = server.create('hex', {col: 2, row:  3, travelFlags: 1, tiles: [water1]});
  const  hex3_3 = server.create('hex', {col: 3, row:  3, travelFlags: 1, tiles: [water1]});
  const  hex4_3 = server.create('hex', {col: 4, row:  3, travelFlags: 1, tiles: [water1]});
  const  hex5_3 = server.create('hex', {col: 5, row:  3, travelFlags: 1, tiles: [water1]});
  const  hex6_3 = server.create('hex', {col: 6, row:  3, travelFlags: 1, tiles: [water1]});
  const  hex7_3 = server.create('hex', {col: 7, row:  3, travelFlags: 1, tiles: [water1]});
  const  hex8_3 = server.create('hex', {col: 8, row:  3, travelFlags: 1, tiles: [water1]});
  const  hex9_3 = server.create('hex', {col: 9, row:  3, travelFlags: 1, tiles: [water1]});
  const hex10_3 = server.create('hex', {col: 10, row: 3, travelFlags: 1, tiles: [water1]});
  const hex11_3 = server.create('hex', {col: 11, row: 3, travelFlags: 1, tiles: [water1]});
  const hex12_3 = server.create('hex', {col: 12, row: 3, travelFlags: 1, tiles: [water1]});
  const hex13_3 = server.create('hex', {col: 13, row: 3, travelFlags: 1, tiles: [water1]});

  const  hex0_4 = server.create('hex', {col: 0, row:  4, travelFlags: 1, tiles: [water1]});
  const  hex1_4 = server.create('hex', {col: 1, row:  4, travelFlags: 1, tiles: [water1]});
  const  hex2_4 = server.create('hex', {col: 2, row:  4, travelFlags: 1, tiles: [water1]});
  const  hex3_4 = server.create('hex', {col: 3, row:  4, travelFlags: 1, tiles: [water1]});
  const  hex4_4 = server.create('hex', {col: 4, row:  4, travelFlags: 1, tiles: [water1]});
  const  hex5_4 = server.create('hex', {col: 5, row:  4, travelFlags: 2, sightFlags: 1, tiles: [sand1]});
  const  hex6_4 = server.create('hex', {col: 6, row:  4, travelFlags: 1, tiles: [water1]});
  const  hex7_4 = server.create('hex', {col: 7, row:  4, travelFlags: 1, tiles: [water1]});
  const  hex8_4 = server.create('hex', {col: 8, row:  4, travelFlags: 1, tiles: [water1]});
  const  hex9_4 = server.create('hex', {col: 9, row:  4, travelFlags: 1, tiles: [water1]});
  const hex10_4 = server.create('hex', {col: 10, row: 4, travelFlags: 1, tiles: [water1]});
  const hex11_4 = server.create('hex', {col: 11, row: 4, travelFlags: 1, tiles: [water1]});
  const hex12_4 = server.create('hex', {col: 12, row: 4, travelFlags: 1, tiles: [water1]});
  const hex13_4 = server.create('hex', {col: 13, row: 4, travelFlags: 1, tiles: [water1]});

  const  hex0_5 = server.create('hex', {col: 0, row:  5, travelFlags: 1, tiles: [water1]});
  const  hex1_5 = server.create('hex', {col: 1, row:  5, travelFlags: 1, tiles: [water1]});
  const  hex2_5 = server.create('hex', {col: 2, row:  5, travelFlags: 1, tiles: [water1]});
  const  hex3_5 = server.create('hex', {col: 3, row:  5, travelFlags: 1, tiles: [water1]});
  const  hex4_5 = server.create('hex', {col: 4, row:  5, travelFlags: 1, tiles: [water1]});
  const  hex5_5 = server.create('hex', {col: 5, row:  5, travelFlags: 1, tiles: [water1]});
  const  hex6_5 = server.create('hex', {col: 6, row:  5, travelFlags: 1, tiles: [water1]});
  const  hex7_5 = server.create('hex', {col: 7, row:  5, travelFlags: 1, tiles: [water1]});
  const  hex8_5 = server.create('hex', {col: 8, row:  5, travelFlags: 1, tiles: [water1]});
  const  hex9_5 = server.create('hex', {col: 9, row:  5, travelFlags: 1, tiles: [water1]});
  const hex10_5 = server.create('hex', {col: 10, row: 5, travelFlags: 1, tiles: [water1]});
  const hex11_5 = server.create('hex', {col: 11, row: 5, travelFlags: 1, tiles: [water1]});
  const hex12_5 = server.create('hex', {col: 12, row: 5, travelFlags: 2, sightFlags: 1, tiles: [sand1]});
  const hex13_5 = server.create('hex', {col: 13, row: 5, travelFlags: 1, tiles: [water1]});

  const  hex0_6 = server.create('hex', {col: 0, row:  6, travelFlags: 1, tiles: [water1]});
  const  hex1_6 = server.create('hex', {col: 1, row:  6, travelFlags: 1, tiles: [water1]});
  const  hex2_6 = server.create('hex', {col: 2, row:  6, travelFlags: 1, tiles: [water1]});
  const  hex3_6 = server.create('hex', {col: 3, row:  6, travelFlags: 1, tiles: [water1]});
  const  hex4_6 = server.create('hex', {col: 4, row:  6, travelFlags: 1, tiles: [water1]});
  const  hex5_6 = server.create('hex', {col: 5, row:  6, travelFlags: 1, tiles: [water1]});
  const  hex6_6 = server.create('hex', {col: 6, row:  6, travelFlags: 1, tiles: [water1]});
  const  hex7_6 = server.create('hex', {col: 7, row:  6, travelFlags: 1, tiles: [water1]});
  const  hex8_6 = server.create('hex', {col: 8, row:  6, travelFlags: 1, tiles: [water1]});
  const  hex9_6 = server.create('hex', {col: 9, row:  6, travelFlags: 1, tiles: [water1]});
  const hex10_6 = server.create('hex', {col: 10, row: 6, travelFlags: 1, tiles: [water1]});
  const hex11_6 = server.create('hex', {col: 11, row: 6, travelFlags: 1, tiles: [water1]});
  const hex12_6 = server.create('hex', {col: 12, row: 6, travelFlags: 1, tiles: [water1]});
  const hex13_6 = server.create('hex', {col: 13, row: 6, travelFlags: 1, tiles: [water1]});

  const  hex0_7 = server.create('hex', {col: 0, row:  7, travelFlags: 1, tiles: [water1]});
  const  hex1_7 = server.create('hex', {col: 1, row:  7, travelFlags: 1, tiles: [water1]});
  const  hex2_7 = server.create('hex', {col: 2, row:  7, travelFlags: 1, tiles: [water1]});
  const  hex3_7 = server.create('hex', {col: 3, row:  7, travelFlags: 1, tiles: [water1]});
  const  hex4_7 = server.create('hex', {col: 4, row:  7, travelFlags: 1, tiles: [water1]});
  const  hex5_7 = server.create('hex', {col: 5, row:  7, travelFlags: 1, tiles: [water1]});
  const  hex6_7 = server.create('hex', {col: 6, row:  7, travelFlags: 1, tiles: [water1]});
  const  hex7_7 = server.create('hex', {col: 7, row:  7, travelFlags: 1, tiles: [water1]});
  const  hex8_7 = server.create('hex', {col: 8, row:  7, travelFlags: 1, tiles: [water1]});
  const  hex9_7 = server.create('hex', {col: 9, row:  7, travelFlags: 1, tiles: [water1]});
  const hex10_7 = server.create('hex', {col: 10, row: 7, travelFlags: 1, tiles: [water1]});
  const hex11_7 = server.create('hex', {col: 11, row: 7, travelFlags: 1, tiles: [water1]});
  const hex12_7 = server.create('hex', {col: 12, row: 7, travelFlags: 1, tiles: [water1]});
  const hex13_7 = server.create('hex', {col: 13, row: 7, travelFlags: 1, tiles: [water1]});

  const hexRow1 = server.create('hex-row', {hexes: [hex0_0, hex1_0, hex2_0, hex3_0, hex4_0, hex5_0, hex6_0, hex7_0, hex8_0, hex9_0, hex10_0, hex11_0, hex12_0, hex13_0]});
  const hexRow2 = server.create('hex-row', {hexes: [hex0_1, hex1_1, hex2_1, hex3_1, hex4_1, hex5_1, hex6_1, hex7_1, hex8_1, hex9_1, hex10_1, hex11_1, hex12_1, hex13_1]});
  const hexRow3 = server.create('hex-row', {hexes: [hex0_2, hex1_2, hex2_2, hex3_2, hex4_2, hex5_2, hex6_2, hex7_2, hex8_2, hex9_2, hex10_2, hex11_2, hex12_2, hex13_2]});
  const hexRow4 = server.create('hex-row', {hexes: [hex0_3, hex1_3, hex2_3, hex3_3, hex4_3, hex5_3, hex6_3, hex7_3, hex8_3, hex9_3, hex10_3, hex11_3, hex12_3, hex13_3]});
  const hexRow5 = server.create('hex-row', {hexes: [hex0_4, hex1_4, hex2_4, hex3_4, hex4_4, hex5_4, hex6_4, hex7_4, hex8_4, hex9_4, hex10_4, hex11_4, hex12_4, hex13_4]});
  const hexRow6 = server.create('hex-row', {hexes: [hex0_5, hex1_5, hex2_5, hex3_5, hex4_5, hex5_5, hex6_5, hex7_5, hex8_5, hex9_5, hex10_5, hex11_5, hex12_5, hex13_5]});
  const hexRow7 = server.create('hex-row', {hexes: [hex0_6, hex1_6, hex2_6, hex3_6, hex4_6, hex5_6, hex6_6, hex7_6, hex8_6, hex9_6, hex10_6, hex11_6, hex12_6, hex13_6]});
  const hexRow8 = server.create('hex-row', {hexes: [hex0_7, hex1_7, hex2_7, hex3_7, hex4_7, hex5_7, hex6_7, hex7_7, hex8_7, hex9_7, hex10_7, hex11_7, hex12_7, hex13_7]});

  server.create('map', {
    id: 2,
    name: 'Data Map 2Z',
    hexRows: [hexRow1,hexRow2,hexRow3,hexRow4,hexRow5,hexRow6,hexRow7,hexRow8]
  });
}
