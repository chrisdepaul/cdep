'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var inquirer = require('inquirer');

var _require = require('ramda'),
    keys = _require.keys;

var rk = require('randomkey');
var q = require('./questions');

var _require2 = require('./instrumentConfig.js'),
    config = _require2.config;

var _require3 = require('./componentConstants.js'),
    UI_FUNCTIONS = _require3.UI_FUNCTIONS;

var _require4 = require('../generator'),
    createKSP = _require4.createKSP;

/**
 * Launch questions
 */


var launch = exports.launch = function launch() {
    askInstrumentName();
};

/**
 * Input: Ask the name of the instrument
 */
var askInstrumentName = function askInstrumentName() {
    inquirer.prompt(q.askInstrumentNameQ).then(function (response) {
        config.instrumentName = response.instrumentName;
        askUIComponents();
    });
};

/**
 * List: Ask which UI components to include
 */
var askUIComponents = function askUIComponents() {
    inquirer.prompt(q.askUIComponentsQ).then(function (response) {
        config.uiComponents = {};
        response.uiComponents.forEach(function (comp) {
            config.uiComponents[comp] = {};
        });
        askUIComponentsQuantity();
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
    chain.then(askUIComponentDetails);
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
                        componentFunction: UI_FUNCTIONS[response.componentFunction],
                        min: response.componentMin,
                        max: response.componentMax
                    };
                });
            });
        });
    });

    chain.then(function () {
        createKSP(config);
    });
};