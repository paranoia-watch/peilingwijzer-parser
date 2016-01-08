/*
 * @package peilingwijzer-parser
 * @copyright Copyright(c) 2016 Paranoia Watch <info AT paranoia.watch>
 * @author Wouter Vroege <wouter AT woutervroege DOT nl>
 */

var fs = require("fs"),
    argv = require('minimist')(process.argv.slice(2)),
    INPUT_FILE = argv.I,
    OUTPUT_FILE = argv.O;

function main() {
    var fileData = getFileContents();
    var fieldNames = parseFieldNamesFromFileData(fileData);
    var rowsData = parseDataRowsFromFileData(fileData);
    var data = parseObjectFromRowsDataAndFieldNames(rowsData, fieldNames);
    serveData(data);
}

function getFileContents() {
    return fs.readFileSync(INPUT_FILE).toString()
}

function parseFieldNamesFromFileData(fileData) {
    var headerRowData = fileData.split(/\n/g)[0];
    headerRowFields = headerRowData.split(",").slice(this.length, -1);
    return headerRowFields;
}

function parseDataRowsFromFileData(fileData) {
    return fileData.split(/\n/g).slice(1);
}

function parseObjectFromRowsDataAndFieldNames(rowsData, fieldNames) {
    return rowsData.map(function(rowData) {
        return parseSingleObjectFromRowDataAndFieldNames(rowData, fieldNames);
    })
}

function parseSingleObjectFromRowDataAndFieldNames(rowData, fieldNames) {
    var object = {};
    var cellValues = getCellValuesByRowData(rowData);
    if(fieldNames.length !== cellValues.length) return console.error("number of field names doesn't match the number of cell values");   
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
    if(!OUTPUT_FILE) return printDataOnScreen(jsonData);
    saveDataToFile(jsonData);
}

function printDataOnScreen(jsonData) {
    console.log(jsonData);
}

function saveDataToFile(jsonData) {
    fs.writeFileSync(OUTPUT_FILE, jsonData);
}

main();