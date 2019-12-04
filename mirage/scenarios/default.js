export default function(server) {

  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.
  */

  // server.createList('post', 10);
  let weapon1 = server.create('weapon', {
    id: 1,
    name: 'Bow',
    minDistanceForHit: 20,
    type: 'arrow',
    damage: 1,
    speed: 8, // projectile speed
    poweruse: 1,
    accuracy: 0.04, // percentage 0 (always accurate) - 1 (shoot any direction)
    fireDelay: 300,
    reloadDelay: 1000  // lower is faster
  });
  let weapon2 = server.create('weapon', {
    id: 2,
    name: 'Ship Cannon',
      minDistanceForHit: 10,
    type: 'cannon',
    sound: 'cannon1',
    speed: 3, // projectile speed
    damage: 3,
    poweruse: 4,
    accuracy: 0.05, // percentage 0 (always accurate) - 1 (shoot any direction)
    fireDelay: 1000,
    reloadDelay: 1500  // lower is faster
  });
  let weapon3 = server.create('weapon', {
    id: 3,
    name: 'Galleon Cannon',
    minDistanceForHit: 10,
    type: 'cannon',
    sound: 'cannon2',
    damage: 2.5,
    speed: 3, // projectile speed
    poweruse: 5,
    accuracy: 0.05, // percentage 0 (always accurate) - 1 (shoot any direction)
    fireDelay: 1500,
    reloadDelay: 1500  // lower is faster
  });
  let weapon4 = server.create('weapon', {
    id: 4,
    name: 'Tower Bow',
    minDistanceForHit: 20,
    type: 'arrow',
    damage: 1,
    speed: 8, // projectile speed
    poweruse: 1,
    accuracy: 0.05, // percentage 0 (always accurate) - 1 (shoot any direction)
    fireDelay: 300,
    reloadDelay: 1000  // lower is faster
  });

  let player = server.create('player', {
    id: 1,
    name: 'player',
    index: 0,
    opacity: 1,
    startHex: {
      Q: 6,
      R: 0
    },
    agentImage: "agents/pirate.svg",
    agentImageSize: 32,
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
      {value:2} // LAND
    ],
    weaponIds: [1]
  });

  console.log(player);
  // player.get('weapons').add(weapon1);
  // console.log(player);

  server.create('transport', {
    id: 1,
    type: 2,  // BaseAgent.AGENTTYPES.TRANSPORT;
    // index: 3,
    name: 'ship',
    startHex: {
      Q: 7,
      R: 1
    },
    agentImage: "transports/ship.svg",
    opacity: 1,
    agentImageSize: 32,
    sightRange: 3,
    speed: 500,
    respawnTime: 5000,
    maxHitPoints: 25,
    currentHitPoints: 25,
    healingSpeed: 5000,
    healingPower:  1,
    maxPower: 50,
    currentPower: 50,
    armor: 2,
    weaponIds: [ 2 ]
  });

  server.create('enemy', {
    id: 1,
    name: 'galleon',
    index: 1,
    startHex: {
      Q: 18,
      R: -3,
    },
    agentImage: "transports/galleon.svg",
    opacity: 0,
    agentImageSize: 32,
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
    weaponIds: [ 3 ]
  });
  server.create('enemy', {
    id: 2,
    name: 'tower',
    index: 3,
    startHex: {
      Q: 11,
      R: -5
    },
    agentImage: "agents/roundtower.svg",
    opacity: 0,
    agentImageSize: 32,
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
    weaponIds: [ 4 ]
  });
  server.create('enemy', {
    id: 3,
    name: 'orc',
    index: 1,
    startHex: {
      Q: 11,
      R: -1
    },
    agentImage: "agents/orc.svg",
    opacity: 0,
    agentImageSize: 32,
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
    weaponIds: [ 4 ]
  });

  const water1 = server.create('tile', { name: 'ZeshioHexKitDemo_096.png' });
  const sand1 = server.create('tile', { name: 'ZeshioHexKitDemo_104.png' });

// FLAGS = {
//   TRAVEL: {
//     SEA: 1,
//     LAND: 2
//   }
// };

  // {id: 1,col: 0,row: 0, t: 96, path: {flags: 1, w:0}}
  const hex0_0 = server.create('hex', {col: 0, row: 0, travelFlags: 1});
  const hex1_0 = server.create('hex', {col: 1, row: 0, travelFlags: 1});
  const hex2_0 = server.create('hex', {col: 2, row: 0, travelFlags: 1});
  const hex3_0 = server.create('hex', {col: 3, row: 0, travelFlags: 1});
  hex0_0.update('tiles', [water1]);
  hex1_0.update('tiles', [water1]);
  hex2_0.update('tiles', [water1]);
  hex3_0.update('tiles', [water1]);

  // hex0_0.tiles = [water1];
  // hex0_0.save()
  // hex1_0.tiles = [water1];
  // hex1_0.save()
  // hex2_0.tiles = [water1];
  // hex2_0.save()
  // hex3_0.tiles = [water1];
  // hex3_0.save()

  let hex0_1 = server.create('hex', {col: 0, row: 1, travelFlags: 1, tiles: [water1]});
  let hex1_1 = server.create('hex', {col: 1, row: 1, travelFlags: 1, tiles: [water1]});
  let hex2_1 = server.create('hex', {col: 2, row: 1, travelFlags: 1, tiles: [sand1]});
  let hex3_1 = server.create('hex', {col: 3, row: 1, travelFlags: 1, tiles: [water1]});

  let hex0_2 = server.create('hex', {col: 0, row: 2, travelFlags: 1, tiles: [water1]});
  let hex1_2 = server.create('hex', {col: 1, row: 2, travelFlags: 1, tiles: [water1]});
  let hex2_2 = server.create('hex', {col: 2, row: 2, travelFlags: 1, tiles: [water1]});
  let hex3_2 = server.create('hex', {col: 3, row: 2, travelFlags: 1, tiles: [water1]});

  let hexRow1 = server.create('hex-row', {hexes: [hex0_0, hex1_0, hex2_0, hex3_0]});
  let hexRow2 = server.create('hex-row', {hexes: [hex0_1, hex1_1, hex2_1, hex3_1]});
  let hexRow3 = server.create('hex-row', {hexes: [hex0_2, hex1_2, hex2_2, hex3_2]});

  let map1 = server.create('map', {
    name: 'Data Map 1',
    hexRows: [hexRow1,hexRow2,hexRow3]
  });
  // console.log('hex1', hex1);
}
