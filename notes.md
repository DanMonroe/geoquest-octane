## Notes and Ideas

#### TODOs
1/8/20 remove the extra layer for the red scroll rectangle 

#### Implement state machine

https://www.gamedev.net/articles/programming/artificial-intelligence/the-total-beginners-guide-to-game-ai-r4942/

Different states:
- non-combat
  - idle
  - patrolling
- attacking
  - melee
  - missile
- searching
- fleeing
- finding help?

#### Main States

| State        | Transition Condition                  | New State    |
|--------------|---------------------------------------|--------------|
| Non-Combat   | enemy visible and enemy is too strong | Find help    |
|              | enemy visible and health high         | Attacking    |
|              | enemy visible and health low          | Fleeing      |
| Attacking    | no enemy visible                      | Non-Combat   |
|              | health low                            | Fleeing      |
| Fleeing      | no enemy visible                      | Non-Combat   |
| Searching    | have been searching for 10 seconds    | Non-Combat   |
|              | enemy visible and enemy is too strong | Finding Help |
|              | enemy visible and health high         | Attacking    |
|              | enemy visible and health low          | Fleeing      |
| Finding Help | friend visible                        | Attacking    |

Start state: Non-Combat

#### Non-Combat State
| State      | Transition Condition          | New State  |
|------------|-------------------------------|------------|
| Idling     | have been idle for 10 seconds | Patrolling |
| Patrolling | finished patrol route         | Idling     |

#### Attacking State
| State      | Transition Condition          | New State  |
|------------|-------------------------------|------------|
| Melee      | Enemy at range and have ammo  | Missle     |
| Missile    | Out of ammo                   | Melee      |
