'use strict';

const Source = require('./source');

console.log('START');

// const _source = require('fs').readFileSync(__dirname + '/' + '../samples/creatures/population.jc').toString();
// const s1 = new Source(_source, true);

const s1 = new Source('../samples/creatures/population.jc');
const s2 = new Source('../samples/creatures/graph/vertex.jc');
const s3 = new Source('../samples/creatures/graph/edge.jc');
const s4 = new Source('../samples/creatures/graph/graph.jc');

console.log(JSON.stringify(s1.compiled, null, '\t'));
// console.log(JSON.stringify(s4.compiled, null, '\t'));
