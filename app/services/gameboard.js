import Service from '@ember/service';
import ENV from 'geoquest-octane/config/environment';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import concrete from 'concretejs';
import { Point } from '../objects/point'

export default class GameboardService extends Service {

  @service ('map') mapService;
  @service ('hex') hexService;
  @service ('transport') transport;

  @tracked rect = null;
  @tracked centerX = null;
  @tracked centerY = null;
  @tracked viewport;

  @tracked pathDistanceToMouseHex = 0;
  @tracked mousePoint;
  @tracked mouseXY;
  @tracked currentHex;

  @tracked showTileGraphics = ENV.game.board.showTileGraphics;
  @tracked showTileHexInfo = false;
  @tracked showTilesWithLabels = true;

  setupGameboardCanvases(concreteContainer, map) {
    // console.log(concreteContainer);

    // Map setup
    this.mapService.set('hexMap', this.hexService.createHexesFromMap(map.MAP));
    this.mapService.set('twoDimensionalMap', map.MAP);

    // create viewport
    let viewport = new concrete.Viewport({
      width: 680,
      height: 650,
      container: concreteContainer
    });

// create layers
    let gameLayer = new concrete.Layer();
    let hexLayer = new concrete.Layer();
    let mouseLayer = new concrete.Layer();

    hexLayer.visible = false;
    // add layers
    viewport.add(gameLayer).add(hexLayer).add(mouseLayer);

    // let gameLayers = [
    //   {
    //     x: viewport.width / 2,
    //     y: viewport.height / 2,
    //     layer: gameLayer,
    //     color: 'tan',
    //     key: 0
    //   },
    //   {
    //     x: viewport.width / 2,
    //     y: viewport.height / 2,
    //     layer: hexLayer,
    //     key: 1
    //   }
    // ];

    this.viewport = viewport;

    let centerX = (viewport.width / 2);
    let centerY = (viewport.height / 2);

    this.set('centerX', centerX);
    this.set('centerY', centerY);

    // this.drawGrid(
    //   "gamecanvas",
    //   "hsl(60, 10%, 85%)",
    //   this.showTilesWithLabels,
    //   this.mapService.currentLayout,
    //   this.mapService.hexMap,
    //   this.showTileGraphics
    // );

    concreteContainer.addEventListener('click', (event) => {
      if (this.viewport) {
        this.hexClick(event)
      }
    });

    concreteContainer.addEventListener('mousemove', (event) => {
      if (this.viewport) {
        this.hexMouseMove(event)
      }
    });
  }

  drawGrid(id, backgroundColor, withLabels, layout, hexes, withTiles) {

    this.viewport.scene.clear();

    var width = this.viewport.width;
    var height = this.viewport.height;

    let hexcontext = this.viewport.layers[1].scene.context;
    hexcontext.translate(width/2, height/2);

    let gamecontext = this.viewport.layers[0].scene.context;
    gamecontext.translate(width/2, height/2);

    hexes.forEach((hex) => {
      this.drawHex(hexcontext, layout, hex);
      if (withLabels) this.drawHexLabel(hexcontext, layout, hex);
      if (withTiles) this.drawHexTile(gamecontext, layout, hex);
    });

    this.viewport.render();

    // var canvas = document.getElementById(id);
    // if (!canvas) { return; }
    // var gamecontext = canvas.getContext('2d');
    // var width = canvas.width;
    // var height = canvas.height;
    //
    // // gamecontext.fillStyle = backgroundColor;
    // // gamecontext.fillRect(0, 0, width, height);
    // gamecontext.translate(width/2, height/2);
    //
    //
    // var hexcanvas = document.getElementById('hexcanvas');
    // var hexcontext = hexcanvas.getContext('2d');
    // hexcontext.translate(width/2, height/2);
    //
    // var mousecanvas = document.getElementById('mousecanvas');
    // var mousecontext = mousecanvas.getContext('2d');
    // mousecontext.translate(width/2, height/2);
    //


    // hexes.forEach((hex) => {
    //   this.drawHex(hexcontext, layout, hex);
    //   if (withLabels) this.drawHexLabel(hexcontext, layout, hex);
    //   if (withTiles) this.drawHexTile(gamecontext, layout, hex);
    // });
    //
    // if (ENV.game.board.showCenterRect) {
    //   hexcontext.fillStyle = "red"
    //   hexcontext.fillRect(-4, -4, 8, 8);
    //
    //   mousecontext.fillStyle = "purple"
    //   mousecontext.fillRect(-3, -3, 6, 6);
    // }

    // ctx.translate(0, 0);
  }

