/*
Create a list of hexidecimal colors with "DEAD" in the string, sort them, then make an Adobe color file.
 */


var aco = require('./../aco');
var color = require('./../lib/color-utils');

var hex="DEAD";
var colors = [];

function verifyHex(hex) {
    var valid = true;

    if ('string' === typeof hex) {
        valid = hex.length > 0 && hex.length <= 6;
        for (var i = 0, l = hex.length; i < l && valid; i++) {
            var parsed = parseInt(hex.charAt(i), 16);
            if (isNaN(parsed) || parsed < 0 || parsed > 16) {
                valid = false;
            }
        }
    }

    return valid;
}

function makeColorInfo(color) {
    return {
        color: color,
        name: color
    };
}


var isValid = verifyHex(hex);
if (!isValid) {
    console.log('Invalid HEX code: %s', hex);
    process.exit(1);
}

//Populate colors
//TODO create colors objects, not just an array of strings.
var fff = 'FFFFFF';
fff = fff.slice(hex.length);
var total = parseInt(fff, 16);

for (var i = 0, l = total; i <= l; i++) {
    var len = fff.length;
    var hexI = i.toString(16);
    if (hexI.length >= 1 && hexI.length < len) hexI = ('000000' + hexI).slice(-len);

    //Front
    colors.push(makeColorInfo(hexI + hex));

    //Back
    colors.push(makeColorInfo(hex + hexI));

    //Mid
    for (var n = 1, m = hexI.length; n < m; n++) {
        colors.push(makeColorInfo(hexI.slice(0, m - n) + hex + hexI.slice(m-n)));
    }

}

console.log(colors);

//TODO Sort Colors by HSL
var reds = [], blues = [], greens = [];
colors.forEach(function(rgb) {
    var hsl = color.rgbToHsl(color.hexToRgb(rgb.color));
    var h = hsl[0] * 360;
    if (h < 120) {
        reds.push(rgb);
    } else if (h >= 120 && h < 240) {
        greens.push(rgb);
    } else if (h >= 240) {
        blues.push(rgb);
    }
});

function satSort(a, b) {
    return color.rgbToHsl(color.hexToRgb(a.color))[2] - color.rgbToHsl(color.hexToRgb(b.color))[2];
}

reds = reds.sort(satSort);
greens = greens.sort(satSort);
blues = blues.sort(satSort);

colors = [].concat(reds).concat(greens).concat(blues);

//Create the write stream
aco.make('HexColors-' + hex + '-' + (new Date).getTime() + '.aco', colors, function(err, aco) {
    aco.on('finish', function() {
        console.log("Finished file for %s located at %s", hex, aco.path);
    });
});
