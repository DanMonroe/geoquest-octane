import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class EditorComponent extends Component {
  @service editor;
  @service constants;

  @tracked mapText;
  @tracked mapArray;

  @tracked hexesTextArray;
  @tracked hexRowsTextArray;

  @tracked hexRowIdsArray;

  @tracked finalMap;

  @action
  generateHexes() {
    this.createArrayFromTextarea();
    // console.log('this.mapArray', this.mapArray);
    this.createHexRows();

    console.log('hexesTextArray', this.hexesTextArray);
    console.log('hexRowsTextArray', this.hexRowsTextArray);

    this.createFinalMap();
  }

  createFinalMap() {
    const hexRowsListText = `hexRows: [${this.hexRowIdsArray.join(',')}]`;
    const hexesText = this.hexesTextArray.join('\n');
    const hexRowsText = this.hexRowsTextArray.join('\n');

    const mapSource = `import { Layout } from 'geoquest-octane/objects/layout'
import { Point } from 'geoquest-octane/objects/point'

export default function(server) {
  const layout = new Layout({
    orientation: Layout.FLAT,
    size: new Point({x:36, y:41.75}),
    origin: new Point({x:0, y:0})
  });

${hexesText}

${hexRowsText}

  server.create('map', {
    id: 1,
    layout: layout,
    name: '',
    backgroundImage: '.png',
    backgroundImageWidth: 0,
    backgroundImageHeight: 0,
    backgroundOffsetX: -8,
    backgroundOffsetY: -35,
    ${hexRowsListText}
  });
}
`;
    this.finalMap = mapSource;
  }

  createHexRows() {
    this.hexesTextArray = [];
    this.hexRowsTextArray = [];
    this.hexRowIdsArray = [];
    this.mapArray.forEach((terrainRow, row) => {
      let hexIds = [];
      terrainRow.forEach((terrainText, col) => {
        this.hexesTextArray.push(this.createHexLine(col, row, terrainText));
        hexIds.push(`hex${col}_${row}`);
      });
      const hexListText = hexIds.join(',');
      this.hexRowsTextArray.push(`const hexRow${row} = server.create('hex-row', {hexes: [${hexListText}]});`);
      this.hexRowIdsArray.push(`hexRow${row}`);
    });
  }

  createHexLine(col, row, terrain) {
    const travelFlags = this.getTravelFlags(terrain);
    const sightFlags = this.getSightFlags(terrain);
    const specialFlags = 0;
    let hextext = `const hex${col}_${row} = server.create('hex', {layout: layout, col: ${col}, row: ${row}, wesnoth: "${terrain.replace(/\\/g,"\\\\")}", sightFlags: ${sightFlags}, travelFlags: ${travelFlags}, specialFlags: ${specialFlags}, tiles: []});`;
    return hextext;
  }

  createArrayFromTextarea() {
    let lines = this.mapText.trim().split('\n');
    // this.shiftAndPopArray(lines);

    this.mapArray = [];
    lines.forEach(line => {
      let hexes = line.split(', ');
      // this.shiftAndPopArray(hexes);
      this.mapArray.push(hexes);
    });
  }

  shiftAndPopArray(sourceArray) {
    sourceArray.pop();
    sourceArray.shift();
  }

  WESNOTH = {
    WATER: 'W',
    BRIDGE: 'B',
    UNWALKABLE: 'Q',
    IMPASSABLE: 'X'
  }

  getTravelFlags(terrain) {
    let terrainFlags = 0;

    const terrainParts = this.getWesnothTerrainParts(terrain);

    switch (terrainParts.primary) {
      case this.WESNOTH.WATER:
        switch (terrainParts.secondary) {
          case this.WESNOTH.BRIDGE: // can use land or sea flags to pass through
            terrainFlags |= this.constants.FLAGS.TRAVEL.LAND.value;
            terrainFlags |= this.constants.FLAGS.TRAVEL.SEA.value;
            break;
          default:  // regular water
            terrainFlags |= this.constants.FLAGS.TRAVEL.SEA.value;
            terrainFlags |= this.constants.FLAGS.TRAVEL.AIR.value;
        }
        break;
      case this.WESNOTH.UNWALKABLE:
        switch (terrainParts.secondary) {
          case this.WESNOTH.BRIDGE: // can use land or air flags to pass through
            terrainFlags |= this.constants.FLAGS.TRAVEL.LAND.value;
            terrainFlags |= this.constants.FLAGS.TRAVEL.AIR.value;
            break;
          default:  // fly
            terrainFlags |= this.constants.FLAGS.TRAVEL.AIR.value;
        }
        break;
      case this.WESNOTH.IMPASSABLE:
        debugger;
        terrainFlags |= this.constants.FLAGS.TRAVEL.IMPASSABLE.value;
        break;
      default:
        terrainFlags |= this.constants.FLAGS.TRAVEL.LAND.value;
        terrainFlags |= this.constants.FLAGS.TRAVEL.AIR.value;
    }

    return terrainFlags;
  }

  getSightFlags(terrain) {
    let sightFlags = 0;

    const terrainParts = this.getWesnothTerrainParts(terrain);

    switch (terrainParts.secondary) {
      case this.WESNOTH.IMPASSABLE:
        sightFlags |= this.constants.FLAGS.SIGHT.IMPASSABLE.value;
        break;
      default:
    }

    return sightFlags;
  }

  getWesnothTerrainParts(terrain) {
    const terrainParts = terrain.split('^');
    return {
      primary: (terrainParts.length >= 1) ? terrainParts[0].charAt(0) : '',
      secondary: (terrainParts.length >= 2) ? terrainParts[1].charAt(0) : ''
    };
  }
}
