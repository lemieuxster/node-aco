var fs = require('fs');
var color = require('./lib/color-utils');

var colorException = {};

//ACO files take 16 bit words.
function writeValue(writeStream, value) {
    var buffer = new Buffer(2);
    buffer.writeUInt16BE(value, 0);
    writeStream.write(buffer);
}

//Convenient way to write RGB integer values. Expected with this multiplier.
function writeRGBValue(writeStream, value) {
    writeValue(writeStream, value  * 256);
}

//Convenient for adding zero
function writeZero(writeStream) {
    writeValue(writeStream, 0);
}

function readValue(readBuffer) {
    return readBuffer.readUInt16BE(0);
}

function readRGBValue(readBuffer) {
    return readValue(readBuffer) / 256;
}

function readCharValue(readBuffer) {
    return String.fromCharCode(readValue(readBuffer));
}

function sanitizeFilename(filename) {
    filename = filename || 'aco-' + new Date() + '.aco';
    if (filename.lastIndexOf('.aco') !== filename.length - 4) filename = filename + '.aco';
    return filename;
}

exports.make = function(filename, colors, callback) {
    filename = sanitizeFilename(filename);

    colors = colors instanceof Array ? colors : [];

    var aco = fs.createWriteStream(filename);

    //Version 2
    writeValue(aco, 2);

    //Number of colors
    writeValue(aco, colors.length);

    try {
        //For each color, add value and name
        colors.forEach(function(colorInfo) {
            var hex = colorInfo.color;
            var name = colorInfo.name || hex;

            //Parse RGB
            var rgb = color.hexToRgb(hex);
            rgb = rgb.filter(function(value) {
                return !isNaN(value);
            });

            //Make sure we have valid values
            if (rgb.length < 3) {
                throw colorException;
            }

            //Write 0, for RGB color space
            writeZero(aco);

            //R
            writeRGBValue(aco, rgb[0]);
            //G
            writeRGBValue(aco, rgb[1]);
            //B
            writeRGBValue(aco, rgb[2]);
            //Pad (we need w, x, y, and z values. RGB only has w, x, y - so z is zero.
            writeZero(aco);

            //Name
            writeZero(aco);
            writeValue(aco, name.length + 1);
            for(var i = 0, l = name.length; i < l; i++) {
                writeValue(aco, name.charCodeAt(i));
            }
            writeZero(aco);
        });
    } catch (e) {
        var error = "Parse Error";
        if (e === colorException) {
            error = "Invalid Color";
        }

        if (callback && 'function' === typeof callback) {
            callback(error);
        } else {
            throw new Error(error);
        }
    }

    aco.end();

    if (callback && 'function' === typeof callback) {
        callback(null, aco);
    }
};
