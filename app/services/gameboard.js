import Service from '@ember/service';
import ENV from 'geoquest-octane/config/environment';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import concrete from 'concretejs';
import { Point } from '../objects/point'
import { Player } from '../objects/agents/player'
import { Hex } from '../objects/hex'

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


  setupGameboardCanvases(concreteContainer, map, showTileHexInfo, showTileGraphics) {

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

    gameLayer.visible = showTileGraphics;
    hexLayer.visible = showTileHexInfo;
    // add layers
    viewport.add(gameLayer).add(hexLayer).add(mouseLayer);

    this.viewport = viewport;

    // let centerX = (viewport.width / 2);
    // let centerY = (viewport.height / 2);

    this.mapService.set('mapOriginX', 100);
    this.mapService.set('mapOriginY', 100);

    let centerX = 100;
    let centerY = 100;
    this.set('centerX', centerX);  // remove
    this.set('centerY', centerY);  // remove

    this.drawGrid(
      "gamecanvas",
      "hsl(60, 10%, 85%)",
      true,
      this.mapService.currentLayout,
      this.mapService.hexMap,
      true
    );

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
    console.log('hexcontext', hexcontext);
    hexcontext.translate(this.mapService.mapOriginX, this.mapService.mapOriginY);
    // hexcontext.translate(width/2, height/2);

    let gamecontext = this.viewport.layers[0].scene.context;
    gamecontext.translate(this.mapService.mapOriginX, this.mapService.mapOriginY);
    // gamecontext.translate(width/2, height/2);


    // let generatedhexes = this.hexService.makeQDoubledRectangularShape(0, 5, 0, 5);
// console.log('generated hexes', generatedhexes);

    // generatedhexes.forEach((hex) => {
    hexes.forEach((hex) => {
      this.drawHex(hexcontext, layout, hex);
      if (withLabels) this.drawHexLabel(hexcontext, layout, hex);
      if (withTiles) this.drawHexTile(gamecontext, layout, hex);
    });

    this.viewport.render();

  }

  drawHex(ctx, layout, hex, fillStyle, strokeStyle = "black") {
// console.log(hex);
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

    // TODO put map t (tile) back in when we add map to the hex
    ctx.fillText(('id:' + hex.map.id), center.x, center.y-15);
    // ctx.fillText((hex.map.id + " " + hex.map.t), center.x, center.y-7);
    ctx.fillText((hex.col + "," + hex.row), center.x, center.y);
    ctx.fillText((hex.q + "," + hex.r + "," + hex.s), center.x, center.y+15);
    // ctx.fillText((hex.q + "," + hex.r), center.x, center.y+8);
  }

  drawHexTile(ctx, layout, hex) {


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

    if(targetHex) {
      let shipHex = this.transport.transportHexes[Player.transportHexIndex];
      // let shipHex = this.transport.transportHexes[ENV.game.agents.player.index];
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
      let shipHex = this.transport.transportHexes[Player.transportHexIndex];
      this.transport.moveShipToHexTask.cancelAll();
      let path = this.mapService.findPath(this.mapService.twoDimensionalMap, shipHex, mappedHex);
      this.transport.moveShipAlongPath(path);
    }
    // console.groupEnd();
  }
}
