'use strict';

const fs = require('fs');

const resolve = require('../../src/resolve');


const ok = fn => (err, res) => err ? console.log(err) : fn(res);

const libs = ['libs'];

[
	{i: 'creatures/population.jc', o: 'out/population.json'},
	{i: 'creatures/body/body', o: 'out/body.json'},
	{i: 'creatures', o: 'out/creatures.json'},
	{i: 'graph', o: 'out/graph.json'},
].forEach(item => {
	const resolved = resolve(item.i);
	fs.writeFileSync(item.o, JSON.stringify(resolved, null, '  '));
});
