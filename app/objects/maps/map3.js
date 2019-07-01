import { Basemap } from './basemap';

// path:
// path.h = heuristic path ("smart" shortest distance - only search in directions that are closer to target)
// path.g = g score is the shortest distance from start to current node.
// path.f = neighbor.path.g + neighbor.path.h ??
// path.w = path weight for the node (used for walls, blocking, travel through cost)

// path.v = 1 = sight blocked, 0 not blocked

// flags:
// FLAGS = {
//   TRAVEL: {
//     SEA: 1,
//     LAND: 2
//   }
// };

export class Map3 extends Basemap {

  static LAYOUT = {
    "type": "flat",
    "hexSize": 24
  };

  static AGENTS = {
    player: {
      id: 1,
      start: {
        Q: 6,
        R: 0
      }
    },
    playerPreMirage: {
      name: 'player',
      index: 0,
      opacity: 1,
      start: {
        Q: 6,
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
        // 1 // SEA
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
    transports: [ 1 ],
    transportsPreMirage: [
      {
        name: 'ship',
        index: 3,
        start: {
          Q: 7,
          R: 1
        },
        img: "transports/ship.svg",
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
    ],
    enemies: [ 1, 2 ],
    enemiesPreMirage: [
      {
        name: 'galleon',
        index: 2,
        start: {
          Q: 18,
          R: -3,
          S: -15
        },
        img: "transports/galleon.svg",
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
            sound: 'cannon2',
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
        img: "agents/roundtower.svg",
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
    "ZeshioHexKitDemo_096.png",
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

  static MAP =

[[
{id: 1,col: 0,row: 0, t: 96, path: {flags: 1, w:0}}
,{id: 11,col: 1,row: 0, t: 96, path: {flags: 1, w:0}}
,{id: 21,col: 2,row: 0, t: 96, path: {flags: 1, w:0}}
,{id: 31,col: 3,row: 0, t: 96, path: {flags: 1, w:0}}
,{id: 41,col: 4,row: 0, t: 96, path: {flags: 1, w:0}}
,{id: 51,col: 5,row: 0, t: 96, path: {flags: 1, w:0}}
,{id: 61,col: 6,row: 0, t: 96, path: {flags: 1, w:0}}
,{id: 71,col: 7,row: 0, t: 96, path: {flags: 1, w:0}}
,{id: 81,col: 8,row: 0, t: 96, path: {flags: 1, w:0}}
,{id: 91,col: 9,row: 0, t: 96, path: {flags: 1, w:0}}
,{id: 101,col: 10,row: 0, t: 96, path: {flags: 1, w:0}}
,{id: 111,col: 11,row: 0, t: 106, path: {flags: 2, w:1, v:0}}
,{id: 121,col: 12,row: 0, t: 106, path: {flags: 2, w:1, v:0}}
,{id: 131,col: 13,row: 0, t: 102, path: {flags: 2, w:1, v:1}}
,{id: 141,col: 14,row: 0, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 151,col: 15,row: 0, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 161,col: 16,row: 0, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 171,col: 17,row: 0, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 181,col: 18,row: 0, t: 96, path: {flags: 1, w:0}}
,{id: 191,col: 19,row: 0, t: 96, path: {flags: 1, w:0}}
,{id: 201,col: 20,row: 0, t: 96, path: {flags: 1, w:0}}
,{id: 211,col: 21,row: 0, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 221,col: 22,row: 0, t: 96, path: {flags: 1, w:0}}
,{id: 231,col: 23,row: 0, t: 96, path: {flags: 1, w:0}}
],
[
{id: 2,col: 0,row: 1, t: 96, path: {flags: 1, w:0}}
,{id: 12,col: 1,row: 1, t: 96, path: {flags: 1, w:0}}
,{id: 22,col: 2,row: 1, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 32,col: 3,row: 1, t: 96, path: {flags: 1, w:0}}
,{id: 42,col: 4,row: 1, t: 96, path: {flags: 1, w:0}}
,{id: 52,col: 5,row: 1, t: 96, path: {flags: 1, w:0}}
,{id: 62,col: 6,row: 1, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 72,col: 7,row: 1, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 82,col: 8,row: 1, t: 96, path: {flags: 1, w:0}}
,{id: 92,col: 9,row: 1, t: 96, path: {flags: 1, w:0}}
,{id: 102,col: 10,row: 1, t: 96, path: {flags: 1, w:0}}
,{id: 112,col: 11,row: 1, t: 106, path: {flags: 2, w:1, v:0}}
,{id: 122,col: 12,row: 1, t: 106, path: {flags: 2, w:1, v:0}}
,{id: 132,col: 13,row: 1, t: 102, path: {flags: 2, w:1, v:0}}
,{id: 142,col: 14,row: 1, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 152,col: 15,row: 1, t: 96, path: {flags: 1, w:0}}
,{id: 162,col: 16,row: 1, t: 96, path: {flags: 1, w:0}}
,{id: 172,col: 17,row: 1, t: 96, path: {flags: 1, w:0}}
,{id: 182,col: 18,row: 1, t: 96, path: {flags: 1, w:0}}
,{id: 192,col: 19,row: 1, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 202,col: 20,row: 1, t: 96, path: {flags: 1, w:0}}
,{id: 212,col: 21,row: 1, t: 96, path: {flags: 1, w:0}}
,{id: 222,col: 22,row: 1, t: 96, path: {flags: 1, w:0}}
,{id: 232,col: 23,row: 1, t: 96, path: {flags: 1, w:0}}
],
[
{id: 3,col: 0,row: 2, t: 96, path: {flags: 1, w:0}}
,{id: 13,col: 1,row: 2, t: 96, path: {flags: 1, w:0}}
,{id: 23,col: 2,row: 2, t: 96, path: {flags: 1, w:0}}
,{id: 33,col: 3,row: 2, t: 96, path: {flags: 1, w:0}}
,{id: 43,col: 4,row: 2, t: 96, path: {flags: 1, w:0}}
,{id: 53,col: 5,row: 2, t: 102, path: {flags: 2, w:1, v:1}}
,{id: 63,col: 6,row: 2, t: 96, path: {flags: 1, w:0}}
,{id: 73,col: 7,row: 2, t: 96, path: {flags: 1, w:0}}
,{id: 83,col: 8,row: 2, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 93,col: 9,row: 2, t: 96, path: {flags: 1, w:0}}
,{id: 103,col: 10,row: 2, t: 106, path: {flags: 2, w:1, v:0}}
,{id: 113,col: 11,row: 2, t: 106, path: {flags: 2, w:1, v:0}}
,{id: 123,col: 12,row: 2, t: 106, path: {flags: 2, w:1, v:0}}
,{id: 133,col: 13,row: 2, t: 106, path: {flags: 2, w:1, v:0}}
,{id: 143,col: 14,row: 2, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 153,col: 15,row: 2, t: 96, path: {flags: 1, w:0}}
,{id: 163,col: 16,row: 2, t: 96, path: {flags: 1, w:0}}
,{id: 173,col: 17,row: 2, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 183,col: 18,row: 2, t: 96, path: {flags: 1, w:0}}
,{id: 193,col: 19,row: 2, t: 96, path: {flags: 1, w:0}}
,{id: 203,col: 20,row: 2, t: 96, path: {flags: 1, w:0}}
,{id: 213,col: 21,row: 2, t: 96, path: {flags: 1, w:0}}
,{id: 223,col: 22,row: 2, t: 96, path: {flags: 1, w:0}}
,{id: 233,col: 23,row: 2, t: 106, path: {flags: 2, w:1, v:1}}
],
[
{id: 4,col: 0,row: 3, t: 96, path: {flags: 1, w:0}}
,{id: 14,col: 1,row: 3, t: 96, path: {flags: 1, w:0}}
,{id: 24,col: 2,row: 3, t: 96, path: {flags: 1, w:0}}
,{id: 34,col: 3,row: 3, t: 96, path: {flags: 1, w:0}}
,{id: 44,col: 4,row: 3, t: 102, path: {flags: 2, w:1, v:1}}
,{id: 54,col: 5,row: 3, t: 109, path: {w:0, v:0, flags: 2}, actions: {b:{id:1},a:{id:2}, loadmap:0}}
,{id: 64,col: 6,row: 3, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 74,col: 7,row: 3, t: 96, path: {flags: 1, w:0}}
,{id: 84,col: 8,row: 3, t: 96, path: {flags: 1, w:0}}
,{id: 94,col: 9,row: 3, t: 96, path: {flags: 1, w:0}}
,{id: 104,col: 10,row: 3, t: 106, path: {flags: 2, w:1, v:0}}
,{id: 114,col: 11,row: 3, t: 106, path: {flags: 2, w:1, v:0}}
,{id: 124,col: 12,row: 3, t: 106, path: {flags: 2, w:1, v:0}}
,{id: 134,col: 13,row: 3, t: 106, path: {flags: 2, w:1, v:0}}
,{id: 144,col: 14,row: 3, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 154,col: 15,row: 3, t: 96, path: {flags: 1, w:0}}
,{id: 164,col: 16,row: 3, t: 96, path: {flags: 1, w:0}}
,{id: 174,col: 17,row: 3, t: 96, path: {flags: 1, w:0}}
,{id: 184,col: 18,row: 3, t: 96, path: {flags: 1, w:0}}
,{id: 194,col: 19,row: 3, t: 96, path: {flags: 1, w:0}}
,{id: 204,col: 20,row: 3, t: 96, path: {flags: 1, w:0}}
,{id: 214,col: 21,row: 3, t: 96, path: {flags: 1, w:0}}
,{id: 224,col: 22,row: 3, t: 96, path: {flags: 1, w:0}}
,{id: 234,col: 23,row: 3, t: 96, path: {flags: 1, w:0}}
],
[
{id: 5,col: 0,row: 4, t: 96, path: {flags: 1, w:0}}
,{id: 15,col: 1,row: 4, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 25,col: 2,row: 4, t: 96, path: {flags: 1, w:0}}
,{id: 35,col: 3,row: 4, t: 96, path: {flags: 1, w:0}}
,{id: 45,col: 4,row: 4, t: 102, path: {flags: 2, w:1, v:1}}
,{id: 55,col: 5,row: 4, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 65,col: 6,row: 4, t: [106,115], props: {dock: true}, path: {flags: 2, w:1, v:0}}
,{id: 75,col: 7,row: 4, t: 96, path: {flags: 1, w:0}}
,{id: 85,col: 8,row: 4, t: 96, path: {flags: 1, w:0}}
,{id: 95,col: 9,row: 4, t: 96, path: {flags: 1, w:0}}
,{id: 105,col: 10,row: 4, t: 96, path: {flags: 1, w:0}}
,{id: 115,col: 11,row: 4, t: 96, path: {flags: 1, w:0}}
,{id: 125,col: 12,row: 4, t: [106,115], props: {dock: true}, path: {flags: 2, w:1, v:0}}
,{id: 135,col: 13,row: 4, t: 96, path: {flags: 1, w:0}}
,{id: 145,col: 14,row: 4, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 155,col: 15,row: 4, t: 96, path: {flags: 1, w:0}}
,{id: 165,col: 16,row: 4, t: 96, path: {flags: 1, w:0}}
,{id: 175,col: 17,row: 4, t: 96, path: {flags: 1, w:0}}
,{id: 185,col: 18,row: 4, t: 96, path: {flags: 1, w:0}}
,{id: 195,col: 19,row: 4, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 205,col: 20,row: 4, t: 96, path: {flags: 1, w:0}}
,{id: 215,col: 21,row: 4, t: 96, path: {flags: 1, w:0}}
,{id: 225,col: 22,row: 4, t: 96, path: {flags: 1, w:0}}
,{id: 235,col: 23,row: 4, t: 96, path: {flags: 1, w:0}}
],
[
{id: 6,col: 0,row: 5, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 16,col: 1,row: 5, t: 96, path: {flags: 1, w:0}}
,{id: 26,col: 2,row: 5, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 36,col: 3,row: 5, t: 96, path: {flags: 1, w:0}}
,{id: 46,col: 4,row: 5, t: 96, path: {flags: 1, w:0}}
,{id: 56,col: 5,row: 5, t: 96, path: {flags: 1, w:0}}
,{id: 66,col: 6,row: 5, t: 96, path: {flags: 1, w:0}}
,{id: 76,col: 7,row: 5, t: 96, path: {flags: 1, w:0}}
,{id: 86,col: 8,row: 5, t: 96, path: {flags: 1, w:0}}
,{id: 96,col: 9,row: 5, t: 96, path: {flags: 1, w:0}}
,{id: 106,col: 10,row: 5, t: 96, path: {flags: 1, w:0}}
,{id: 116,col: 11,row: 5, t: 96, path: {flags: 1, w:0}}
,{id: 126,col: 12,row: 5, t: 96, path: {flags: 1, w:0}}
,{id: 136,col: 13,row: 5, t: 96, path: {flags: 1, w:0}}
,{id: 146,col: 14,row: 5, t: 96, path: {flags: 1, w:0}}
,{id: 156,col: 15,row: 5, t: 96, path: {flags: 1, w:0}}
,{id: 166,col: 16,row: 5, t: 96, path: {flags: 1, w:0}}
,{id: 176,col: 17,row: 5, t: 96, path: {flags: 1, w:0}}
,{id: 186,col: 18,row: 5, t: 96, path: {flags: 1, w:0}}
,{id: 196,col: 19,row: 5, t: 96, path: {flags: 1, w:0}}
,{id: 206,col: 20,row: 5, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 216,col: 21,row: 5, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 226,col: 22,row: 5, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 236,col: 23,row: 5, t: 106, path: {flags: 2, w:1, v:1}}
],
[
{id: 7,col: 0,row: 6, t: 96, path: {flags: 1, w:0}}
,{id: 17,col: 1,row: 6, t: 96, path: {flags: 1, w:0}}
,{id: 27,col: 2,row: 6, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 37,col: 3,row: 6, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 47,col: 4,row: 6, t: 96, path: {flags: 1, w:0}}
,{id: 57,col: 5,row: 6, t: 96, path: {flags: 1, w:0}}
,{id: 67,col: 6,row: 6, t: 96, path: {flags: 1, w:0}}
,{id: 77,col: 7,row: 6, t: 102, path: {flags: 2, w:1, v:1}}
,{id: 87,col: 8,row: 6, t: 96, path: {flags: 1, w:0}}
,{id: 97,col: 9,row: 6, t: 96, path: {flags: 1, w:0}}
,{id: 107,col: 10,row: 6, t: 96, path: {flags: 1, w:0}}
,{id: 117,col: 11,row: 6, t: 96, path: {flags: 1, w:0}}
,{id: 127,col: 12,row: 6, t: 96, path: {flags: 1, w:0}}
,{id: 137,col: 13,row: 6, t: 96, path: {flags: 1, w:0}}
,{id: 147,col: 14,row: 6, t: 96, path: {flags: 1, w:0}}
,{id: 157,col: 15,row: 6, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 167,col: 16,row: 6, t: 96, path: {flags: 1, w:0}}
,{id: 177,col: 17,row: 6, t: 96, path: {flags: 1, w:0}}
,{id: 187,col: 18,row: 6, t: 96, path: {flags: 1, w:0}}
,{id: 197,col: 19,row: 6, t: 96, path: {flags: 1, w:0}}
,{id: 207,col: 20,row: 6, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 217,col: 21,row: 6, t: 96, path: {flags: 1, w:0}}
,{id: 227,col: 22,row: 6, t: 96, path: {flags: 1, w:0}}
,{id: 237,col: 23,row: 6, t: 96, path: {flags: 1, w:0}}
],
[
{id: 8,col: 0,row: 7, t: 96, path: {flags: 1, w:0}}
,{id: 18,col: 1,row: 7, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 28,col: 2,row: 7, t: 96, path: {flags: 1, w:0}}
,{id: 38,col: 3,row: 7, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 48,col: 4,row: 7, t: 96, path: {flags: 1, w:0}}
,{id: 58,col: 5,row: 7, t: 96, path: {flags: 1, w:0}}
,{id: 68,col: 6,row: 7, t: 102, path: {flags: 2, w:1, v:1}}
,{id: 78,col: 7,row: 7, t: 96, path: {flags: 1, w:0}}
,{id: 88,col: 8,row: 7, t: 96, path: {flags: 1, w:0}}
,{id: 98,col: 9,row: 7, t: 96, path: {flags: 1, w:0}}
,{id: 108,col: 10,row: 7, t: 96, path: {flags: 1, w:0}}
,{id: 118,col: 11,row: 7, t: 96, path: {flags: 1, w:0}}
,{id: 128,col: 12,row: 7, t: 96, path: {flags: 1, w:0}}
,{id: 138,col: 13,row: 7, t: 96, path: {flags: 1, w:0}}
,{id: 148,col: 14,row: 7, t: 96, path: {flags: 1, w:0}}
,{id: 158,col: 15,row: 7, t: 96, path: {flags: 1, w:0}}
,{id: 168,col: 16,row: 7, t: 96, path: {flags: 1, w:0}}
,{id: 178,col: 17,row: 7, t: 96, path: {flags: 1, w:0}}
,{id: 188,col: 18,row: 7, t: 96, path: {flags: 1, w:0}}
,{id: 198,col: 19,row: 7, t: 96, path: {flags: 1, w:0}}
,{id: 208,col: 20,row: 7, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 218,col: 21,row: 7, t: 96, path: {flags: 1, w:0}}
,{id: 228,col: 22,row: 7, t: 96, path: {flags: 1, w:0}}
,{id: 238,col: 23,row: 7, t: 106, path: {flags: 2, w:1, v:1}}
],
[
{id: 9,col: 0,row: 8, t: 96, path: {flags: 1, w:0}}
,{id: 19,col: 1,row: 8, t: 96, path: {flags: 1, w:0}}
,{id: 29,col: 2,row: 8, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 39,col: 3,row: 8, t: 96, path: {flags: 1, w:0}}
,{id: 49,col: 4,row: 8, t: 96, path: {flags: 1, w:0}}
,{id: 59,col: 5,row: 8, t: 96, path: {flags: 1, w:0}}
,{id: 69,col: 6,row: 8, t: 96, path: {flags: 1, w:0}}
,{id: 79,col: 7,row: 8, t: 96, path: {flags: 1, w:0}}
,{id: 89,col: 8,row: 8, t: 96, path: {flags: 1, w:0}}
,{id: 99,col: 9,row: 8, t: 96, path: {flags: 1, w:0}}
,{id: 109,col: 10,row: 8, t: 96, path: {flags: 1, w:0}}
,{id: 119,col: 11,row: 8, t: 96, path: {flags: 1, w:0}}
,{id: 129,col: 12,row: 8, t: 96, path: {flags: 1, w:0}}
,{id: 139,col: 13,row: 8, t: 96, path: {flags: 1, w:0}}
,{id: 149,col: 14,row: 8, t: 96, path: {flags: 1, w:0}}
,{id: 159,col: 15,row: 8, t: 96, path: {flags: 1, w:0}}
,{id: 169,col: 16,row: 8, t: 96, path: {flags: 1, w:0}}
,{id: 179,col: 17,row: 8, t: 96, path: {flags: 1, w:0}}
,{id: 189,col: 18,row: 8, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 199,col: 19,row: 8, t: 96, path: {flags: 1, w:0}}
,{id: 209,col: 20,row: 8, t: 96, path: {flags: 1, w:0}}
,{id: 219,col: 21,row: 8, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 229,col: 22,row: 8, t: 96, path: {flags: 1, w:0}}
,{id: 239,col: 23,row: 8, t: 96, path: {flags: 1, w:0}}
],
[
{id: 10,col: 0,row: 9, t: 96, path: {flags: 1, w:0}}
,{id: 20,col: 1,row: 9, t: 96, path: {flags: 1, w:0}}
,{id: 30,col: 2,row: 9, t: 96, path: {flags: 1, w:0}}
,{id: 40,col: 3,row: 9, t: 96, path: {flags: 1, w:0}}
,{id: 50,col: 4,row: 9, t: 96, path: {flags: 1, w:0}}
,{id: 60,col: 5,row: 9, t: 96, path: {flags: 1, w:0}}
,{id: 70,col: 6,row: 9, t: 96, path: {flags: 1, w:0}}
,{id: 80,col: 7,row: 9, t: 96, path: {flags: 1, w:0}}
,{id: 90,col: 8,row: 9, t: 96, path: {flags: 1, w:0}}
,{id: 100,col: 9,row: 9, t: 96, path: {flags: 1, w:0}}
,{id: 110,col: 10,row: 9, t: 96, path: {flags: 1, w:0}}
,{id: 120,col: 11,row: 9, t: 96, path: {flags: 1, w:0}}
,{id: 130,col: 12,row: 9, t: 96, path: {flags: 1, w:0}}
,{id: 140,col: 13,row: 9, t: 96, path: {flags: 1, w:0}}
,{id: 150,col: 14,row: 9, t: 96, path: {flags: 1, w:0}}
,{id: 160,col: 15,row: 9, t: 96, path: {flags: 1, w:0}}
,{id: 170,col: 16,row: 9, t: 96, path: {flags: 1, w:0}}
,{id: 180,col: 17,row: 9, t: 96, path: {flags: 1, w:0}}
,{id: 190,col: 18,row: 9, t: 96, path: {flags: 1, w:0}}
,{id: 200,col: 19,row: 9, t: 96, path: {flags: 1, w:0}}
,{id: 210,col: 20,row: 9, t: 106, path: {flags: 2, w:1, v:1}}
,{id: 220,col: 21,row: 9, t: 96, path: {flags: 1, w:0}}
,{id: 230,col: 22,row: 9, t: 96, path: {flags: 1, w:0}}
,{id: 240,col: 23,row: 9, t: 106, path: {flags: 2, w:1, v:1}}
],

]
}
