'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var GenerateKSP = require('./generator.js').default;

var _require = require('ramda'),
    keys = _require.keys,
    path = _require.path;

var createKSP = exports.createKSP = function createKSP(config) {
    var ksp = new GenerateKSP(config);

    startOnInit(ksp, 0);
    initialization(ksp, config, 1);
    declareComponents(ksp, config, 1);
    makePersistant(ksp, config, 1);
    readPersistant(ksp, config, 1);
    endOn(ksp, 0);

    generateOnUIControl(ksp, config, 0);

    ksp.closeFile();
};

var startOnInit = function startOnInit(ksp, tabLevel) {
    ksp.writeCode('on init', tabLevel);
};

var endOn = function endOn(ksp, tabLevel) {
    ksp.writeCode('end on', tabLevel);
};

var initialization = function initialization(ksp, config, tabLevel) {
    ksp.writeCode('message("")', tabLevel);
    ksp.writeCode('make_perfview', tabLevel);
    ksp.writeCode('set_ui_height_px(' + config.uiHeight + ')', tabLevel);
};

var declareComponents = function declareComponents(ksp, config, tabLevel) {
    var uic = path(['uiComponents'], config);
    keys(uic).forEach(function (comp) {
        ksp.writeComment('Declare UI Components - ' + comp, tabLevel);
        var uiArray = '%ui_' + comp.slice(0, -1) + '_id';
        var uiArrayLength = keys(path([comp], uic)).length;
        var id_array = [];
        var units_array = [];
        ksp.writeCode('declare ' + uiArray + '[' + uiArrayLength + ']', tabLevel);
        ksp.blankLine();
        keys(path([comp], uic)).forEach(function (key, i) {
            var item = path([comp, key], uic);

            if (comp == 'knobs') {
                ksp.writeCode('declare ui_knob ' + item.variableName + ' (' + item.min + ', ' + item.max + ', 1)', tabLevel);
            } else if (comp == 'sliders') {
                ksp.writeCode('declare ui_slider ' + item.variableName + ' (' + item.min + ', ' + item.max + ')', tabLevel);
            } else {
                ksp.writeComment('Error: Declaring UI', tabLevel);
            }

            ksp.writeCode(uiArray + '[' + i + '] := get_ui_id(' + item.variableName + ')', tabLevel);

            if (comp == 'knobs') {
                ksp.writeCode('set_knob_unit(' + item.variableName + ', ' + item.unit + ')', tabLevel);
                ksp.writeCode('set_knob_defval(' + item.variableName + ', ' + item.default + ')', tabLevel);
            }

            ksp.writeCode('declare ' + item.variableName + '_group', tabLevel);
            ksp.writeCode('declare ' + item.variableName + '_slot', tabLevel);
            ksp.writeCode(item.variableName + '_group := ' + item.group, tabLevel);
            ksp.writeCode(item.variableName + '_slot := ' + item.slot, tabLevel);
            ksp.writeCode(item.variableName + ' := get_engine_par(' + item.componentFunction + ', ' + item.variableName + '_group, ' + item.variableName + '_slot, -1)', tabLevel);
            if (comp == 'knobs') {
                ksp.writeCode('set_knob_label(' + item.variableName + ', get_engine_par_disp(' + item.componentFunction + ', ' + item.variableName + '_group, ' + item.variableName + '_slot, -1))', tabLevel);
            }
            ksp.blankLine();
        });
    });
};

var makePersistant = function makePersistant(ksp, config, tabLevel) {
    var uic = path(['uiComponents'], config);
    ksp.writeComment('Make Variable Persistant', tabLevel);
    keys(uic).forEach(function (comp) {
        keys(path([comp], uic)).forEach(function (key, i) {
            var item = path([comp, key], uic);
            ksp.writeCode('make_persistent(' + item.variableName + ')', tabLevel);
        });
    });
};

var readPersistant = function readPersistant(ksp, config, tabLevel) {
    var uic = path(['uiComponents'], config);
    ksp.writeComment('Read Persistant Variable', tabLevel);
    keys(uic).forEach(function (comp) {
        keys(path([comp], uic)).forEach(function (key, i) {
            var item = path([comp, key], uic);
            ksp.writeCode('read_persistent_var(' + item.variableName + ')', tabLevel);
        });
    });
};

var generateOnUIControl = function generateOnUIControl(ksp, config, tabLevel) {
    var uic = path(['uiComponents'], config);
    keys(uic).forEach(function (comp) {
        keys(path([comp], uic)).forEach(function (key, i) {
            var item = path([comp, key], uic);
            ksp.blankLine();
            ksp.writeCode('on ui_control(' + item.variableName + ')', tabLevel);
            ksp.writeCode('declare $count := 0', tabLevel + 1);
            ksp.writeCode('while ($count < $NUM_GROUPS)', tabLevel + 1);
            ksp.writeCode('set_engine_par(' + item.componentFunction + ', ' + item.variableName + ', $count, ' + item.variableName + '_slot, -1)', tabLevel + 2);
            ksp.writeCode('inc($count)', tabLevel + 2);
            ksp.writeCode('end while', tabLevel + 1);
            ksp.writeCode('end on', tabLevel);
        });
    });
};