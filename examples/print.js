/*
 * @package charli
 * @subpackage peilingwijzer-parser
 * @copyright Copyright(c) 2016 Paranoia Watch
 * @author Wouter Vroege <wouter AT woutervroege DOT nl>
 */

var peilingWijzerParser = require(__dirname + '/../app')

peilingWijzerParser.get(function (json) {
  console.log(json)
})
