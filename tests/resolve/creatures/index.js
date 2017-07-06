'use strict';

const jc = require('node-jc');
jc.libs('../libs');

const Population = jc.require('./population').Population;

const population = new Population(1000, 100);

setInterval(() => population.simulate(), 10);
