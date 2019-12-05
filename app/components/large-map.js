import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import {inject as service} from '@ember/service';
import Konva from 'konva';

export default class LargeMapComponent extends Component {
  @service ('map') mapService;
  @service ('hex') hexService;
  @service ('camera') camera;
  @service ('transport') transport;
  @service ('path') pathService;
  @service ('game') game;
  @service ('gameboard') gameboard;

  @tracked map = undefined;

  constructor() {
    super(...arguments);

    console.log('in LargeMap constructor');

    // this.setup();
  }

  @action
  setup() {
    console.log('large board setup');

    // this.setupCanvases();
  }

  setupCanvases() {
    // debugger;
    let stage = new Konva.Stage({
      width: window.innerWidth,
      height: window.innerHeight,
      container: '#konvaContainer'
    });

    let gameLayer = new Konva.Layer({draggable: false});
    let hexLayer = new Konva.Layer({draggable: false});
    let debugLayer = new Konva.Layer({draggable: false});
    let fieldOfViewLayer = new Konva.Layer({draggable: false});
    let agentsLayer = new Konva.Layer({draggable: false});

    gameLayer.disableHitGraph();
    hexLayer.disableHitGraph();
    debugLayer.disableHitGraph();
    fieldOfViewLayer.disableHitGraph();
    agentsLayer.disableHitGraph();

    stage.add(gameLayer);
    stage.add(hexLayer);
    stage.add(debugLayer);
    stage.add(fieldOfViewLayer);
    stage.add(agentsLayer);

    this.camera.stage = stage;
    this.camera.viewportWidth = stage.width();
    this.camera.viewportHeight = stage.height();

    this.pathFindingDebug = this.game.pathFindingDebug;
    this.showDebugLayer = this.game.showDebugLayer;
    this.showFieldOfViewLayer = this.game.showFieldOfViewLayer;

    let container = stage.container();

    // make it focusable
    container.tabIndex = 1;
    // focus it
    // also stage will be in focus on its click
    container.focus();

    // TODO can we use ember-keyboard instead?
    container.addEventListener('keydown', (e) => {
      // https://keycode.info/
      switch (e.keyCode) {
        // case 70:  // F [ire]
        //   if (this.game.player.boardedTransport) {
        //     this.game.player.boardedTransport.fire();
        //   }
        //   break;
        case 81:  // Q
          this.gameboard.movePlayer('NW');
          break;
        case 87:  // W
          this.gameboard.movePlayer('N');
          break;
        case 69:  // E
          this.gameboard.movePlayer('NE');
          break;
        case 65:  // A
          this.gameboard.movePlayer('SW');
          break;
        case 83:  // S
          this.gameboard.movePlayer('S');
          break;
        case 68:  // D
          this.gameboard.movePlayer('SE');
          break;
        default:
          break;
      }
      e.preventDefault();
    });

    this.camera.stage.on('click', () => {
      this.gameboard.hexClick(this.gameboard.getMousePointerPosition());
    });

    this.camera.stage.on('mousemove', () => {
      this.gameboard.hexMouseMove(this.gameboard.getMousePointerPosition());
    });

    let scrollContainer = document.getElementById('scroll-container');
    scrollContainer.addEventListener('scroll', () => {
      let dx = scrollContainer.scrollLeft;
      let dy = scrollContainer.scrollTop;
      this.camera.stage.container().style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
      this.camera.stage.x(-dx);
      this.camera.stage.y(-dy);
      this.camera.stage.batchDraw();
    });
  }

}
