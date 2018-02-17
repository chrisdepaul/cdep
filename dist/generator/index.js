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

    startOnInit(ksp);
    initialization(ksp, config, 1);
    declareComponents(ksp, config, 1);

    groupsAndSlots(ksp, config, 1);
    powerComponents(ksp, config, 1);

    makePersistant(ksp, config, 1);
    readPersistant(ksp, config, 1);
    endOn(ksp);

    ksp.closeFile();
};

var startOnInit = function startOnInit(ksp) {
    ksp.writeCode('on init', 0);
};

var endOn = function endOn(ksp) {
    ksp.writeCode('end on', 0);
};

var initialization = function initialization(ksp, config, tabLevel) {
    ksp.writeCode('message("")', tabLevel);
    ksp.writeCode('make_perfview', tabLevel);
    ksp.writeCode('set_ui_height_px(330)', tabLevel);
};

var declareComponents = function declareComponents(ksp, config, tabLevel) {
    var uic = path(['uiComponents'], config);
    keys(uic).forEach(function (comp) {
        ksp.writeComment('Declare UI Components - ' + comp, tabLevel);
        var uiArray = '%ui_' + comp.slice(0, -1) + '_id';
        var uiArrayLength = keys(path([comp], uic)).length;
        var id_array = [];
        ksp.writeCode('declare ' + uiArray + '[' + uiArrayLength + ']', tabLevel);
        keys(path([comp], uic)).forEach(function (key, i) {
            var item = path([comp, key], uic);
            switch (comp) {
                case 'knobs':
                    ksp.writeCode('declare ui_knob ' + item.variableName + ' (' + item.min + ', ' + item.max + ', 1)', tabLevel);
                    break;

                case 'sliders':
                    ksp.writeCode('declare ui_slider ' + item.variableName + ' (' + item.min + ', ' + item.max + ')', tabLevel);
                    break;
            }

            // Save id array for after declarations
            id_array.push(uiArray + '[' + i + '] = get_ui_id(' + item.variableName + ')');
        });

        // Write id array code
        id_array.forEach(function (item) {
            return ksp.writeCode(item, tabLevel);
        });
    });
};

// This is all static right now...should be configurable
var groupsAndSlots = function groupsAndSlots(ksp, config, tabLevel) {
    ksp.writeComment('Setting Group and Env', tabLevel);

    ksp.writeCode('declare $group_idx', tabLevel);
    ksp.writeCode('declare $slot_idx', tabLevel);
    ksp.writeCode('$group_idx := 0', tabLevel);
    ksp.writeCode('$slot_idx := 0', tabLevel);
};

var powerComponents = function powerComponents(ksp, config, tabLevel) {
    var uic = path(['uiComponents'], config);
    ksp.writeComment('Power Variables', tabLevel);
    keys(uic).forEach(function (comp) {
        keys(path([comp], uic)).forEach(function (key, i) {
            var item = path([comp, key], uic);
            // indexs are static for now
            ksp.writeCode(item.variableName + ' := get_engine_par(' + item.componentFunction + ', $group_idx, $slot_idx, -1)', tabLevel);
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