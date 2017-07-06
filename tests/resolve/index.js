'use strict';

const fs = require('fs');

const resolve = require('../../src/resolve');


const ok = fn => (err, res) => err ? console.log(err) : fn(res);

const libs = ['libs'];

[
	{i: 'creatures/population.jc', o: 'out/population.json'},
	{i: 'creatures/body/body', o: 'out/body.json'},
	{i: 'creatures', o: 'out/creatures.json'},
	{i: 'libs:graph', o: 'out/libs-graph.json'},
	{i: 'node:graph', o: 'out/node-graph.json'},
	{i: 'libs:graph/vertex', o: 'out/libs-vertex.json'},
	{i: 'node:graph/vertex', o: 'out/node-vertex.json'},
].forEach(item => {
	const resolved = resolve(item.i, libs);
	console.log('RES:', resolved && resolved.length, item.i);
	fs.writeFileSync(item.o, JSON.stringify(resolved, null, '  '));
});
