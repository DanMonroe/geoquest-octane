import { Basemap } from './basemap';

// flags:
// FLAGS = {
//   TRAVEL: {
//     SEA: 1,
//     LAND: 2
//   }
// };
export class Map2 extends Basemap {

  static LAYOUT = {
    "type": "flat",
    "hexSize": 24
  };

  static AGENTS = {
    player: {
      id: 1,
      start: {
        Q: 3,
        R: 0
      }
    },
    playerPreMirage: {
      name: 'player',
      index: 0,
      opacity: 1,
      start: {
        Q: 3,
        R: 0
      },
      img: "agents/pirate.svg",
      imgSize: 32,
      sightRange: 4,
      speed: 200,
      maxHitPoints: 25,
      currentHitPoints: 25,
      maxPower: 50,
      currentPower: 50,
      healingSpeed: 10000,
      healingPower: 1,
      armor: 2,
      initialFlags: [
        2 // LAND
      ],
      weapons: [
        {
          minDistanceForHit: 20,
          type: 'arrow',
          damage: 1,
          speed: 8, // projectile speed
          poweruse: 1,
          accuracy: 0.04, // percentage 0 (always accurate) - 1 (shoot any direction)
          fireDelay: 300,
          reloadDelay: 1000  // lower is faster
        }
      ]
    },
    transports: [],
    enemies: [ 3 ],
    enemiesPreMirage: [
      {
          name: 'orc',
          index: 1,
          start: {
            Q: 11,
            R: -1
          },
          img: "agents/orc.svg",
          opacity: 0,
          imgSize: 32,
          sightRange: 3,
          speed: 2000,
          pursuitSpeed: 1500,
          aggressionSpeed: 1500,  // delay time in between aggression turns
          respawnTime: 10000,
          patrolMethod: 'random',
          patrol: [{Q: 11, R: -1, S: -10}, {Q: 13, R: -2, S: -11}],
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
              type: 'arrow',
              damage: 1,
              speed: 8, // projectile speed
              poweruse: 1,
              accuracy: 0.05, // percentage 0 (always accurate) - 1 (shoot any direction)
              fireDelay: 500,
              reloadDelay: 1000  // lower is faster
            }
          ]
        }
      ]
  };

  static TILEIMAGES = [
    "ZeshioHexKitDemo_000.png",
    "ZeshioHexKitDemo_001.png",
    "ZeshioHexKitDemo_002.png",
    "ZeshioHexKitDemo_003.png",
    "ZeshioHexKitDemo_004.png",
    "ZeshioHexKitDemo_005.png",
    "ZeshioHexKitDemo_006.png",
    "ZeshioHexKitDemo_007.png",
    "ZeshioHexKitDemo_008.png",
    "ZeshioHexKitDemo_009.png",
    "ZeshioHexKitDemo_010.png",
    "ZeshioHexKitDemo_011.png",
    "ZeshioHexKitDemo_012.png",
    "ZeshioHexKitDemo_013.png",
    "ZeshioHexKitDemo_014.png",
    "ZeshioHexKitDemo_015.png",
    "ZeshioHexKitDemo_016.png",
    "ZeshioHexKitDemo_017.png",
    "ZeshioHexKitDemo_018.png",
    "ZeshioHexKitDemo_019.png",
    "ZeshioHexKitDemo_020.png",
    "ZeshioHexKitDemo_021.png",
    "ZeshioHexKitDemo_022.png",
    "ZeshioHexKitDemo_023.png",
    "ZeshioHexKitDemo_024.png",
    "ZeshioHexKitDemo_025.png",
    "ZeshioHexKitDemo_026.png",
    "ZeshioHexKitDemo_027.png",
    "ZeshioHexKitDemo_028.png",
    "ZeshioHexKitDemo_029.png",
    "ZeshioHexKitDemo_030.png",
    "ZeshioHexKitDemo_031.png",
    "ZeshioHexKitDemo_032.png",
    "ZeshioHexKitDemo_033.png",
    "ZeshioHexKitDemo_034.png",
    "ZeshioHexKitDemo_035.png",
    "ZeshioHexKitDemo_036.png",
    "ZeshioHexKitDemo_037.png",
    "ZeshioHexKitDemo_038.png",
    "ZeshioHexKitDemo_039.png",
    "ZeshioHexKitDemo_040.png",
    "ZeshioHexKitDemo_041.png",
    "ZeshioHexKitDemo_042.png",
    "ZeshioHexKitDemo_043.png",
    "ZeshioHexKitDemo_044.png",
    "ZeshioHexKitDemo_045.png",
    "ZeshioHexKitDemo_046.png",
    "ZeshioHexKitDemo_047.png",
    "ZeshioHexKitDemo_048.png",
    "ZeshioHexKitDemo_049.png",
    "ZeshioHexKitDemo_050.png",
    "ZeshioHexKitDemo_051.png",
    "ZeshioHexKitDemo_052.png",
    "ZeshioHexKitDemo_053.png",
    "ZeshioHexKitDemo_054.png",
    "ZeshioHexKitDemo_055.png",
    "ZeshioHexKitDemo_056.png",
    "ZeshioHexKitDemo_057.png",
    "ZeshioHexKitDemo_058.png",
    "ZeshioHexKitDemo_059.png",
    "ZeshioHexKitDemo_060.png",
    "ZeshioHexKitDemo_061.png",
    "ZeshioHexKitDemo_062.png",
    "ZeshioHexKitDemo_063.png",
    "ZeshioHexKitDemo_064.png",
    "ZeshioHexKitDemo_065.png",
    "ZeshioHexKitDemo_066.png",
    "ZeshioHexKitDemo_067.png",
    "ZeshioHexKitDemo_068.png",
    "ZeshioHexKitDemo_069.png",
    "ZeshioHexKitDemo_070.png",
    "ZeshioHexKitDemo_071.png",
    "ZeshioHexKitDemo_072.png",
    "ZeshioHexKitDemo_073.png",
    "ZeshioHexKitDemo_074.png",
    "ZeshioHexKitDemo_075.png",
    "ZeshioHexKitDemo_076.png",
    "ZeshioHexKitDemo_077.png",
    "ZeshioHexKitDemo_078.png",
    "ZeshioHexKitDemo_079.png",
    "ZeshioHexKitDemo_080.png",
    "ZeshioHexKitDemo_081.png",
    "ZeshioHexKitDemo_082.png",
    "ZeshioHexKitDemo_083.png",
    "ZeshioHexKitDemo_084.png",
    "ZeshioHexKitDemo_085.png",
    "ZeshioHexKitDemo_086.png",
    "ZeshioHexKitDemo_087.png",
    "ZeshioHexKitDemo_088.png",
    "ZeshioHexKitDemo_089.png",
    "ZeshioHexKitDemo_090.png",
    "ZeshioHexKitDemo_091.png",
    "ZeshioHexKitDemo_092.png",
    "ZeshioHexKitDemo_093.png",
    "ZeshioHexKitDemo_094.png",
    "ZeshioHexKitDemo_095.png",
    "emberconf_water_096.png",
    "ZeshioHexKitDemo_097.png",
    "ZeshioHexKitDemo_098.png",
    "ZeshioHexKitDemo_099.png",
    "ZeshioHexKitDemo_100.png",
    "ZeshioHexKitDemo_101.png",
    "ZeshioHexKitDemo_102.png",
    "ZeshioHexKitDemo_103.png",
    "ZeshioHexKitDemo_104.png",
    "ZeshioHexKitDemo_105.png",
    "ZeshioHexKitDemo_106.png",
    "ZeshioHexKitDemo_107.png",
    "ZeshioHexKitDemo_108.png",
    "ZeshioHexKitDemo_109.png",
    "ZeshioHexKitDemo_110.png",
    "ZeshioHexKitDemo_111.png",
    "ZeshioHexKitDemo_112.png",
    "ZeshioHexKitDemo_113.png",
    "ZeshioHexKitDemo_114.png",
    "ZeshioHexKitDemo_115.png",
    "ZeshioHexKitDemo_116.png",
    "ZeshioHexKitDemo_117.png",
    "ZeshioHexKitDemo_118.png",
    "ZeshioHexKitDemo_119.png",
    "ZeshioHexKitDemo_120.png"
  ];

  //{id: 1,col: 0,row: 0, t: 0, path: {flags: 1, w:0, visited:false, closed:false, parent:null}}
  static MAP =

