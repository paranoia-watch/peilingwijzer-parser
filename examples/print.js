var peilingWijzerParser = require(__dirname + "/../app"),
    exportURL = "/Users/woutervroege/Desktop/onzin.json";

peilingWijzerParser.get(function(json) {
    console.log(json);
});