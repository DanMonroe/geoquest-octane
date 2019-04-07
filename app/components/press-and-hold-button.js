import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class PressAndHoldButtonComponent extends Component {

  @action
  sendPress() {
    this.args.press();
  }

  @action
  sendRelease() {
    this.args.release();
  }
}
