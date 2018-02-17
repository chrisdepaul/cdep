'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');

var _require = require('ramda'),
    join = _require.join,
    repeat = _require.repeat;

var GenerateKSP = function () {
    function GenerateKSP(config) {
        _classCallCheck(this, GenerateKSP);

        this.instrumentName = config.instrumentName;
        this.path = 'ksp';
        this.fileName = config.instrumentName + '.ksp';
        this.filePath = this.path + '/' + this.fileName;
        this.fd = this.openFile(this.filePath);
    }

    _createClass(GenerateKSP, [{
        key: 'openFile',
        value: function openFile(filepath) {
            return fs.openSync('' + filepath, 'w');
        }
    }, {
        key: 'closeFile',
        value: function closeFile() {
            if (this.fd) {
                fs.close(this.fd, function () {
                    console.log('wrote the file successfully');
                });
            }
        }
    }, {
        key: 'writeCode',
        value: function writeCode(code, indents) {
            var buffer = new Buffer(this.makeIndents(indents) + code + '\n');
            fs.write(this.fd, buffer, 0, buffer.length, null, function (err) {
                if (err) throw 'error writing file: ' + err;
            });
        }
    }, {
        key: 'writeComment',
        value: function writeComment(comment, indents) {
            var buffer = new Buffer('\n' + this.makeIndents(indents) + '{' + comment + '}' + '\n');
            fs.write(this.fd, buffer, 0, buffer.length, null, function (err) {
                if (err) throw 'error writing file: ' + err;
            });
        }
    }, {
        key: 'makeIndents',
        value: function makeIndents(num) {
            return join('', repeat('\t', num));
        }
    }]);

    return GenerateKSP;
}();

exports.default = GenerateKSP;