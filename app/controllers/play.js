import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class PlayController extends Controller {

  @service camera;
  @service gameboard;
  @service config;

  @action
  setup(element) {
    console.log('setup', element);
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
      // console.log(e.key);
      switch(e.key.toUpperCase()) {
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
        case 'V':  // show/hide Field of View
          this.config.togglePathFindingDebug();
          e.preventDefault();
          break;
        case 'B':  // show/hide Debug Group
          this.config.toggleDebugGroup();
          e.preventDefault();
          break;
        default:
          break;
      }
      // e.preventDefault();
    });
  }

  setupMouseEvents() {
    if (this.camera.stage) {
      this.camera.stage.on('click', () => {
        this.gameboard.hexClick();
      });

      this.camera.stage.on('mousemove', () => {
        console.log('mousemove', arguments);
        this.gameboard.hexMouseMove();
      });
    }
  }

  setupScrollListener() {
    let scrollContainer = document.getElementById('scroll-container');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', () => {
        let dx = scrollContainer.scrollLeft;
        let dy = scrollContainer.scrollTop;
        this.camera.stage.container().style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
        // console.log('scrolling container', scrollContainer, 'translate(' + dx + 'px, ' + dy + 'px)');
        this.camera.stage.x(-dx);
        this.camera.stage.y(-dy);
        this.camera.stage.batchDraw();
      });
    }
  }
}
