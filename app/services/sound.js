import Service from '@ember/service';
import {inject as service} from '@ember/service';
import { isPresent } from '@ember/utils';
import { A as emberArray } from '@ember/array';
import { tracked } from '@glimmer/tracking';

export default class SoundService extends Service {
  // @service ('audio') audio;

  @tracked soundEnabled = true;
  @tracked sounds = emberArray();

  loadSounds(soundsToLoad) {
    if (isPresent(soundsToLoad)) {
      soundsToLoad.forEach((sound) => {
        // console.log(sound);
        // TODO re-enable sound
        // this.audio.load(`/api/sounds/${sound.file}`).asSound(sound.name).then((sound) => {
        //     this.addLoadedSound(sound);
        //   }
        // );
      })
    }
  }

  addLoadedSound(sound) {
    // console.log('loaded sound', sound);
    this.sounds.push(sound);
  }

  playSound(soundName) {
    // TODO re-enable sound
    console.log('TODO re-enable sound');
    // if (!soundName || !this.soundEnabled) {
    //   return;
    // }
    // let sound = this.sounds.filter((sound) => {
    //   return sound.name === soundName;
    // });
    // if(sound) {
    //   // console.log('playing...');
    //   this.audio.getSound(soundName).play();
    // } else {
    //   console.log('could not find sound', soundName);
    // }
  }
}