[[
{id: 1,col: 0,row: 0, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 7,col: 1,row: 0, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 13,col: 2,row: 0, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 19,col: 3,row: 0, t: 109, path: {w:0, v:0, flags: 2}, actions: {b:{id:1},a:{id:2}, loadmap:1}}
,{id: 25,col: 4,row: 0, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 31,col: 5,row: 0, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 37,col: 6,row: 0, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 43,col: 7,row: 0, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 49,col: 8,row: 0, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 55,col: 9,row: 0, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 61,col: 10,row: 0, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 67,col: 11,row: 0, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 73,col: 12,row: 0, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 79,col: 13,row: 0, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 85,col: 14,row: 0, t: 5, path: {w:1, v:1, flags: 0}}
],
[
{id: 2,col: 0,row: 1, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 8,col: 1,row: 1, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 14,col: 2,row: 1, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 20,col: 3,row: 1, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 26,col: 4,row: 1, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 32,col: 5,row: 1, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 38,col: 6,row: 1, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 44,col: 7,row: 1, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 50,col: 8,row: 1, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 56,col: 9,row: 1, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 62,col: 10,row: 1, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 68,col: 11,row: 1, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 74,col: 12,row: 1, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 80,col: 13,row: 1, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 86,col: 14,row: 1, t: 5, path: {w:1, v:1, flags: 0}}
],
[
{id: 3,col: 0,row: 2, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 9,col: 1,row: 2, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 15,col: 2,row: 2, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 21,col: 3,row: 2, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 27,col: 4,row: 2, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 33,col: 5,row: 2, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 39,col: 6,row: 2, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 45,col: 7,row: 2, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 51,col: 8,row: 2, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 57,col: 9,row: 2, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 63,col: 10,row: 2, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 69,col: 11,row: 2, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 75,col: 12,row: 2, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 81,col: 13,row: 2, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 87,col: 14,row: 2, t: 5, path: {w:1, v:1, flags: 0}}
],
[
{id: 4,col: 0,row: 3, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 10,col: 1,row: 3, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 16,col: 2,row: 3, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 22,col: 3,row: 3, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 28,col: 4,row: 3, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 34,col: 5,row: 3, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 40,col: 6,row: 3, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 46,col: 7,row: 3, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 52,col: 8,row: 3, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 58,col: 9,row: 3, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 64,col: 10,row: 3, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 70,col: 11,row: 3, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 76,col: 12,row: 3, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 82,col: 13,row: 3, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 88,col: 14,row: 3, t: 5, path: {w:1, v:1, flags: 0}}
],
[
{id: 5,col: 0,row: 4, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 11,col: 1,row: 4, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 17,col: 2,row: 4, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 23,col: 3,row: 4, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 29,col: 4,row: 4, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 35,col: 5,row: 4, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 41,col: 6,row: 4, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 47,col: 7,row: 4, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 53,col: 8,row: 4, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 59,col: 9,row: 4, t: [106,113], path: {w:0, v:0, flags: 2}, actions: {a:{id:10}, cache:1}}
,{id: 65,col: 10,row: 4, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 71,col: 11,row: 4, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 77,col: 12,row: 4, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 83,col: 13,row: 4, t: 106, path: {w:0, v:0, flags: 2}}
,{id: 89,col: 14,row: 4, t: 5, path: {w:1, v:1, flags: 0}}
],
[
{id: 6,col: 0,row: 5, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 12,col: 1,row: 5, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 18,col: 2,row: 5, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 24,col: 3,row: 5, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 30,col: 4,row: 5, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 36,col: 5,row: 5, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 42,col: 6,row: 5, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 48,col: 7,row: 5, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 54,col: 8,row: 5, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 60,col: 9,row: 5, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 66,col: 10,row: 5, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 72,col: 11,row: 5, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 78,col: 12,row: 5, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 84,col: 13,row: 5, t: 5, path: {w:1, v:1, flags: 0}}
,{id: 90,col: 14,row: 5, t: 5, path: {w:1, v:1, flags: 0}}
],

];

  }
