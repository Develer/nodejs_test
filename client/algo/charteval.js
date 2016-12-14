import * as parser from './expression_parser.js';
// var Parser = require('expr-eval').Parser;


// var expressionParser = new parser.ExpressionParser();

console.log(expressionParser.parse('(1 - 4) * (1 + 4)').evaluate());
// console.log(expressionParser.parse('3*4 + sin(10)/(20 + cos(13))').evaluate());
// console.log(expressionParser.parse('sin(2)*sin(2) + cos(2)*cos(2)').evaluate());
// console.log(expressionParser.parse('((sin(2)*sin(2) + cos(2)*cos(2)) + 3)/4').evaluate());

// var parser = new Parser();
// // var expr = parser.parse('((sin(2)*sin(2) + cos(2)*cos(2)) + 3)/4');
// var expr = parser.parse('sin(2)*sin(2) + cos(2)*cos(2)');
// console.log(expr.evaluate({})); // 7

// console.log(Parser.evaluate('6 * x', { x: 7 })); // 42
