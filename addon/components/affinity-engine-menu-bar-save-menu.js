import Ember from 'ember';
import layout from '../templates/components/affinity-engine-menu-bar-save-menu';
import { registrant } from 'affinity-engine';
import { ModalMixin } from 'affinity-engine-menu-bar';

const { Component } = Ember;

export default Component.extend(ModalMixin, {
  layout,

  options: {
    columns: 2,
    iconFamily: 'fa-icon'
  },

  saveStateManager: registrant('saveStateManager'),

  choices: computed('saves.[]', {
    get() {
      return get(this, 'saveStateManager.saves').then((saves) => {
        const choices = Ember.A();

        // Position is important. New Game must be the second menu, as its position determines the way
        // this menu is resolved.
        choices.pushObject({
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

        return choices;
      });
    }
  })
});
