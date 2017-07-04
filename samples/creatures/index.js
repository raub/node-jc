'use strict';

const jc = require('node-jc');
jc.verbose = true;
jc.libs('../libs');

const Population = require('./population').Population;

const population = new Population(1000, 100);

setInterval(() => population.simulate(), 10);
