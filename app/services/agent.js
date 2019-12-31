import Service from '@ember/service';
import { inject as service } from '@ember/service';
import Konva from 'konva';
import { isPresent } from '@ember/utils';
import {task} from 'ember-concurrency-decorators';
import { timeout } from 'ember-concurrency';

export default class AgentService extends Service {

  @service game;

  buildDisplayGroup(agent) {
    agent.imageGroup = new Konva.Group({
      x: agent.point.x,
      y: agent.point.y,
      opacity: agent.opacity
    });
    switch (agent.type) {
      case this.game.constants.AGENTTYPES.PLAYER:
        agent.imageGroup.name(`player${agent.id}`);
        break;
      case this.game.constants.AGENTTYPES.ENEMY:
        agent.imageGroup.name(`agent${agent.id}`);
        break;
      case this.game.constants.AGENTTYPES.TRANSPORT:
        agent.imageGroup.name(`transport${agent.id}`);
        break;
      default:
    }

    let healthBar = new Konva.Rect({
      id: 'hp' + agent.id,
      x: -15,
      y: 13,
      width: 30 * (this.healthPercentage(agent)/100),
      height: 4,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 1,
      listening: false
    });

    let powerBar = new Konva.Rect({
      id: 'power',
      x: -15,
      y: 17,
      width: 30 * (this.powerPercentage(agent)/100),
      height: 4,
      fill: 'blue',
      stroke: 'black',
      strokeWidth: 1,
      listening: false
    });

    let imageObj = new Image();
    // image.src = agent.agentImage;
    imageObj.src = agent.agentImage;


    imageObj.onload = () => {
      console.log('imageObj', imageObj.src);
      agent.imageObj = new Konva.Image({
        // id: "agent" + agent.id,
        // id: "agent" + agent.index,
        x: -(agent.agentImageSize / 2),
        y: -(agent.agentImageSize / 2) - 20,
        image: imageObj,
        opacity: agent.opacity,
        width: agent.agentImageSize,
        height: agent.agentImageSize
      });
      switch (agent.type) {
        case this.game.constants.AGENTTYPES.PLAYER:
          agent.imageObj.id = agent.name;
          agent.imageGroup.add(agent.imageObj, healthBar, powerBar);
          break;
        case this.game.constants.AGENTTYPES.ENEMY:
          agent.imageObj.id = "agent" + agent.id;
          agent.imageGroup.add(agent.imageObj, healthBar);
          break;
        case this.game.constants.AGENTTYPES.TRANSPORT:
          agent.imageObj.id = "agent" + agent.id;
          agent.imageGroup.add(agent.imageObj, healthBar, powerBar);
          break;
        default:
      }

      let agentsLayer = this.game.camera.getAgentsLayer();
      // agent.imageGroup.add(agent.imageObj, healthBar, powerBar);
      // healthBar.moveToBottom();
      // powerBar.moveToBottom();
      agentsLayer.add(agent.imageGroup);
      // agentsLayer.add(this.imageObj);
      // agentsLayer.draw();
      this.game.camera.stage.batchDraw();
    };
    // imageObj.src = agent.agentImage;
  }

  healthPercentage(agent) {
    if (!agent.currentHitPoints || agent.currentHitPoints <= 0) {
      return 0;
    }

    let health = Math.round((agent.currentHitPoints / agent.maxHitPoints) * 100);

    return Math.min(health, 100);
  }

  powerPercentage(agent) {
    if (!agent.currentPower || agent.currentPower <= 0) {
      return 0;
    }

    let power = Math.round((agent.currentPower / agent.maxPower) * 100);

    return Math.min(power, 100);
  }

  canFireWeapon(agent, powerRequirement) {
    console.log('canFire', agent.currentPower, powerRequirement);
    return agent.currentPower >= powerRequirement;
  }

  @task
  // *fireWeapon(weapon, startPoint, targetPoint, whoFiredType) {
  *fireWeapon(agent, weapon, startPoint, targetPoint, whoFiredType) {

    // agent.imageGroup.to({opacity: 1});

    let projectile = this.game.buildProjectile(weapon, startPoint, targetPoint);

    let layer = this.game.camera.getAgentsLayer();
    layer.add(projectile);

    projectile.moveToTop();

    let newX = projectile.getX();
    let newY = projectile.getY();

    let sumX = 0;
    let sumY = 0;

    let anim = new Konva.Animation(() => {
      newX += projectile.cos;
      newY += projectile.sin;
      projectile.position({x:newX, y:newY});
      sumX += projectile.deltaX;
      sumY += projectile.deltaY;

      // change/implement max firing distance of current cannon in use
      if((sumX >= projectile.maxX) || (sumY >= projectile.maxY)) {
        anim.stop();
        projectile.remove();
      }

      // did we hit something?
      this.checkForEnemiesHitByProjectile(anim, projectile);
    }, layer);
    anim.start();

    this.game.sound.playSound(weapon.sound);

    agent.currentPower -= weapon.poweruse;
    if (agent.type === this.game.constants.AGENTTYPES.PLAYER) {
    // if (whoFiredType === BaseAgent.AGENTTYPES.PLAYER) {
      this.updatePowerBar(agent);
    }
    if(agent.currentPower < 100 && agent.reloadPower.isIdle) {
      agent.reloadPower.perform(weapon);
    }

    return yield timeout(weapon.fireDelay);
  }

