/*
 * @package peilingwijzer-parser
 * @copyright Copyright(c) 2016 Paranoia Watch <info AT paranoia.watch>
 * @author Wouter Vroege <wouter AT woutervroege DOT nl>
 */

var fs = require("fs"),
    argv = require('minimist')(process.argv.slice(2)),
    FILE_URL = argv.FILE_URL;

function getFileContents() {
    return fs.readFileSync(FILE_URL).toString()
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
    var stringParts = cellDateString.split("/");
    var year = stringParts[2];
    var month = parseInt(stringParts[1])-1;
    var day = stringParts[0];
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
    return eval(cellValue);
}

function calculateAverageByCellValueAndNumberOfComponents(cellValue, numberOfComponents) {
    return cellValue / numberOfComponents;
}

function getCellValuesByRowData(rowData) {
    return rowData.split(",").slice(this.length, -1);    
}

var fileData = getFileContents();
var fieldNames = parseFieldNamesFromFileData(fileData);
var rowsData = parseDataRowsFromFileData(fileData);
var data = parseObjectFromRowsDataAndFieldNames(rowsData, fieldNames);
console.log("data", data);