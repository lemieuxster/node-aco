var aco = require('../aco');

var colorsArray = [
    {
        color: "#FF9900",
        name: "Awesome Orange"
    }
];

aco.make('AcoFilePath.aco', colorsArray, function(err, aco) {
    console.log("aco callback");
    aco.on('finish', function() {
        console.log('aco write finished', aco.path);
    });
});