import Service from '@ember/service';
import ENV from 'geoquest-octane/config/environment';
import { inject as service } from '@ember/service';

export default class GameboardService extends Service {

  @service ('map') mapService;

  rect = null;
  centerX = null;
  centerY = null;


  drawGrid(id, backgroundColor, withLabels, layout, hexes, withTiles) {
    var canvas = document.getElementById(id);
    if (!canvas) { return; }
    var ctx = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    ctx.translate(width/2, height/2);

    hexes.forEach((hex) => {
      this.drawHex(ctx, layout, hex);
      if (withLabels) this.drawHexLabel(ctx, layout, hex);
      if (withTiles) this.drawHexTile(ctx, layout, hex);
    });

    if (ENV.game.board.showCenterRect) {
      ctx.fillStyle = "red"
      ctx.fillRect(-3, -3, 6, 6);
    }
  }

  drawHex(ctx, layout, hex, fillStyle) {
    let corners = layout.polygonCorners(hex);
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    if (fillStyle) {
      ctx.fillStyle = fillStyle;
    }
    ctx.moveTo(corners[5].x, corners[5].y);
    for (var i = 0; i < 6; i++) {
      ctx.lineTo(corners[i].x, corners[i].y);
    }
    ctx.stroke();

  }

  drawHexLabel(ctx, layout, hex) {
    var center = layout.hexToPixel(hex);
// console.log('center', center);
    ctx.fillStyle = this.colorForHex(hex);
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // TODO put map t (tile) back in when we add mapp to the hex
    // ctx.fillText((hex.map.id + " " + hex.map.t), center.x, center.y-7);
    ctx.fillText((hex.q + "," + hex.r), center.x, center.y+8);
  }

  drawHexTile(ctx, layout, hex) {

    // if(hex.id >= TILEMAP.length){
    //   return;
    // }
    // let tileIndex = TILEMAP[hex.id];
    // if (!hex.map.t) {
    //   return;
    // }

    let tileGraphic = this.mapService.getTileGraphic(hex.map.t);

    let point = layout.hexToPixel(hex);
    let x = Math.floor(point.x) - 48;
    let y = Math.floor(point.y) - 53;
    // console.log('hex:', hex, 'point:', point, tileGraphic, 'x:', x, 'y:', y);
    ctx.drawImage(tileGraphic , x, y );
  }

  colorForHex(hex) {
    // Match the color style used in the main article
    if (hex.q === 0 && hex.r === 0 && hex.s === 0) {
      return "hsl(0, 50%, 0%)";
    } else if (hex.q === 0) {
      return "hsl(90, 70%, 35%)";
    } else if (hex.r === 0) {
      return "hsl(200, 100%, 35%)";
    } else if (hex.s === 0) {
      return "hsl(300, 40%, 50%)";
    } else {
      return "hsl(0, 0%, 50%)";
    }
  }
}
