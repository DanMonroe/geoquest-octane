// import largetest from './largetest';
import testmap from './testmap';
// import scrolltest from './scrolltest';
import scrolltestsmall from './scrolltestsmall';
// import landsea from './landsea';
// import cave1 from './cave1';

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
    type: 0, // PLAYER:0, ENEMY:1, TRANSPORT:2
    name: 'player',
    index: 0,
    opacity: 1,
    startHex: {
      col: 7,
      row: 3
    },
    agentImage: "/images/agents/pirate.svg",
    agentImageSize: 60,
    sightRange: 2,
    speed: 200,
    maxHitPoints: 25,
    currentHitPoints: 25,
    maxPower: 50,
    currentPower: 50,
    healingSpeed: 10000,
    healingPower: 1,
    armor: 2,
    weaponIds: [1],
    travelFlags: 2,  // 1 SEA, 2 LAND
    sightFlags: 0  // 1 SEA, 2 LAND
  });

  // console.log(player);
  // player.get('weapons').add(weapon1);
  // console.log(player);

  server.create('transport', {
    id: 1,
    type: 2,  // PLAYER:0, ENEMY:1, TRANSPORT:2
    name: 'ship',
    startHex: {
      col: 10,
      row: 8
    },
    agentImage: "/images/transports/ship.svg",
    opacity: 0,
    agentImageSize: 60,
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
    weaponIds: [ 2 ],
    travelFlags: 1,  // 1 SEA, 2 LAND
    sightFlags: 2  // 1 SEA, 2 LAND
  });

  server.create('enemy', {
    id: 1,
    name: 'galleon',
    type: 1, // PLAYER:0, ENEMY:1, TRANSPORT:2
    index: 1,
    startHex: {
      col: 19,
      row: 12,
    },
    agentImage: "/images/transports/galleon.svg",
    opacity: 1,
    agentImageSize: 60,
    sightRange: 3,
    speed: 2000,
    pursuitSpeed: 1500,
    aggressionSpeed: 1500,  // delay time in between aggression turns
    respawnTime: 10000,
    patrolMethod: 'random',
    patrol: [{col:19,row:12},{col:21,row:4}],
    maxHitPoints: 25,
    currentHitPoints: 5,
    maxPower: 25,
    currentPower: 25,
    healingSpeed: 16000,
    healingPower: 1,
    armor: 2,
    weaponIds: [ 3 ],
    travelFlags: 1,  // 1 SEA, 2 LAND
    sightFlags: 0  // 1 SEA, 2 LAND

  });
  // server.create('enemy', {
  //   id: 2,
  //   name: 'tower',
  //   type: 1, // PLAYER:0, ENEMY:1, TRANSPORT:2
  //   index: 3,
  //   startHex: {
  //     Q: 11,
  //     R: -5
  //   },
  //   agentImage: "/images/agents/roundtower.svg",
  //   opacity: 0,
  //   agentImageSize: 32,
  //   sightRange: 3,
  //   speed: 1600,
  //   pursuitSpeed: 1000,
  //   aggressionSpeed: 1000,  // delay time in between aggression turns
  //   respawnTime: 10000,
  //   patrolMethod: 'static',
  //   patrol: [],
  //   maxHitPoints: 25,
  //   currentHitPoints: 5,
  //   maxPower: 25,
  //   currentPower: 125,
  //   healingSpeed: 16000,
  //   healingPower: 1,
  //   armor: 2,
  //   weaponIds: [ 4 ],
  //   travelFlags: 0,  // 1 SEA, 2 LAND
  //   sightFlags: 3  // 1 SEA, 2 LAND
  // });
  // server.create('enemy', {
  //   id: 3,
  //   name: 'orc',
  //   type: 1, // PLAYER:0, ENEMY:1, TRANSPORT:2
  //   index: 1,
  //   startHex: {
  //     Q: 11,
  //     R: -1
  //   },
  //   agentImage: "/images/agents/orc.svg",
  //   opacity: 0,
  //   agentImageSize: 32,
  //   sightRange: 3,
  //   speed: 2000,
  //   pursuitSpeed: 1500,
  //   aggressionSpeed: 1500,  // delay time in between aggression turns
  //   respawnTime: 10000,
  //   patrolMethod: 'random',
  //   patrol: [{Q: 11, R: -1, S: -10}, {Q: 13, R: -2, S: -11}],
  //   maxHitPoints: 25,
  //   currentHitPoints: 5,
  //   maxPower: 25,
  //   currentPower: 25,
  //   healingSpeed: 16000,
  //   healingPower: 1,
  //   armor: 2,
  //   weaponIds: [ 4 ],
  //   travelFlags: 1,  // 1 SEA, 2 LAND
  //   sightFlags: 2  // 1 SEA, 2 LAND
  // });

  // const water1 = server.create('tile', { name: 'ZeshioHexKitDemo_096.png' });
  // const sand1 = server.create('tile', { name: 'ZeshioHexKitDemo_104.png' });

  // landsea(server);
  // cave1(server);

  // scrolltestsmall(server);
  testmap(server);

  // scrolltest(server);
  // largetest(server);


}