  checkForEnemiesHitByProjectile(anim, projectile) {
    if (this.game.agents) {
      this.game.agents.forEach((agent) => {
        let distance;
        switch(projectile.attrs.type) {
          case 'arrow':
            distance = Math.sqrt( Math.pow((agent.point.x - (projectile.attrs.points[0] + projectile.attrs.x)),2) + Math.pow((agent.point.y - (projectile.attrs.points[1]+projectile.attrs.y)),2));
            break;
          case 'cannon':
            distance = Math.sqrt( Math.pow((agent.point.x - projectile.attrs.x),2) + Math.pow((agent.point.y - projectile.attrs.y),2));
            break;
          default:
            return;
        }

        // let distance = Math.sqrt(Math.pow((agent.point.x - projectile.attrs.x), 2) + Math.pow((agent.point.y - projectile.attrs.y), 2));

        // console.log(`agent ${agent.name} to projectile distance:`, distance, agent);

        // if (distance < 10) {
        if (distance < projectile.attrs.minDistanceForHit) {
          console.log('Hit!');
          agent.currentHitPoints -= projectile.damage;
          this.updateHealthBar(agent);

          anim.stop();
          projectile.remove();
        }
      })
    }
  }

  updatePowerBar(agent) {
    let bar = agent.imageGroup.getChildren((node) =>{
      return node.attrs && node.attrs.id === 'power';
    });
    if (bar) {
      // console.log('this.healthPercentage', this.healthPercentage);
      bar.width( 30 * (this.powerPercentage(agent)/100) );
      bar.fill('blue')
      this.game.camera.getAgentsLayer().draw();
    }
  }

  // @task
  // *reloadPower(agent, weapon) {
  //   while (agent.currentPower < this.maxPower) {
  //     // console.log('reloading power', this.currentPower, weapon.reloadDelay);
  //     yield timeout(weapon.reloadDelay);
  //     agent.currentPower += Math.max(1, (weapon.poweruse / 3));  // weapon.power?
  //     this.updatePowerBar(agent);
  //   }
  // }

//   @task
//   *reloadHealth(agent) {
//     while (agent.currentHitPoints < agent.maxHitPoints) {
// // console.log('this.healingPower', this.healingPower);
//       yield timeout(agent.healingSpeed);
//       agent.currentHitPoints += Math.max(1, agent.healingPower);
//       this.updateHealthBar(agent);
//     }
//   }

  updateHealthBar(agent) {
    // console.log('player updateHealthBar');
    let bar = agent.imageGroup.getChildren((node) =>{
      return node.attrs && node.attrs.id === 'hp';
    });
    if (bar) {
      // console.log('player updateHealthBar this.healthPercentage', this.healthPercentage);
      const health = this.healthPercentage(agent);
      bar.width( 30 * (health/100) );
      bar.fill(health < 25 ? 'red' : 'green')
      agent.game.camera.getAgentsLayer().draw();

      if (health <= 0) {
        console.log(`${agent.name} dead!`);
        //     debugger;
        //     // TODO do death functions:
        //     // remove from map
        //     // award experience
        //     // drop treasure?  Treasure disappears after a while ?
      }
    }
  }

  playerInRange(agent) {
    // console.log(`Player in Range for ${this.name}`);

    agent.state = this.game.constants.STATE.MISSILE;

    if(agent.patrolMethod === this.game.constants.PATROLMETHOD.STATIC) {
      if (agent.engagePlayer.isIdle) {
        agent.engagePlayer.perform();
      }
    } else {

      // cancel any patrolling for this enemy
      this.game.transport.removeAgentFromMoveQueue(this);

      // Fire and pursue
      if (agent.engagePlayer.isIdle) {
        agent.engagePlayer.perform();
      }
      if (agent.chasePlayer.isIdle) {
        agent.chasePlayer.perform();
      }
    }
  }

  playerOutOfRange(agent) {
    // console.log(`Player out of Range for ${this.name}`);

    // cancel any patrolling for this enemy
    // this.transportService.removeAgentFromMoveQueue(this);

    // Strop Firing and pursuing
    // this.engagePlayer.cancelAll();
    // this.chasePlayer.cancelAll();
    agent.state = this.game.constants.STATE.PATROL; // or PATROL
    // this.state = this.constants.STATE.SEARCHING; // or PATROL

    if (isPresent(agent.patrol) > 0) {

      this.game.transport.pushTransportWaypointToMoveQueue(agent);
    }

  }



}
