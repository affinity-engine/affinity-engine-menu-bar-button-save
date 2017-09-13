import Ember from 'ember';
import layout from '../templates/components/affinity-engine-menu-bar-button-save-menu';
import { classNamesConfigurable, configurable, registrant } from 'affinity-engine';
import { ModalMixin } from 'affinity-engine-menu-bar';
import multiton from 'ember-multiton-service';

const {
  Component,
  get,
  set
} = Ember;

const configurationTiers = [
  'component.menuBar.button.save',
  'component.menuBar.menu',
  'component.menuBar',
  'all'
];

export default Component.extend(ModalMixin, {
  layout,
  hook: 'affinity_engine_menu_bar_save_menu',

  dataManager: registrant('affinity-engine/data-manager'),
  config: multiton('affinity-engine/config', 'engineId'),
  eBus: multiton('message-bus', 'engineId'),

  acceptKeys: configurable(configurationTiers, 'keys.accept'),
  animator: configurable(configurationTiers, 'animator'),
  cancelKeys: configurable(configurationTiers, 'keys.cancel'),
  customClassNames: classNamesConfigurable(configurationTiers, 'classNames'),
  header: configurable(configurationTiers, 'header'),
  iconFamily: configurable(configurationTiers, 'iconFamily'),
  menuColumns: configurable(configurationTiers, 'menu.columns'),
  moveDownKeys: configurable(configurationTiers, 'keys.moveDown'),
  moveLeftKeys: configurable(configurationTiers, 'keys.moveLeft'),
  moveRightKeys: configurable(configurationTiers, 'keys.moveRight'),
  moveUpKeys: configurable(configurationTiers, 'keys.moveUp'),
  transitionIn: configurable(configurationTiers, 'transitionIn'),
  transitionOut: configurable(configurationTiers, 'transitionOut'),

  init(...args) {
    this._super(...args);

    get(this, 'dataManager.saves').then((saves) => {
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
      const eBus = get(this, 'eBus');

      switch (get(choice, 'key')) {
        case 'new': eBus.publish('shouldCreateSave', get(choice, 'value')); break;
        case 'save': eBus.publish('shouldUpdateSave', get(choice, 'object')); break;
        case 'delete': eBus.publish('shouldDeleteSave', get(choice, 'object')); break;
      }

      set(this, 'willTransitionOut', true);
    }
  }
});
