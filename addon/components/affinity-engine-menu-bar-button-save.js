import Ember from 'ember';
import layout from '../templates/components/affinity-engine-menu-bar-button-save';
import { configurable } from 'affinity-engine';
import { ModalToggleMixin } from 'affinity-engine-menu-bar';
import multiton from 'ember-multiton-service';

const {
  Component
} = Ember;

const configurationTiers = [
  'component.menuBar.button.save',
  'component.menuBar',
  'all'
];

export default Component.extend(ModalToggleMixin, {
  layout,
  componentName: 'affinity-engine-menu-bar-button-save-menu',
  hook: 'affinity_engine_menu_bar_save',

  config: multiton('affinity-engine/config', 'engineId'),

  icon: configurable(configurationTiers, 'icon'),
  iconFamily: configurable(configurationTiers, 'iconFamily')
});