  drawHex(ctx, layout, hex, fillStyle, strokeStyle = "black") {
    let corners = layout.polygonCorners(hex);

    // console.log('corners', corners, hex);
    ctx.beginPath();
    ctx.strokeStyle = strokeStyle;
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
    ctx.fillText((hex.map.id + " " + hex.map.t), center.x, center.y-7);
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


    let point = layout.hexToPixel(hex);
    let x = Math.floor(point.x) - layout.size.x;
    let y = Math.floor(point.y) - layout.size.y - 4;

    let tileGraphics = [];
    if (typeof hex.map.t === 'number') {
      tileGraphics.push(this.mapService.getTileGraphic(hex.map.t));
    } else if(Array.isArray(hex.map.t)) {
      hex.map.t.forEach((tileIndex) => {
        tileGraphics.push(this.mapService.getTileGraphic(tileIndex));
      });
    }
    tileGraphics.forEach((tile) => {
      ctx.drawImage(tile , x, y, (layout.size.x*2)+1, (layout.size.y*2)+1);
    })
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

  hexMouseMove(event) {
    let boundingRect = this.viewport.container.getBoundingClientRect(),
      x = event.clientX - boundingRect.left - this.centerX,
      y = event.clientY - boundingRect.top -this.centerY;

    let point = new Point({x:x, y:y});
    let thisHex = this.mapService.currentLayout.pixelToHex(point).round();

    let targetHex = this.mapService.findHexByQRS(thisHex.q, thisHex.r, thisHex.s);
    let shipHex = this.transport.transportHexes[ENV.game.transports[0].index];

    if(targetHex) {
      let pathDistanceToMouseHex = this.mapService.findPath(this.mapService.twoDimensionalMap, shipHex, targetHex);
      this.pathDistanceToMouseHex = pathDistanceToMouseHex.length;
    } else {
      this.pathDistanceToMouseHex = 0;
    }

    this.mouseXY = `X:${event.clientX} Y:${event.clientY}`;
    this.mousePoint = `X:${point.x} Y:${point.y}`;
    this.currentHex = `Q:${thisHex.q} R:${thisHex.r} S:${thisHex.s}`;
  }

  hexClick(event) {
    // console.groupCollapsed('hex report');

    let boundingRect = this.viewport.container.getBoundingClientRect(),
      x = event.clientX - boundingRect.left - this.centerX,
      y = event.clientY - boundingRect.top -this.centerY;
    let point = new Point({x:x, y:y});
    let clickedHex = this.mapService.currentLayout.pixelToHex(point).round();
    let mappedHex = this.mapService.findHexByQRS(clickedHex.q, clickedHex.r, clickedHex.s);

    // console.log(boundingRect, x, y);
    // console.log('click centerX', this.centerX, 'centerY', this.centerY, event, "x:", x, "y:", y);
    // console.log('clicked point', point);
    // console.log('this.currentLayout', this.mapService.currentLayout);
    // console.log('mappedHex', mappedHex);

    if (mappedHex && mappedHex.id) {
      // move ship
      let shipHex = this.transport.transportHexes[ENV.game.transports[0].index];
      this.transport.moveShipToHexTask.cancelAll();
      let path = this.mapService.findPath(this.mapService.twoDimensionalMap, shipHex, mappedHex);
      this.transport.moveShipAlongPath(path);
    }
    // console.groupEnd();
  }
}
