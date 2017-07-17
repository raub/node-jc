'use strict';

const device = require('./device');
// const types = require('./types');
const base = require('../base');

const Attribute = require('./attribute');
const Uniform   = require('./uniform');
const Dynamic   = require('./dynamic');
const Static    = require('./static');


class Class extends base.Class {
	
	get header()  { return this._header;  }
	get inject()  { return this._inject;  }
	get program() { return this._program; }
	
	
	constructor(desc, imported, location) {
		
		super(desc, imported, location);
		
		this._cl = {};
		
		
		desc.members.forEach(member => {
			
			switch (member.spec) {
				
				case 'attribute'://console.log('attr', member.name);
					this._cl['attribute_' + member.name] = new Attribute(member, this.scope);
					break;
				
				case 'uniform'://console.log('uni', member.name);
					this._cl['uniform_' + member.name] = new Uniform(member, this.scope);
					Object.defineProperty(this, member.name, {
						get()  { return this._cl['uniform_' + member.name].value; },
						set(v) { this._cl['uniform_' + member.name].value = v;    },
					});
					break;
				
				case 'dynamic':
					this._cl['dynamic_' + member.name] = new Dynamic(member, this.scope);
					break;
				
				case 'static':
					this._cl['static_' + member.name] = new Static(member, this.scope);
					break;
				
				default: break;
				
			}
			
		});
		
		this._inject = [].concat(
			//this.classes.map(item => item.inject),
			[`\n\t// Class ${this.name} injects`],
			Object.keys(this._cl).filter(k => /^uniform_/.test(k)).map(
				name => this._cl[name].inject
			),
			Object.keys(this._cl).filter(k => /^attribute_/.test(k)).map(
				name => this._cl[name].inject
			)
		).join('\n') + '\n';
		
		const injectFull = this.classes.map(item => item.inject).join('\n') + this._inject;
		
		// Patch the methods
		Object.keys(this._cl).filter(k => /^dynamic_/.test(k)).forEach(
			name => this._cl[name].inject = injectFull
		);
		
		// Pull method headers
		this._header = `\n// --- Class ${this.name} header --- //\n` +
			Object.keys(this._cl).filter(k => /^dynamic_/.test(k)).map(
				name => this._cl[name].header
			).join('\n') +
			'\n// Uniform helpers\n' + 
			Object.keys(this._cl).filter(k => /^uniform_/.test(k)).map(
				name => this._cl[name].header
			).join('\n') +
			'\n// Attribute helpers\n' + 
			Object.keys(this._cl).filter(k => /^attribute_/.test(k)).map(
				name => this._cl[name].header
			).join('\n') + '\n';
		
		
		// Pull code from methods
		this._source = [].concat(
			// Imported headers
			this.classes.map(item => item.header),
			// Own header
			[this._header, `\n// Class ${this.name} code`],
			// Own dynamic methods
			Object.keys(this._cl).filter(k => /^dynamic_/.test(k)).map(
				name => this._cl[name].code
			),
			Object.keys(this._cl).filter(k => /^static_/.test(k)).map(
				name => this._cl[name].code
			),
			Object.keys(this._cl).filter(k => /^uniform_/.test(k)).map(
				name => this._cl[name].code
			),
			Object.keys(this._cl).filter(k => /^attribute_/.test(k)).map(
				name => this._cl[name].code
			)
		).join('\n\n') + '\n';
		
		try {
			this._program = device.cl.createProgramWithSource(device.context, this._source);
			
			device.cl.compileProgram(this._program);
			
			this._linked = device.cl.linkProgram(
				device.context, null, null,
				[this._program].concat(this.classes.map(item => item.program))
			);
		} catch (ex) {
			console.log(`\nClass ${this._name} (${location}):\n`,ex);
			const log = device.cl.getProgramBuildInfo(this._program, device.device, device.cl.PROGRAM_BUILD_LOG);
			console.log('LOG', log);
		}
		
	}
	
	toJSON() {
		return this._source;
	}
	
};

module.exports = Class;
