/*
Create a list of hexidecimal colors with "DEAD" in the string, sort them, then make an Adobe color file.
 */


var aco = require('./../aco');
var color = require('./../lib/color-utils');

var colors = [];

function makeColorInfo(color) {
    return {
        color: color,
        name: color
    };
}

//Populate colors
//TODO create colors objects, not just an array of strings.
for (var i = 0, l = 255; i <= l; i++) {
    var hexI = i.toString(16);
    if (hexI.length < 2) hexI = "0" + hexI;
    colors.push(makeColorInfo(hexI + "DEAD"));
    colors.push(makeColorInfo("DEAD" + hexI));
    colors.push(makeColorInfo((hexI.charAt(0) || "0") + "DEAD" + (hexI.charAt(1) || "0")));
}

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
aco.make('DeadColors.aco', colors, function(err, aco) {
    console.log("Callback");
    aco.on('finish', function() {
        console.log("Finished", aco.path);
    });
});
