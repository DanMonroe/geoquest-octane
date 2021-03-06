import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class PlayController extends Controller {

  @service camera;
  @service gameboard;
  @service config;
  @service game;

  @action
  setup(element) {
    // console.log('setup', element);
    this.setupKeyboardListeners();
    // this.setupMouseEvents();
    // this.setupScrollListener();
  }

  @action
  teardown(element) {
    console.log('teardown', element);
    document.removeEventListener('keydown');
    document.getElementById('scroll-container').removeEventListener('scroll');
  }

  setupKeyboardListeners() {
    // using 'element' does not work for keyboard events ?
    document.addEventListener('keydown', (e) => {
      // console.log(e);
      if (e.metaKey && e.shiftKey) {  // Cmd Shift
        switch (e.key.toUpperCase()) {
          case 'H':  // Cmd H  toggle hex info
            this.config.toggleHexInfo();
            e.preventDefault();
            break;
          case 'P':  // show/hide Field of View
            this.config.togglePathFindingDebug();
            e.preventDefault();
            break;
          case 'F':  // show/hide Field of View
            this.config.toggleFieldOfView();
            e.preventDefault();
            break;
          case 'D':  // show/hide Debug Group
            this.config.toggleDebugGroup();
            e.preventDefault();
            break;
          case 'S':  // show/hide Scroll Red Group
            this.config.toggleScrollRectGroup();
            e.preventDefault();
            break;

          default:
        }
      } else {
        switch (e.key.toUpperCase()) {
          case 'Q':  // Q
            this.gameboard.movePlayer('NW');
            e.preventDefault();
            break;
          case 'W':  // W
            this.gameboard.movePlayer('N');
            e.preventDefault();
            break;
          case 'E':  // E
            this.gameboard.movePlayer('NE');
            e.preventDefault();
            break;
          case 'A':  // A
            this.gameboard.movePlayer('SW');
            e.preventDefault();
            break;
          case 'S':  // S
            this.gameboard.movePlayer('S');
            e.preventDefault();
            break;
          case 'D':  // D
            this.gameboard.movePlayer('SE');
            e.preventDefault();
            break;

          case 'X':  // experiments
            this.game.doDebugStuff();
            e.preventDefault();
            break;

          default:
            break;
        }
      }
    });
  }

  // setupMouseEvents() {
  //   if (this.camera.stage) {
  //     this.camera.stage.on('click', () => {
  //       this.gameboard.hexClick();
  //     });
  //
  //     this.camera.stage.on('mousemove', () => {
  //       console.log('mousemove', arguments);
  //       this.gameboard.hexMouseMove();
  //     });
  //   }
  // }
  //
  // setupScrollListener() {
  //   let scrollContainer = document.getElementById('scroll-container');
  //   if (scrollContainer) {
  //     scrollContainer.addEventListener('scroll', () => {
  //       let dx = scrollContainer.scrollLeft;
  //       let dy = scrollContainer.scrollTop;
  //       this.camera.stage.container().style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
  //       // console.log('scrolling container', scrollContainer, 'translate(' + dx + 'px, ' + dy + 'px)');
  //       this.camera.stage.x(-dx);
  //       this.camera.stage.y(-dy);
  //       this.camera.stage.batchDraw();
  //     });
  //   }
  // }
}
