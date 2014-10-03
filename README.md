Node Adobe Color File Writer
============================

Given an array of color info objects like

    [{
        color: "#FF9900",
        name: "Awesome Orange"
    }]

Write an Adobe Color file (.aco) to the given path.

    var aco = require('aco');

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

The callback gets the writeable stream for the `.aco` file, with `.end()` having been already called. It is possible to listen for the `finish` event as well as get the path. The `.aco` file can then be used in Photoshop and imported to the swatches panel.

Credit to [Larry Tesler for explaining the spec](http://www.nomodes.com/aco.html)


