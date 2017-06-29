'use strict';

const peg = require('pegjs');
const parser = peg.generate(`
	
jc = import* // ? class+

import = skip 'import' // \s classNames \s 'from' \s modulePath

skip         = (comment / whitespace)*
comment      = commentLine / commentMulti
commentLine  = '//' .* \n
commentMulti = '/*' .* '*/'
whitespace   = \s

// classNames = className (\,\s? className)
// className  = [A-Z][\w]+

// modulePath = dirDots? dirPath jcExt?
// dirDots    = \.\.?\/
// dirPath    = ((\w|\s)+\/?)+
// jcExt      = '.jc'

// class = skip className (\s 'extends' \s className)? \s? classBody

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
