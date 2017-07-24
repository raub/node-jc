'use strict';

const device = require('./device');
// const types = require('./types');
const base = require('../base');

const Attribute = require('./attribute');
const Uniform   = require('./uniform');
const Dynamic   = require('./dynamic');
const Static    = require('./static');


const CORE_MEMBERS = {
	attribute : Attribute,
	uniform   : Uniform,
	dynamic   : Dynamic,
	static    : Static,
};

class Class extends base.Class {
	
	get header()  { return this._header;  }
	get inject()  { return this._inject;  }
	get program() { return this._program; }
	
	get depends() { return this._depends; }
	
	
	_pushMember(desc) {
		
		if ( ! CORE_MEMBERS[desc.spec] ) {
			return desc;
		}
		
		const hashName = `_${desc.spec}Hash`;
		const listName = `_${desc.spec}List`;
		
		const member = new CORE_MEMBERS[desc.spec](desc, this);
		
		this[hashName][desc.name] = member;
		this[listName].push(member);
		
		this._memberHash[desc.name] = member;
		this._memberList.push(member);
		
		this._scope[desc.name] = member;
		
		return desc;
		
	}
	
	
	constructor(desc, imported, location) {
		
		super(desc, imported, location);
		
		this._attributeHash = {};
		this._attributeList = [];
		
		this._uniformHash = {};
		this._uniformList = [];
		
		this._dynamicHash = {};
		this._dynamicList = [];
		
		this._staticHash = {};
		this._staticList = [];
		
		this._memberHash = {};
		this._memberList = [];
		
		desc.members
			.map(desc => this._pushMember(desc))
			.filter(desc => desc.spec === 'alias')
			.forEach(desc => {
				this._scope[desc.name] = this._memberHash[desc.target];
			});
		
		this._depends = {
			attributes: [],
			uniforms  : [],
			dynamics  : [],
		};
		
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
		
		// Compile all members
		this._memberList.forEach(m => m.compile());
		
		
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
