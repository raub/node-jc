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
	get program() { return this._program; }
	
	
	constructor(desc, imported, location) {
		
		super(desc, imported, location);
		
		this._cl = {};
		
		
		desc.members.forEach(member => {
			
			switch (member.type) {
				
				case 'property':
					switch (member.access) {
						case 'dynamic':
							this._cl['dp_' + member.name] = new Attribute(member);
							break;
						
						case 'static':
							this._cl['sp_' + member.name] = new Uniform(member);
							Object.defineProperty(this, member.name, {
								get()  { return this._cl['sp_' + member.name].value; },
								set(v) { this._cl['sp_' + member.name].value = v;    },
							});
							break;
						
						default: break;
					}
					break;
				
				case 'method':
					switch (member.access) {
						case 'dynamic':
							this._cl['dm_' + member.name] = new Dynamic(member);
							break;
						
						case 'static':
							this._cl['sm_' + member.name] = new Static(member);
							break;
						
						default: break;
					}
					break;
				
				default: break;
				
			}
			
		});
		
		// Pull method headers
		this._header = `\n// Class ${this.name} header\n` +
			Object.keys(this._cl).filter(k => /^.m_/.test(k)).map(
				name => this._cl[name].header
			).join('\n') + '\n';
		
		
		// Pull code from methods
		this._source = this.classes.map(item => item.header).concat(
			[this._header, `\n// Class ${this.name} code\n`],
			Object.keys(this._cl).filter(k => /^.m_/.test(k)).map(
				name => this._cl[name].code
			)
		).join('\n') + '\n';
		
		try {
			this._program = device.cl.createProgramWithSource(device.context, this._source);
			device.cl.compileProgram(this._program);
			
			this._linked = device.cl.linkProgram(
				device.context, null, null,
				[this._program].concat(this.classes.map(item => item.program))
			);
		} catch (ex) {
			console.log(`\nClass ${this._name} (${location}):\n`,ex);
		}
		
	}
	
	toJSON() {
		return this._source;
	}
	
};

module.exports = Class;
