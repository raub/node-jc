'use strict';

const Source = require('../../src/source');

console.log('START');

const fs = require('fs');

const ok = fn => (err, res) => err ? console.log(err) : fn(res);

new Promise(res => fs.readDir(ok(res)))
	.then(dir => Promise.all(
		dir.map(file => new Promise(res => fs.readFile(file, ok(res))))
	))
	.then(files => Promise.all(
		files.map(file => new Promise(res => fs.readFile(file, ok(res))))
	))



// const _source = require('fs').readFileSync(__dirname + '/' + '../samples/creatures/population.jc').toString();
// const s1 = new Source(_source, true);

const s1 = new Source(__dirname + '/' + '../samples/creatures/population.jc');
fs.writeFileSync(
	__dirname + '/' + '../samples/creatures/population.json',
	JSON.stringify(s1.compiled, null, '\t')
);

const s2 = new Source(__dirname + '/' + '../samples/creatures/graph/vertex.jc');
fs.writeFileSync(
	__dirname + '/' + '../samples/creatures/graph/vertex.json',
	JSON.stringify(s2.compiled, null, '\t')
);

const s3 = new Source(__dirname + '/' + '../samples/creatures/graph/edge.jc');
fs.writeFileSync(
	__dirname + '/' + '../samples/creatures/graph/edge.json',
	JSON.stringify(s3.compiled, null, '\t')
);

const s4 = new Source(__dirname + '/' + '../samples/creatures/graph/graph.jc');
fs.writeFileSync(
	__dirname + '/' + '../samples/creatures/graph/graph.json',
	JSON.stringify(s4.compiled, null, '\t')
);

const s5 = new Source(__dirname + '/' + '../samples/creatures/body/cell.jc');
fs.writeFileSync(
	__dirname + '/' + '../samples/creatures/body/cell.json',
	JSON.stringify(s5.compiled, null, '\t')
);

const s6 = new Source(__dirname + '/' + '../samples/creatures/body/muscle.jc');
fs.writeFileSync(
	__dirname + '/' + '../samples/creatures/body/muscle.json',
	JSON.stringify(s6.compiled, null, '\t')
);

const s7 = new Source(__dirname + '/' + '../samples/creatures/body/body.jc');
fs.writeFileSync(
	__dirname + '/' + '../samples/creatures/body/body.json',
	JSON.stringify(s7.compiled, null, '\t')
);

const s8 = new Source(__dirname + '/' + '../samples/creatures/brain/neuron.jc');
fs.writeFileSync(
	__dirname + '/' + '../samples/creatures/brain/neuron.json',
	JSON.stringify(s8.compiled, null, '\t')
);

const s9 = new Source(__dirname + '/' + '../samples/creatures/brain/synapse.jc');
fs.writeFileSync(
	__dirname + '/' + '../samples/creatures/brain/synapse.json',
	JSON.stringify(s9.compiled, null, '\t')
);

const s10 = new Source(__dirname + '/' + '../samples/creatures/brain/brain.jc');
fs.writeFileSync(
	__dirname + '/' + '../samples/creatures/brain/brain.json',
	JSON.stringify(s10.compiled, null, '\t')
);
// console.log(JSON.stringify(s1.compiled, null, '\t'));
// console.log(JSON.stringify(s4.compiled, null, '\t'));
