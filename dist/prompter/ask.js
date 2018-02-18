'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var inquirer = require('inquirer');

var _require = require('ramda'),
    keys = _require.keys,
    invert = _require.invert,
    pathOr = _require.pathOr,
    isEmpty = _require.isEmpty;

var rk = require('randomkey');
var q = require('./questions');

var _require2 = require('./instrumentConfig.js'),
    config = _require2.config;

var _require3 = require('./componentConstants.js'),
    UI_FUNCTIONS = _require3.UI_FUNCTIONS,
    KNOB_UNIT = _require3.KNOB_UNIT,
    UI_FUNCTIONS_SELECTION_NAMES = _require3.UI_FUNCTIONS_SELECTION_NAMES,
    OTHER_COMPONENTS = _require3.OTHER_COMPONENTS;

var _require4 = require('../generator'),
    createKSP = _require4.createKSP;

/**
 * Launch questions
 */


var launch = exports.launch = function launch() {
    nextQuestion.ask();
};

/**
 * Input: Ask the name of the instrument
 */
var askInstrumentName = function askInstrumentName() {
    inquirer.prompt(q.askInstrumentNameQ).then(function (response) {
        config.instrumentName = response.instrumentName;
        nextQuestion.ask();
    });
};

/**
 * List: Ask which UI components to include
 */
var askUIComponents = function askUIComponents() {
    inquirer.prompt(q.askUIComponentsQ).then(function (response) {
        if (!isEmpty(pathOr(false, ['uiComponents'], response))) {
            config.uiComponents = {};
            response.uiComponents.forEach(function (comp) {
                config.uiComponents[comp] = {};
            });
        }
        nextQuestion.ask();
    });
};

/** 
 * For each UI component, ask how many
*/
var askUIComponentsQuantity = function askUIComponentsQuantity() {
    // For each UI component, ask how many, the name of each, function, min, max
    var keysComp = keys(config.uiComponents);
    var chain = Promise.resolve();

    keysComp.forEach(function (comp, i) {
        chain = chain.then(function () {
            return inquirer.prompt(q.getUIComponentQuantityQuestion(comp)).then(function (response) {
                // Save component keys to config object
                for (var j = 0; j < response.numberOfComponent; j++) {
                    var key = rk(3);
                    config.uiComponents[comp][key] = {};
                }
            });
        });
    });

    // Call next question series
    chain.then(nextQuestion.ask);
};

/**
 * For each UI component, ask the name of each, function, min, max
*/
var askUIComponentDetails = function askUIComponentDetails() {
    var compList = keys(config.uiComponents);
    var chain = Promise.resolve();

    compList.forEach(function (comp, i) {
        var itemList = keys(config.uiComponents[comp]);
        itemList.forEach(function (item, j) {
            var askUIComponentDetailQ = q.getUIComponentDetailQuestion(comp, j);
            chain = chain.then(function () {
                return inquirer.prompt(askUIComponentDetailQ).then(function (response) {
                    config.uiComponents[comp][item] = {
                        name: response.componentName,
                        variableName: '$' + response.componentName,
                        componentFunction: UI_FUNCTIONS[invert(UI_FUNCTIONS_SELECTION_NAMES)[response.componentFunction]],
                        unit: KNOB_UNIT[response.unit],
                        min: response.componentMin,
                        max: response.componentMax,
                        default: response.default,
                        group: response.group,
                        slot: response.slot
                    };
                });
            });
        });
    });

    chain.then(function () {
        nextQuestion.ask();
    });
};

var askOtherComponents = function askOtherComponents() {
    var chain = Promise.resolve();
    chain = chain.then(function () {
        return inquirer.prompt(q.askOtherComponentsQ).then(function (response) {
            if (!isEmpty(pathOr(false, ['otherComponents'], response))) {
                config.otherComponents = {};
                response.otherComponents.forEach(function (comp) {
                    config.otherComponents[invert(OTHER_COMPONENTS)[comp][0]] = {};
                });
            }
        });
    });

    // Call next question series
    chain.then(nextQuestion.ask);
};

var askOtherComponentsDetails = function askOtherComponentsDetails() {
    var compList = keys(config.otherComponents);
    var chain = Promise.resolve();

    compList.forEach(function (comp, i) {
        // Ask about Modifier Keys
        if (comp == 'modifierKeys') {
            chain = chain.then(function () {
                return inquirer.prompt(q.askModifierKeysDetailsQ).then(function (response) {
                    config.otherComponents.modifierKeys.first = response.modifier_first;
                    config.otherComponents.modifierKeys.last = response.modifier_last;
                });
            });
        }
    });
    // Call next question series
    chain.then(nextQuestion.ask);
};

/**
 * Input: Place components in grid
 */
var askPlaceComponents = function askPlaceComponents() {
    var compList = keys(config.uiComponents);
    if (!isEmpty(compList)) {
        inquirer.prompt(q.askPlaceComponentsQ).then(function (response) {
            config.placeComponents = response.placeComponents;
            nextQuestion.ask();
        });
    }
};

/**
 * Input: Use custome graphics
 */
var askCustomGraphics = function askCustomGraphics() {
    var compList = keys(config.uiComponents);
    if (!isEmpty(compList)) {
        inquirer.prompt(q.askCustomGraphicsQ).then(function (response) {
            config.customGraphics = response.customGraphics;
            nextQuestion.ask();
        });
    }
};

/**
 * Input: Ask the size of the instrument view
 */
var askUIHeight = function askUIHeight() {
    inquirer.prompt(q.askUIHeightQ).then(function (response) {
        config.uiHeight = response.uiHeight;
        nextQuestion.ask();
    });
};

/** 
 * Set the order of questions to ask
*/
var questionController = function questionController() {
    var index = 0;
    var askQuestion = [askInstrumentName, askUIComponents, askUIComponentsQuantity, askUIComponentDetails, askOtherComponents, askOtherComponentsDetails, askPlaceComponents, askCustomGraphics, askUIHeight];

    return {
        ask: function ask() {
            if (askQuestion[index]) {
                askQuestion[index]();
                index++;
            } else {
                createKSP(config);
            }
        }
    };
};

var nextQuestion = new questionController();