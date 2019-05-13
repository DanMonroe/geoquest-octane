import Service from '@ember/service';
import {inject as service} from '@ember/service';
import { A as emberArray } from '@ember/array';
import { tracked } from '@glimmer/tracking';

export default class SoundService extends Service {
  @service ('audio') audio;

  @tracked soundEnabled = true;
  @tracked sounds = emberArray();

  loadSounds(sounds) {
    sounds.forEach((sound) => {
      // console.log(sound);
      this.audio.load(`/sounds/${sound.file}`).asSound(sound.name).then((sound) => {
          this.addLoadedSound(sound);
        }
      );
    })
  }

  addLoadedSound(sound) {
    // console.log('loaded sound', sound);
    this.sounds.push(sound);
  }

  playSound(soundName) {
    if (!soundName || !this.soundEnabled) {
      return;
    }
    let sound = this.sounds.filter((sound) => {
      return sound.name === soundName;
    });
    if(sound) {
      // console.log('playing...');
      this.audio.getSound(soundName).play();
    } else {
      console.log('could not find sound', soundName);
    }
  }
}
