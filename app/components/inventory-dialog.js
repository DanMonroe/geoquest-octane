import Component from '@glimmer/component';
import {action,computed} from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class InventoryDialogComponent extends Component {
  tagName = '';

  @tracked currentNavCategory = this.leftNavItems[0];
  @tracked itemSelected = null;

  @computed
  get leftNavItems() {
    return [
      {
        text: 'Weapons',
        img: '/images/item-icon-primary.png',
        category: 'weapon'
      },
      {
        text: 'Armor',
        img: '/images/item-icon-armor.png',
        category: 'armor'
      },
      {
        text: 'Other',
        img: '/images/item-icon-accessories.png',
        category: 'other'
      },
    ];
  }

  @computed
  get inventoryItems() {
    // TODO get this from ember data models. for now hard code for display
    const items = [
      {
        id:1,
        name: 'Sword',
        price: 100,
        owned: true,
        img: '/images/items/crossbow.png',
        locked: false,
        type: 'weapon'
      },
      {
        id:2,
        name: 'Crossbow',
        price: 100,
        owned: false,
        img: '/images/items/crossbow.png',
        locked: false,
        unlockText: 'Unlock',
        type: 'weapon'
      },
      {
        id:3,
        name: 'Faux Fur Hat',
        price: 100,
        owned: true,
        img: '/images/items/furhat.png',
        locked: false,
        type: 'armor',
        stats: [
          {
            title: 'Health',
            desc: '+8'
          }
        ],
        description: 'Modest range and damage; it\'s the beginner crossbow. But hey, it\'s cheap!' +
          'Modest range and damage; it\'s the beginner crossbow. But hey, it\'s cheap!' +
          'Modest range and damage; it\'s the beginner crossbow. But hey, it\'s cheap!' +
          'Modest range and damage; it\'s the beginner crossbow. But hey, it\'s cheap!\n',
        skills: [
          {
            title: 'attack',
            desc: 'The attack method makes the hero attack the target.'
          }
        ]
      },
      {
        id:4,
        name: 'Sword',
        price: 100,
        owned: true,
        img: '/images/items/crossbow.png',
        locked: false,
        type: 'other'
      },
      {
        id:5,
        name: 'Sword 2',
        price: 1337,
        owned: false,
        img: '/images/items/crossbow.png',
        locked: false,
        unlockText: 'Unlock', // TODO change to computed
        type: 'weapon'
      },
      {
        id:6,
        name: 'Crossbow 2',
        price: 100,
        owned: true,
        img: '/images/items/crossbow.png',
        locked: false,
        type: 'weapon'
      },
      {
        id:7,
        name: 'Sword 2',
        price: 100,
        owned: true,
        img: '/images/items/crossbow.png',
        locked: false,
        type: 'armor'
      },
      {
        id:8,
        name: 'Sword 2',
        price: 100,
        owned: true,
        img: '/images/items/crossbow.png',
        locked: false,
        type: 'other'
      },
      {
        id:9,
        name: 'Sword 3',
        price: 100,
        owned: true,
        img: '/images/items/crossbow.png',
        locked: false,
        type: 'armor'
      },
      {
        id:10,
        name: 'Sword 4',
        price: 100,
        owned: true,
        img: '/images/items/crossbow.png',
        locked: false,
        type: 'other'
      },
      {
        id:11,
        name: 'Sword 5',
        price: 99,
        owned: false,
        img: '/images/items/crossbow.png',
        locked: false,
        unlockText: 'Unlock',
        type: 'weapon'
      }
    ];
    return items;
  }

  @computed('inventoryItems', 'currentNavCategory')
  get filteredItems() {
    return this.inventoryItems.filterBy('type', this.currentNavCategory.category);
  }

  @action
  pickCategory(category) {
    this.currentNavCategory = category;
  }

  @action
  selectItem(item) {
    // console.log(item);
    if(this.itemSelected) {
      this.itemSelected.confirmUnlock = false;
      // this.itemSelected.set('unlockText','Unlock');
    };
    this.itemSelected = item;
  }

  @action
  unlockItem(item) {
    console.log('unlock', item.name);
    if (item.confirmUnlock) {
      console.log('todo unlock');
      item.confirmUnlock = false;
      // item.unlockText.set('unlockText','Unlock');
    } else {
      item.confirmUnlock = true;
      // item.unlockText.set('unlockText','Confirm');
    }
  }
}
