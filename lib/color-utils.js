
//Somewhat hacky way to convert Hex Color to RGB Array.
exports.hexToRgb = function(hex){
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
       parseInt(result[1], 16), //R
       parseInt(result[2], 16), //G
       parseInt(result[3], 16)  //B
    ] : null;
};

//Convert rgb array to hsl array
exports.rgbToHsl = function(rgb) {
    var r = rgb[0], g = rgb[1], b = rgb[2];
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min)
    {
        h = s = 0; // achromatic
    }
    else
    {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max)
        {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
};
