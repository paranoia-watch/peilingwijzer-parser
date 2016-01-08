var peilingWijzerParser = require(__dirname + "/../app"),
    exportURL = "/Users/woutervroege/Desktop/onzin.json";

peilingWijzerParser.saveToDisk(exportURL, function() {
    console.log("json file saved at " + exportURL);
});