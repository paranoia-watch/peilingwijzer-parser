/*
 * @package peilingwijzer-parser
 * @copyright Copyright(c) 2016 Paranoia Watch <info AT paranoia.watch>
 * @author Wouter Vroege <wouter AT woutervroege DOT nl>
 */

var fs = require("fs"),
    https = require("https"),
    argv = require('minimist')(process.argv.slice(2)),
    INPUT_FILE = argv.I,
    OUTPUT_FILE = argv.O;

function main(callback) {
    getFileContents(function(fileData) {
        var fieldNames = parseFieldNamesFromFileData(fileData);
        var rowsData = parseDataRowsFromFileData(fileData);
        var data = parseObjectFromRowsDataAndFieldNames(rowsData, fieldNames);
        var json = serveData(data);
        if(callback) callback(json);      
    });
}

function getFileContents(callback) {
    if(!INPUT_FILE) return downloadFileContentsFromURL(callback);
    getLocalFileContents(callback);
}

function downloadFileContentsFromURL(callback) {
    var chunks = [];
    https.get("https://dl.dropboxusercontent.com/u/31727287/Peilingwijzer/Last/Results_DyGraphs.txt", function(res) {
        // if(err) return console.error("Error downloading file", err);
        res.on("data", function(chunk) {
            chunks.push(chunk);
        })
        res.on("end", function() {
            var data = chunks.join("").toString();
            callback(data);
        })
    })
}

function getLocalFileContents(callback) {
    return fs.readFile(INPUT_FILE, function(err, data) {
        if(err) return console.error("Error reading file", err);
        callback(data.toString());
    })
}

function parseFieldNamesFromFileData(fileData) {
    var headerRowData = fileData.split(/\n/g)[0];
    headerRowFields = headerRowData.split(",").slice(this.length, -1);
    return headerRowFields;
}

function parseDataRowsFromFileData(fileData) {
    return fileData.split(/\n/g).slice(1,-1);
}

function parseObjectFromRowsDataAndFieldNames(rowsData, fieldNames) {
    return rowsData.map(function(rowData) {
        return parseSingleObjectFromRowDataAndFieldNames(rowData, fieldNames);
    })
}

function parseSingleObjectFromRowDataAndFieldNames(rowData, fieldNames) {
    var object = {};
    var cellValues = getCellValuesByRowData(rowData);
    if(fieldNames.length !== cellValues.length) return console.error("number of field names ("+fieldNames.length+") doesn't match the number of cell values ("+cellValues.length+")");   
    for(var i in fieldNames) {
        object[fieldNames[i]] = parseCellValueByRawValueAndColumnIndex(cellValues[i], i);
    }
    return object;
}

function parseCellValueByRawValueAndColumnIndex(rawValue, columnIndex) {
    if(columnIndex == 0) return parseCellDateStringToDate(rawValue);
    return getAverageByRawCellValue(rawValue);   
}

function parseCellDateStringToDate(cellDateString) {
    var stringParts = cellDateString.split("-");
    var year = stringParts[0];
    var month = parseInt(stringParts[1])-1;
    var day = stringParts[2];
    return new Date(year, month, day);
}

function getAverageByRawCellValue(cellValue) {
    var numberOfComponents = getNumberOfComponentsByCellValue(cellValue);
    var cumulation = parseCellValueFormulaToNumber(cellValue);
    var average = calculateAverageByCellValueAndNumberOfComponents(cumulation, numberOfComponents);
    return average;
}

function getNumberOfComponentsByCellValue(cellValue) {
    return cellValue.split("+").length;
} 

function parseCellValueFormulaToNumber(cellValue) {
    var cellValue = cellValue.replace(/;/g, "+");
    return eval(cellValue);
}

function calculateAverageByCellValueAndNumberOfComponents(cellValue, numberOfComponents) {
    return cellValue / numberOfComponents;
}

function getCellValuesByRowData(rowData) {
    return rowData.split(",").slice(this.length, -1);    
}

function serveData(data) {
    var jsonData = JSON.stringify(data);
    if(!OUTPUT_FILE) return jsonData;
    saveDataToFile(jsonData);
}

function saveDataToFile(jsonData) {
    fs.writeFileSync(OUTPUT_FILE, jsonData);
}

exports.saveToDisk = function(exportPath, callback) {
    OUTPUT_FILE = exportPath;
    main(callback);
}

exports.get = function(callback) {
    main(callback);
}