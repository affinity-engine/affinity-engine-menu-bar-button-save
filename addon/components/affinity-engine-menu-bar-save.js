import Ember from 'ember';
import layout from '../templates/components/affinity-engine-menu-bar-save';
import { ModalToggleMixin } from 'affinity-engine-menu-bar';

const {
  Component
} = Ember;

export default Component.extend(ModalToggleMixin, {
  layout,
  componentName: 'affinity-engine-menu-bar-save-menu',
  hook: 'affinity_engine_menu_bar_save'
});
