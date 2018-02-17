const fs = require('fs');

class GenerateKSP {
    constructor(config) {
        this.instrumentName = config.instrumentName;
        this.fileName = config.instrumentName + '.ksp'
    }

    getFileName () {
        return this.instrumentName + '.ksp';
    }

    writeCode (code) {
        let buffer = new Buffer(code)
        fs.open(`ksp/${this.getFileName()}`, 'w', function(err, fd) {  
            if (err) {
                throw 'could not open file: ' + err;
            }
        
            // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
            fs.write(fd, buffer, 0, buffer.length, null, function(err) {
                if (err) throw 'error writing file: ' + err;
                fs.close(fd, function() {
                    console.log('wrote the file successfully');
                });
            });
        });
    }
}

export default GenerateKSP;


