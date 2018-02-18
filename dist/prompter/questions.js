'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.askUIHeightQ = exports.askCustomGraphicsQ = exports.askPlaceComponentsQ = exports.askModifierKeysDetailsQ = exports.askOtherComponentsQ = exports.getUIComponentDetailQuestion = exports.getUIComponentQuantityQuestion = exports.askUIComponentsQ = exports.askInstrumentNameQ = undefined;

var _componentConstants = require('./componentConstants.js');

var _require = require('ramda'),
    keys = _require.keys,
    values = _require.values,
    isEmpty = _require.isEmpty;

var _require2 = require('./componentConstants.js'),
    UI_COMPONENTS = _require2.UI_COMPONENTS,
    UI_FUNCTIONS = _require2.UI_FUNCTIONS,
    KNOB_UNIT = _require2.KNOB_UNIT,
    OTHER_COMPONENTS = _require2.OTHER_COMPONENTS;

var askInstrumentNameQ = exports.askInstrumentNameQ = [{
    type: 'input',
    name: 'instrumentName',
    message: 'What\'s the instrument\'s name?',
    validate: function validate(input) {
        return isEmpty(input) ? 'Must provide name' : true;
    }
}];

var askUIComponentsQ = exports.askUIComponentsQ = [{
    type: 'checkbox',
    name: 'uiComponents',
    message: 'Select the UI components you want...',
    choices: function choices() {
        return keys(UI_COMPONENTS).map(function (key) {
            return UI_COMPONENTS[key];
        });
    }
}];

var getUIComponentQuantityQuestion = exports.getUIComponentQuantityQuestion = function getUIComponentQuantityQuestion(component) {
    return [{
        type: 'input',
        name: 'numberOfComponent',
        message: 'How many ' + component + ' do you want?',
        validate: requireInput
    }];
};

var getUIComponentDetailQuestion = exports.getUIComponentDetailQuestion = function getUIComponentDetailQuestion(component, index) {
    var comp = component.slice(0, -1);
    return [{
        type: 'input',
        name: 'componentName',
        message: 'Name ' + comp + ' ' + (index + 1) + ':',
        default: '' + comp + (index + 1)
    }, {
        type: 'list',
        name: 'componentFunction',
        message: 'What\'s the function of this ' + comp + '?',
        choices: function choices() {
            return values(_componentConstants.UI_FUNCTIONS_SELECTION_NAMES).map(function (key) {
                return key;
            });
        }
    }, {
        type: 'list',
        name: 'unit',
        message: 'What\'s the unit of this ' + comp + '?',
        choices: function choices() {
            return keys(KNOB_UNIT).map(function (key) {
                return key;
            });
        },
        when: function when() {
            return comp == 'knob';
        }
    }, {
        type: 'input',
        name: 'componentMin',
        message: 'Set the minimum function setting:',
        default: '0'
    }, {
        type: 'input',
        name: 'componentMax',
        message: 'Set the maximum function setting:',
        default: '100000'
    }, {
        type: 'input',
        name: 'default',
        message: 'Set the default setting:',
        default: '0'
    }, {
        type: 'input',
        name: 'group',
        message: 'Set the group index:',
        default: '0'
    }, {
        type: 'input',
        name: 'slot',
        message: 'Set the slot index:',
        default: '0'
    }];
};

var askOtherComponentsQ = exports.askOtherComponentsQ = [{
    type: 'checkbox',
    name: 'otherComponents',
    message: 'Do you want additional components?',
    choices: function choices() {
        return keys(OTHER_COMPONENTS).map(function (key) {
            return OTHER_COMPONENTS[key];
        });
    }
}];

var askModifierKeysDetailsQ = exports.askModifierKeysDetailsQ = [{
    type: 'input',
    name: 'modifier_first',
    message: 'first modifier key:',
    default: '1'
}, {
    type: 'input',
    name: 'modifier_last',
    message: 'last modifier key:',
    default: '12'
}];

var askPlaceComponentsQ = exports.askPlaceComponentsQ = [{
    type: 'list',
    name: 'placeComponents',
    message: 'Place the compoments in a grid?',
    choices: ['yes', 'no'],
    filter: function filter(input) {
        return input === 'yes' ? true : false;
    }
}];

var askCustomGraphicsQ = exports.askCustomGraphicsQ = [{
    type: 'list',
    name: 'customGraphics',
    message: 'Use custom graphics?',
    choices: ['yes', 'no'],
    filter: function filter(input) {
        return input === 'yes' ? true : false;
    }
}];

var askUIHeightQ = exports.askUIHeightQ = [{
    type: 'input',
    name: 'uiHeight',
    message: 'What\'s the UI height?',
    default: '330'
}];

var requireInput = function requireInput(input) {
    return isEmpty(input) ? 'Response can\'t be empty' : true;
};