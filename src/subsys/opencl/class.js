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
	
	get attributeParams() { return this._attributeParams; }
	get attributeArgs() { return this._attributeArgs; }
	
	
	constructor(desc, imported, location) {
		
		super(desc, imported, location);
		
		this._attributes    = {};
		this._attributeList = [];
		
		this._uniforms      = {};
		this._uniformList   = [];
		
		this._dynamics      = {};
		this._dynamicList   = [];
		
		this._statics       = {};
		this._staticList    = [];
		
		
		this._depends = {
			attributes: [],
			uniforms  : [],
			dynamics  : [],
		};
		
		desc.members.forEach(member => {
			
			switch (member.spec) {
				
				case 'attribute':
					this._attributes[member.name] = new Attribute(member, this);
					this._attributeList.push(this._attributes[member.name]);
					break;
				
				case 'uniform':
					this._uniforms[member.name] = new Uniform(member, this);
					this._uniformList.push(this._uniforms[member.name]);
					Object.defineProperty(this, member.name, {
						get()  { return this._uniforms[member.name].value; },
						set(v) { this._uniforms[member.name].value = v;    },
					});
					break;
				
				case 'dynamic':
					this._dynamics[member.name] = new Dynamic(member, this);
					this._dynamicList.push(this._dynamics[member.name]);
					break;
				
				case 'static':
					this._statics[member.name] = new Static(member, this);
					this._staticList.push(this._statics[member.name]);
					this[member.name] = this._statics[member.name].invoke.bind(this._statics[member.name]);
					break;
				
				default: break;
				
			}
			
		});
		
		this._attributeList.forEach( attr => this._depends.attributes.push(attr) );
		this.classes.forEach(c => c._depends.attributes.forEach(
			attr => this._depends.attributes.push(attr)
		));
		this._depends.attributes =
			this._depends.attributes.filter((x,i,a) => a.indexOf(x) !== i);
		
		this._uniformList.forEach( attr => this._depends.uniforms.push(attr) );
		this.classes.forEach(c => c._depends.uniforms.forEach(
			attr => this._depends.uniforms.push(attr)
		));
		this._depends.uniforms =
			this._depends.uniforms.filter((x,i,a) => a.indexOf(x) !== i);
		
		this._dynamicList.forEach( attr => this._depends.dynamics.push(attr) );
		this.classes.forEach(c => c._depends.dynamics.forEach(
			attr => this._depends.dynamics.push(attr)
		));
		this._depends.dynamics =
			this._depends.dynamics.filter((x,i,a) => a.indexOf(x) !== i);
		
		
		
		// Pull headers
		this._header = `
// --- Forward declarations --- //

// Uniform helpers
${this._depends.uniforms.map(u => u.header).join('\n')}

// Dynamic methods
${this._depends.dynamics.map(d => d.header).join('\n')}
`;
		
		// Pull code from methods
		this._source = `
${this._header}

// --- Implementation --- //

// ${this.name} uniform helpers

${this._uniformList.map(d => d.source).join('\n')}


// ${this.name} dynamic methods

${this._dynamicList.map(d => d.source).join('\n')}


// ${this.name} static methods

${this._staticList.map(d => d.source).join('\n')}
`;
		
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
