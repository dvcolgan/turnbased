// Generated by CoffeeScript 1.6.3
var LD25;

LD25 = {};

ig.module('game.main').requires('impact.entity', 'impact.game', 'impact.font').defines(function() {
  LD25.sounds = {};
  LD25.LD25Game = ig.Game.extend({
    font: new ig.Font('media/04b03.font.png'),
    clearColor: '#7fffff',
    gravity: 20,
    init: function() {
      ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
      ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
      ig.input.bind(ig.KEY.UP_ARROW, 'up');
      ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
      return ig.input.bind(ig.KEY.SPACE, 'jump');
    },
    update: function() {
      return this.parent();
    },
    draw: function() {
      this.parent();
      return this.font.draw("Debug message", 10, 10);
    }
  });
  return soundManager.setup({
    url: 'lib/soundmanager/swf/',
    onready: function() {
      LD25.sounds = {
        'sound': soundManager.createSound({
          id: 'sound',
          url: 'media/sound.wav'
        })
      };
      return ig.main('#canvas', LD25.LD25Game, 60, 256, 240, 2);
    },
    ontimeout: function() {
      return alert('Could not start Soundmanager.  Is Flash blocked?');
    }
  });
});
