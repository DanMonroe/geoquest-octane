import Service from '@ember/service';
import { Layout } from '../objects/layout'
import { Point } from '../objects/point'
import { inject as service } from '@ember/service';

export default class MapService extends Service {

  @service ('gameboard') gameboard;
  @service ('map') mapService;

  hexMap = null;
  twoDimensionalMap = null;
  tileGraphics = [];
  currentLayout = null;
  tilesLoaded = 0;

  setHexMap(map) {
    this.hexMap = map;
  }

  setTwoDimensionalMap(map) {
    this.twoDimensionalMap = map;
  }

  loadTiles(map, showTileGraphics, showTilesWithLabels) {
    let tileset = map.TILEIMAGES
    // console.log(tileset);

    this.currentLayout = new Layout({
      orientation: Layout.FLAT,
      size: new Point({x:48, y:48}),
      origin: new Point({x:0, y:0})
    });


    let tileGraphicsLoaded = 0;
    for (let i = 0; i < tileset.length; i++) {

      let tileGraphic = new Image();
      tileGraphic.src = tileset[i];
      tileGraphic.onload = () => {
        // Once the image is loaded increment the loaded graphics count and check if all images are ready.
        // console.log(tile, this);

        tileGraphicsLoaded++;

        if (tileGraphicsLoaded === tileset.length) {
          this.tilesLoaded = map.MAP;

          this.gameboard.drawGrid(
            "gamecanvas",
            "hsl(60, 10%, 85%)",
            showTilesWithLabels,
            this.currentLayout,
            this.mapService.hexMap,
            showTileGraphics
          );

        }
      }

      this.tileGraphics.pushObject(tileGraphic);
    }
  }

  getTileGraphic(tileIndex) {
    return this.tileGraphics[tileIndex];
  }
}
