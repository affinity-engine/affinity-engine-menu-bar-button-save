import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../../tests/helpers/module-for-acceptance';
import { $hook, hook } from 'ember-hook';

moduleForAcceptance('Acceptance | menu bar/save', {
  beforeEach() {
    localStorage.clear();
    Ember.$.Velocity.mock = true;
  },

  afterEach() {
    Ember.$.Velocity.mock = false;
  }
});

test('visiting /menu-bar/save', function(assert) {
  assert.expect(11);

  const done = assert.async();

  let buttonText = '';

  visit('/').then(() => {
    assert.equal($hook('affinity_engine_menu_bar_save_menu').length, 0, 'menu is not rendered');

    return click(hook('affinity_engine_menu_bar_save'));
  }).then(() => {
    assert.equal($hook('affinity_engine_menu_bar_save_menu').length, 1, 'menu is rendered');
    assert.equal($hook('ember_flex_menu_option').length, 1, 'new save option available');

    return click($hook('affinity_engine_menu_bar_menu_screen').get(0));
  }).then(() => {
    assert.equal($hook('affinity_engine_menu_bar_save_menu').length, 0, 'menu is closed');

    return click(hook('affinity_engine_menu_bar_save'));
  }).then(() => {
    return click($hook('ember_flex_menu_option_button').get(0));
  }).then(() => {
    return fillIn(hook('ember_flex_menu_option_input'), 'foo');
  }).then(() => {
    return keyDown('Enter');
  }).then(() => {
    assert.equal($hook('affinity_engine_menu_bar_save_menu').length, 0, 'menu is closes after save');

    return click(hook('affinity_engine_menu_bar_save'));
  }).then(() => {
    assert.equal($hook('ember_flex_menu_option').length, 3, 'new save visible, along with delete');

    buttonText = $hook('ember_flex_menu_option').eq(1).text().trim();

    return delay(1000);
  }).then(() => {
    return click($hook('ember_flex_menu_option_button').get(1));
  }).then(() => {
    assert.equal($hook('affinity_engine_menu_bar_save_menu').length, 0, 'menu is closes after update');

    return click(hook('affinity_engine_menu_bar_save'));
  }).then(() => {
    assert.equal($hook('ember_flex_menu_option').length, 3, 'when updated, no new save');
    assert.ok($hook('ember_flex_menu_option').eq(1).text().trim() !== buttonText, 'save updated');

    return click($hook('ember_flex_menu_option_button').get(2));
  }).then(() => {
    assert.equal($hook('affinity_engine_menu_bar_save_menu').length, 0, 'menu is closes after delete');

    return click(hook('affinity_engine_menu_bar_save'));
  }).then(() => {
    assert.equal($hook('ember_flex_menu_option').length, 1, 'delete successful');

    done();
  });
});
