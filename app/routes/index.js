import Route from '@ember/routing/route';

export default class IndexRoute extends Route {

  // TODO return inform 7 story here

  beforeModel(/* transition */) {
    this.transitionTo('/maps/1'); // Implicitly aborts the on-going transition.
  }
}
