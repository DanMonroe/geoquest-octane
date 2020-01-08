import Component from '@glimmer/component';
import {action} from '@ember/object';
import { inject as service } from '@ember/service'

export default class LargeMapComponent extends Component {

  @service camera;

  // constructor() {
  //   super(...arguments);
  // }

  @action
  testContainer(element) {
    // console.log(element, arguments);
    // this.camera.scrollContainerWidth = element.clientWidth;
    // this.camera.scrollContainerHeight = element.clientHeight;
    this.camera.scrollContainerWidth = element.offsetWidth;
    this.camera.scrollContainerHeight = element.offsetHeight;
  }
}
