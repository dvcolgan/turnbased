// Generated by CoffeeScript 1.6.3
var GAME, GRID_SIZE, SECTOR_SIZE, getCoordsHalfOffset, getViewHeight, getViewWidth, randomChoice;

GRID_SIZE = 42;

SECTOR_SIZE = 10;

randomChoice = function(collection) {
  return collection[Math.floor(Math.random() * collection.length)];
};

getViewWidth = function() {
  return Math.floor(($(window).width() - (48 + 20)) / GRID_SIZE);
};

getViewHeight = function() {
  return Math.floor(($(window).height() - (110 + 24)) / GRID_SIZE);
};

getCoordsHalfOffset = function(position, length) {
  var _i, _ref, _ref1, _results;
  return (function() {
    _results = [];
    for (var _i = _ref = Math.ceil(-length / 2) + position, _ref1 = Math.ceil(length / 2) + position; _ref <= _ref1 ? _i < _ref1 : _i > _ref1; _ref <= _ref1 ? _i++ : _i--){ _results.push(_i); }
    return _results;
  }).apply(this);
};

GAME = {
  world_names: ['Atlantis', 'Azeroth', 'Camelot', 'Narnia', 'Hyrule', 'Middle-earth', 'The Neverhood', 'Rapture', 'Terabithia', 'Kanto', 'The Grand Line', 'Tatooine', 'Naboo', 'Pandora', 'Corneria', 'Termina', 'Xen', 'City 17', 'Tokyo', 'Ithica', 'Peru'],
  player_names: [['Frodo Baggins', 'Shire Hobbits'], ['Elrond', 'Mirkwood Elves'], ['Durin Darkhammer', 'Moria Dwarves'], ['Ness', 'Eagleland'], ['Daphnes Nohansen Hyrule', 'Hylians'], ['Aragorn son of Arathorn', 'Gondorians'], ['Strong Bad', 'Strongbadia'], ['Captain Homestar', 'The Team'], ['T-Rex', 'Dinosaurs'], ['Refrigerator', 'Kitchen Appliances'], ['The Burger King', 'Fast Foodies'], ['Larry King Live', 'Interviewees'], ['King', 'Mimigas'], ['Luke Skywalker', 'The Rebel Alliance'], ['Darth Vader', 'The Empire'], ['Jean-Luc Picard', 'The Enterprise'], ['The Borg Queen', 'The Borg'], ['Bowser', 'Koopas']],
  home: function() {},
  create_accout: function() {},
  settings: function() {
    var settingsViewModel, startingColor;
    settingsViewModel = function() {
      var vm;
      vm = this;
      vm.leaderName = ko.observable($('#id_leader_name').val());
      vm.peopleName = ko.observable($('#id_people_name').val());
      return null;
    };
    ko.applyBindings(new settingsViewModel);
    startingColor = $('#id_color').val() || '#ffffff';
    $('#id_color').css('background-color', startingColor).css('color', startingColor);
    return $('#id_color').ColorPicker({
      color: startingColor,
      onShow: function(colpkr) {
        $(colpkr).fadeIn(100);
        return false;
      },
      onChange: function(hsb, hex, rgb) {
        return $('#id_color').val('#' + hex).css('background-color', '#' + hex).css('color', '#' + hex);
      },
      onHide: function(colpkr) {
        $(colpkr).fadeOut(100);
        return false;
      }
    });
  },
  game: function() {
    debugger;
    var gameViewModel, opts, spinner;
    gameViewModel = function() {
      var pieces, vm, x, y, _;
      vm = this;
      vm.accountID = window.accountID;
      vm.accountColor = window.accountColor;
      vm.players = ko.observableArray([]);
      vm.currentColor = ko.observable('blue');
      vm.totalUnits = ko.observable(0);
      vm.unitAction = ko.observable('place');
      vm.unitsRemaining = ko.observable(0);
      vm.currentCursor = ko.computed = function() {
        switch (vm.unitAction()) {
          case 'place':
          case 'initial':
            return 'crosshair';
          case 'remove':
            return 'not-allowed';
          case 'settle':
            return 'all-scroll';
          case 'give':
            return 'e-resize';
          case 'wall':
            return 'vertical-text';
        }
      };
      pieces = window.location.hash.split('/');
      if (pieces.length < 3) {
        window.location.hash = '#/0/0/';
        pieces = window.location.hash.split('/');
      }
      _ = pieces[0], x = pieces[1], y = pieces[2];
      x = parseInt(x);
      y = parseInt(y);
      vm.viewX = ko.observable(x);
      vm.viewY = ko.observable(y);
      vm.topCoords = ko.observableArray(getCoordsHalfOffset(vm.viewX(), getViewWidth()));
      vm.sideCoords = ko.observableArray(getCoordsHalfOffset(vm.viewY(), getViewHeight()));
      vm.sectors = ko.observableArray([]);
      vm.squares = ko.observableArray([]);
      vm.findSquare = function(x, y) {
        var square, _i, _len, _ref;
        _ref = vm.squares();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          square = _ref[_i];
          if (square.x() === x && square.y() === y) {
            return square;
          }
        }
        return null;
      };
      vm.getUnitClass = function(idx, square) {
        return {
          first: idx() === 0,
          second: idx() === 1,
          third: idx() === 2,
          fourth: idx() === 3,
          one: square.resourceAmount() === 0 && square.wallHealth() === 0 && square.units().length === 1,
          two: square.resourceAmount() === 0 && square.wallHealth() === 0 && square.units().length === 2,
          three: square.resourceAmount() === 0 && square.wallHealth() === 0 && square.units().length === 3,
          four: square.resourceAmount() > 0 || square.wallHealth() > 0 || square.units().length === 4
        };
      };
      vm.moveWindow = function(direction) {
        var amountBy, dx, dy;
        amountBy = 10;
        switch (direction) {
          case 'left':
            dx = -amountBy;
            dy = 0;
            break;
          case 'right':
            dx = amountBy;
            dy = 0;
            break;
          case 'up':
            dx = 0;
            dy = -amountBy;
            break;
          case 'down':
            dx = 0;
            dy = amountBy;
        }
        vm.viewX(vm.viewX() + dx);
        return vm.viewY(vm.viewY() + dy);
      };
      vm.modifyUnit = function(square, event) {
        var count, found, i, placement, squares, unit, _i, _j, _k, _l, _len, _len1, _m, _ref, _ref1, _ref2, _ref3, _results, _results1, _results2;
        $.ajax('/api/square/' + square.x() + '/' + square.y() + '/' + vm.unitAction() + '/', {
          contentType: "application/json",
          data: ko.toJSON(square),
          type: 'POST',
          success: function(data, status) {
            if (status !== 'success') {
              return alert(JSON.stringify(data));
            }
          }
        });
        if (vm.unitAction() === 'initial') {
          placement = {
            8: [square],
            4: [vm.findSquare(square.x() - 1, square.y()), vm.findSquare(square.x() + 1, square.y()), vm.findSquare(square.x(), square.y() - 1), vm.findSquare(square.x(), square.y() + 1)],
            2: [vm.findSquare(square.x() - 1, square.y() - 1), vm.findSquare(square.x() + 1, square.y() + 1), vm.findSquare(square.x() + 1, square.y() - 1), vm.findSquare(square.x() - 1, square.y() + 1)],
            1: [vm.findSquare(square.x() - 2, square.y()), vm.findSquare(square.x() + 2, square.y()), vm.findSquare(square.x(), square.y() - 2), vm.findSquare(square.x(), square.y() + 2)]
          };
          for (count in placement) {
            squares = placement[count];
            for (_i = 0, _len = squares.length; _i < _len; _i++) {
              square = squares[_i];
              if (square) {
                square.units.push({
                  owner: vm.accountID,
                  ownerColor: vm.accountColor,
                  square: square.id(),
                  amount: ko.observable(parseInt(count)),
                  last_turn_amount: 0
                });
              }
            }
          }
          vm.unitsRemaining(0);
          return vm.unitAction('place');
        } else if (vm.unitAction() === 'place') {
          if (vm.unitsRemaining() > 0) {
            found = false;
            _ref = square.units();
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              unit = _ref[_j];
              if (unit.owner === vm.accountID) {
                unit.amount(unit.amount() + 1);
                vm.unitsRemaining(vm.unitsRemaining() - 1);
                found = true;
                break;
              }
            }
            if (!found) {
              vm.unitsRemaining(vm.unitsRemaining() - 1);
              return square.units.push({
                owner: vm.accountID,
                ownerColor: vm.accountColor,
                square: square.id(),
                amount: ko.observable(1),
                last_turn_amount: 0
              });
            }
          }
        } else if (vm.unitAction() === 'remove') {
          _results = [];
          for (i = _k = 0, _ref1 = square.units().length; 0 <= _ref1 ? _k < _ref1 : _k > _ref1; i = 0 <= _ref1 ? ++_k : --_k) {
            unit = square.units()[i];
            if (unit.owner === vm.accountID) {
              if (unit.amount() === 1) {
                square.units.splice(i, 1);
              } else {
                unit.amount(unit.amount() - 1);
              }
              vm.unitsRemaining(vm.unitsRemaining() + 1);
              break;
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        } else if (vm.unitAction() === 'settle') {
          _results1 = [];
          for (i = _l = 0, _ref2 = square.units().length; 0 <= _ref2 ? _l < _ref2 : _l > _ref2; i = 0 <= _ref2 ? ++_l : --_l) {
            unit = square.units()[i];
            if (unit.owner === vm.accountID) {
              square.resourceAmount(square.resourceAmount() + unit.amount());
              square.units.splice(i, 1);
              break;
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        } else if (vm.unitAction() === 'wall') {
          _results2 = [];
          for (i = _m = 0, _ref3 = square.units().length; 0 <= _ref3 ? _m < _ref3 : _m > _ref3; i = 0 <= _ref3 ? ++_m : --_m) {
            unit = square.units()[i];
            if (unit.owner === vm.accountID) {
              square.wallHealth(square.wallHealth() + unit.amount() * 2);
              square.units.splice(i, 1);
              break;
            } else {
              _results2.push(void 0);
            }
          }
          return _results2;
        }
      };
      vm.loadSector = function(col, row) {
        vm.sectors.push({
          col: col,
          row: row
        });
        return;
        return $.getJSON('/api/sector/' + col + '/' + row + '/' + SECTOR_SIZE + '/' + SECTOR_SIZE + '/', function(data, status) {
          var i, player, square, unit, units, vmSquare, vmSquares, xOffset, yOffset, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
          if (status === 'success') {
            xOffset = -vm.topCoords()[0];
            yOffset = -vm.sideCoords()[0];
            vmSquares = vm.squares();
            _ref = data.squares;
            for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
              square = _ref[i];
              units = [];
              _ref1 = square.units;
              for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                unit = _ref1[_j];
                units.push({
                  owner: unit.owner,
                  ownerColor: unit.owner_color,
                  square: square.id,
                  amount: ko.observable(unit.amount),
                  last_turn_amount: unit.last_turn_amount
                });
              }
              vmSquare = vmSquares[i];
              vmSquare.id(square.id);
              vmSquare.left(((square.x + xOffset) * GRID_SIZE) + 'px');
              vmSquare.top(((square.y + yOffset) * GRID_SIZE) + 'px');
              vmSquare.units(units);
              vmSquare.owner(square.owner);
              vmSquare.ownerColor(square.owner_color);
              vmSquare.x(square.x);
              vmSquare.y(square.y);
              vmSquare.wallHealth(square.wall_health);
              vmSquare.resourceAmount(square.resource_amount);
              console.log('updating square');
            }
            vm.unitsRemaining(data.total_units - data.units_placed);
            vm.totalUnits(data.total_units);
            _ref2 = data.players_visible;
            for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
              player = _ref2[_k];
              vm.players.push(player);
            }
            if (data.is_initial) {
              vm.unitAction('initial');
            } else {
              vm.unitAction('place');
            }
            return $('.spinner').hide();
          } else {
            return alert(JSON.stringify(data));
          }
        });
      };
      vm.loadSector(vm.viewX(), vm.viewY());
      return null;
    };
    ko.applyBindings(new gameViewModel);
    opts = {
      lines: 13,
      length: 40,
      width: 16,
      radius: 60,
      corners: 1,
      rotate: 0,
      direction: 1,
      color: '#000',
      speed: 2.2,
      trail: 60,
      shadow: true,
      hwaccel: true,
      className: 'spinner',
      zIndex: 2e9,
      top: (getViewHeight() * GRID_SIZE) / 2 - 120,
      left: 'auto'
    };
    spinner = new Spinner(opts).spin($('#board').get(0));
    return $('#board').width(getViewWidth() * GRID_SIZE).height(getViewHeight() * GRID_SIZE);
  }
};

$(function() {
  var cl;
  $.ajaxSetup({
    crossDomain: false,
    beforeSend: function(xhr, settings) {
      if (!/^(GET|HEAD|OPTIONS|TRACE)$/.test(settings.type)) {
        return xhr.setRequestHeader("X-CSRFToken", $.cookie('csrftoken'));
      }
    }
  });
  cl = $('body').attr('class');
  if (cl) {
    return GAME[cl]();
  }
});
