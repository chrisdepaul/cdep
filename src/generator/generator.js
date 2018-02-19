const fs = require('fs');
const { join, repeat } = require('ramda')

class GenerateKSP {
    constructor(config) {
        this.instrumentName = config.instrumentName;
        this.path = require('path').join(require('os').homedir(), 'Desktop');
        this.fileName = config.instrumentName + '.ksp'
        this.filePath = `${this.path}/${this.fileName}`
        this.fd = this.openFile(this.filePath)
    }

    openFile (filepath) {
        return fs.openSync(`${filepath}`, 'w')
    }

    closeFile () {
        if (this.fd) {
            fs.close(this.fd, () => {
                console.log('The KSP has been genereated!');
                console.log(`File saved at ${this.filePath}`)
            });
        }
    }

    writeCode (code, indents) {
        let buffer = new Buffer(this.makeIndents(indents) + code + '\n')        
        fs.write(this.fd, buffer, 0, buffer.length, null, (err) => {
            if (err) throw 'error writing file: ' + err;
        });
    }

    writeComment (comment, indents) {
        let buffer = new Buffer('\n' + this.makeIndents(indents) + '{' + comment + '}' + '\n')        
        fs.write(this.fd, buffer, 0, buffer.length, null, (err) => {
            if (err) throw 'error writing file: ' + err;
        });
    }

    blankLine () {
        let buffer = new Buffer('\n')        
        fs.write(this.fd, buffer, 0, buffer.length, null, (err) => {
            if (err) throw 'error writing file: ' + err;
        });
    }

    makeIndents (num) {
        return join('', repeat('\t', num))
    }
}

export default GenerateKSP;


