'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var GenerateKSP = require('./generator.js').default;

var createKSP = exports.createKSP = function createKSP(config) {
    var ksp = new GenerateKSP(config);
    ksp.writeCode(JSON.stringify(config));
};