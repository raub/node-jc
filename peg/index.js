'use strict';

const peg = require('pegjs');
const parser = peg.generate(`
	
	// jc = 'import Vertex from vertex'
	
	
jc0 = imports? .* //class+

import  = skip 'import' // white_sure classNames white_sure 'from' white_sure modulePath new_line
imports = import+

skip         = skip_sure?
skip_sure    = (comment / white_sure)

white_maybe  = white_sure?
white_sure   = white_symbol+
white_line   = new_line / white_symbol
white_symbol = [\\t\\v\\f \\u00A0\\uFEFF]
new_line     = '\\r'? '\\n'

comment      = commentLine / commentMulti
commentLine  = '//' .* new_line
commentMulti = '/*' .* '*/'

// classNames = className (\,\s? className)
// className  = [A-Z][\w]+

// modulePath = dirDots? dirPath jcExt?
// dirDots    = \.\.?\/
// dirPath    = ((\w|\s)+\/?)+
// jcExt      = '.jc'

// class = skip className (\s 'extends' \s className)? \s? classBody new_line
// classes = class+

// classBody = \{ .* \}

`);

console.log('START');

const parsed1 = parser.parse(`
import Vertex from vertex
`);
console.log('parsed1', parsed1);


const parsed2 = parser.parse(`

Vertex {
	
}

`);
console.log('parsed2', parsed2);


const parsed3 = parser.parse(`

import Vertex from vertex
import Vertex from vertex

Vertex {
	
}

`);
console.log('parsed3', parsed3);


const parsed4 = parser.parse(`
 // hi
import Vertex from vertex
import Vertex from vertex
/*com
ment*/
Vertex {
	
}
// lol
Class2 {
	
}
`);
console.log('parsed4', parsed4);
