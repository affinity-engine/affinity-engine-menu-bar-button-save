import Ember from 'ember';
import layout from '../templates/components/affinity-engine-menu-bar-button-save-menu';
import { classNamesConfigurable, configurable, deepConfigurable, registrant } from 'affinity-engine';
import { ModalMixin } from 'affinity-engine-menu-bar';
import { BusPublisherMixin } from 'ember-message-bus';
import multiton from 'ember-multiton-service';

const {
  Component,
  assign,
  computed,
  get,
  getProperties,
  set
} = Ember;

const configurationTiers = [
  'config.attrs.component.menuBar.button.save',
  'config.attrs.component.menuBar.menu',
  'config.attrs.component.menuBar',
  'config.attrs'
];

export default Component.extend(BusPublisherMixin, ModalMixin, {
  layout,
  hook: 'affinity_engine_menu_bar_save_menu',

  saveStateManager: registrant('affinity-engine/save-state-manager'),
  config: multiton('affinity-engine/config', 'engineId'),

  menuColumns: configurable(configurationTiers, 'menuColumns'),
  customClassNames: classNamesConfigurable(configurationTiers, 'classNames'),
  iconFamily: configurable(configurationTiers, 'iconFamily'),
  keys: deepConfigurable(configurationTiers, 'keys'),

  options: computed('menuColumns', 'customClassNames', 'iconFamily', 'icon', 'keys', {
    get() {
      return assign({ classNames: get(this, 'customClassNames') }, getProperties(this, 'menuColumns', 'iconFamily', 'icon', 'keys'));
    }
  }),

  init(...args) {
    this._super(...args);

    get(this, 'saveStateManager.saves').then((saves) => {
      const choices = Ember.A([{
        key: 'new',
        grow: 2,
        icon: 'save',
        inputable: true,
        text: 'affinity-engine.menu-bar.buttons.save.new'
      }]);

      saves.forEach((save) => {
        if (!get(save, 'isAutosave')) {
          choices.pushObject({
            key: 'save',
            object: save,
            text: get(save, 'fullNameAndDate')
          });
          choices.pushObject({
            key: 'delete',
            object: save,
            icon: 'remove',
            classNames: ['ae-menu-option-shrink']
          });
        }
      });

      set(this, 'choices', choices);
    });
  },

  actions: {
    closeModal() {
      this.closeModal();
    },

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
