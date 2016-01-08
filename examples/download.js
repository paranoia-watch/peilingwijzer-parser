/*
 * @package charli
 * @subpackage peilingwijzer-parser
 * @copyright Copyright(c) 2016 Paranoia Watch
 * @author Wouter Vroege <wouter AT woutervroege DOT nl>
 */

var peilingWijzerParser = require(__dirname + '/../app'),
  exportURL = '/Users/woutervroege/Desktop/onzin.json'

peilingWijzerParser.saveToDisk(exportURL, function () {
  console.log('json file saved at ' + exportURL)
})