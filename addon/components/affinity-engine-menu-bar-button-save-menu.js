import Ember from 'ember';
import layout from '../templates/components/affinity-engine-menu-bar-button-save-menu';
import { classNamesConfigurable, configurable, registrant } from 'affinity-engine';
import { ModalMixin } from 'affinity-engine-menu-bar';
import { BusPublisherMixin } from 'ember-message-bus';
import multiton from 'ember-multiton-service';

const {
  Component,
  get,
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

  acceptKeys: configurable(configurationTiers, 'keys.accept'),
  animationLibrary: configurable(configurationTiers, 'animationLibrary'),
  cancelKeys: configurable(configurationTiers, 'keys.cancel'),
  customClassNames: classNamesConfigurable(configurationTiers, 'classNames'),
  header: configurable(configurationTiers, 'header'),
  iconFamily: configurable(configurationTiers, 'iconFamily'),
  menuColumns: configurable(configurationTiers, 'menuColumns'),
  moveDownKeys: configurable(configurationTiers, 'keys.moveDown'),
  moveLeftKeys: configurable(configurationTiers, 'keys.moveLeft'),
  moveRightKeys: configurable(configurationTiers, 'keys.moveRight'),
  moveUpKeys: configurable(configurationTiers, 'keys.moveUp'),
  transitionIn: configurable(configurationTiers, 'transitionIn'),
  transitionOut: configurable(configurationTiers, 'transitionOut'),

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
      set(this, 'willTransitionOut', true);
    },

    onChoice(choice) {
      const engineId = get(this, 'engineId');

      switch (get(choice, 'key')) {
        case 'new': this.publish(`ae:${engineId}:shouldCreateSave`, get(choice, 'value')); break;
        case 'save': this.publish(`ae:${engineId}:shouldUpdateSave`, get(choice, 'object')); break;
        case 'delete': this.publish(`ae:${engineId}:shouldDeleteSave`, get(choice, 'object')); break;
      }

      set(this, 'willTransitionOut', true);
    }
  }
});
