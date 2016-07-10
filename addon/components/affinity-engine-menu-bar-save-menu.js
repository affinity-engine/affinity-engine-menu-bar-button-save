import Ember from 'ember';
import layout from '../templates/components/affinity-engine-menu-bar-save-menu';
import { registrant } from 'affinity-engine';
import { ModalMixin } from 'affinity-engine-menu-bar';
import { BusPublisherMixin } from 'ember-message-bus';

const {
  Component,
  computed,
  get,
  set
} = Ember;

export default Component.extend(BusPublisherMixin, ModalMixin, {
  layout,

  options: {
    menuColumns: 2,
    iconFamily: 'fa-icon',
    keys: {
      accept: ['Enter']
    }
  },

  saveStateManager: registrant('saveStateManager'),

  init(...args) {
    this._super(...args);

    get(this, 'saveStateManager.saves').then((saves) => {
      const choices = Ember.A();

      // Position is important. New Game must be the second menu, as its position determines the way
      // this menu is resolved.
      choices.pushObject({
        grow: 2,
        key: 'new',
        icon: 'save',
        inputable: true,
        text: 'affinity-engine.menu.save.new'
      });

      saves.forEach((save) => {
        if (!get(save, 'isAutosave')) {
          choices.pushObject({
            key: 'save',
            object: save,
            text: get(save, 'fullName'),
            classNames: ['ae-menu-option-pair-major']
          });
          choices.pushObject({
            key: 'delete',
            object: save,
            icon: 'remove',
            classNames: ['ae-menu-option-pair-minor']
          });
        }
      });

      set(this, 'choices', choices);
    });
  },

  actions: {
    onChoice(choice) {
      const engineId = get(this, 'engineId');

      switch (get(choice, 'key')) {
        case 'new': this.publish(`ae:${engineId}:shouldCreateSave`, get(choice, 'value')); break;
        case 'save': this.publish(`ae:${engineId}:shouldUpdateSave`, get(choice, 'object')); break;
        case 'delete': this.publish(`ae:${engineId}:shouldDeleteSave`, get(choice, 'object')); break;
      }

      this.closeModal();
    }
  }
});
