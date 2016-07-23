import Ember from 'ember';
import layout from '../templates/components/affinity-engine-menu-bar-save-menu';
import { registrant } from 'affinity-engine';
import { ModalMixin } from 'affinity-engine-menu-bar';
import { BusPublisherMixin } from 'ember-message-bus';

const {
  Component,
  get,
  set
} = Ember;

export default Component.extend(BusPublisherMixin, ModalMixin, {
  layout,
  hook: 'affinity_engine_menu_bar_save_menu',

  options: {
    menuColumns: 2,
    iconFamily: 'fa-icon',
    keys: {
      accept: ['Enter']
    }
  },

  saveStateManager: registrant('affinity-engine/save-state-manager'),

  init(...args) {
    this._super(...args);

    get(this, 'saveStateManager.saves').then((saves) => {
      const choices = Ember.A([{
        key: 'new',
        icon: 'save',
        inputable: true,
        text: 'affinity-engine.menu.save.new'
      }, {
        class: 'ae-menu-close',
        icon: 'arrow-right',
        text: 'affinity-engine.menu.cancel'
      }]);

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
