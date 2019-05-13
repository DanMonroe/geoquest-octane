import Controller from '@ember/controller';
import { storageFor } from 'ember-local-storage';
import { action } from '@ember/object';
import {inject as service} from '@ember/service';

export default class ApplicationController extends Controller {
  gameStorage = storageFor('game')

  @service ('game') game;

  @action
  saveGame() {
    console.log('Save Game');
  }
}
