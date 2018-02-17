'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');

var GenerateKSP = function () {
    function GenerateKSP(config) {
        _classCallCheck(this, GenerateKSP);

        this.instrumentName = config.instrumentName;
        this.fileName = config.instrumentName + '.ksp';
    }

    _createClass(GenerateKSP, [{
        key: 'getFileName',
        value: function getFileName() {
            return this.instrumentName + '.ksp';
        }
    }, {
        key: 'writeCode',
        value: function writeCode(code) {
            var buffer = new Buffer(code);
            fs.open('ksp/' + this.getFileName(), 'w', function (err, fd) {
                if (err) {
                    throw 'could not open file: ' + err;
                }

                // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
                fs.write(fd, buffer, 0, buffer.length, null, function (err) {
                    if (err) throw 'error writing file: ' + err;
                    fs.close(fd, function () {
                        console.log('wrote the file successfully');
                    });
                });
            });
        }
    }]);

    return GenerateKSP;
}();

exports.default = GenerateKSP;