'use strict';

const jc = require('../../src'); // require('node-jc');
jc.libs('../libs');


console.log('Require.');
const t0 = Date.now();

const Population = jc.require('population').Population;
Population.create(1000, 100);


console.log('Start sim.', Date.now() - t0);

const sim = setInterval(() => Population.simulate(), 10);

setTimeout(() => clearInterval(sim), 1000);
