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
		
		this._cl = {};
		
		
		desc.members.forEach(member => {
			
			switch (member.spec) {
				
				case 'attribute':
					this._cl['attribute_' + member.name] =
						new Attribute(member, this.scope);
					break;
				
				case 'uniform':
					this._cl['uniform_' + member.name] =
						new Uniform(member, this.scope);
					Object.defineProperty(this, member.name, {
						get()  { return this._cl['uniform_' + member.name].value; },
						set(v) { this._cl['uniform_' + member.name].value = v;    },
					});
					break;
				
				case 'dynamic':
					this._cl['dynamic_' + member.name] =
						new Dynamic(member, this.scope);
					break;
				
				case 'static':
					this._cl['static_' + member.name] =
						new Static(member, this.scope);
					break;
				
				default: break;
				
			}
			
		});
		
		
		this._attributeParams = Object.keys(this._cl).filter(k => /^attribute_/.test(k)).map(
			name => this._cl[name].param
		).join(', ');
		
		this._attributeArgs = Object.keys(this._cl).filter(k => /^attribute_/.test(k)).map(
			name => this._scope.get(this._cl[name].name).name
		).join(', ');
		
		const attributeParamsFull = [].concat(
			this.classes.map(item => item.attributeParams).filter(x=>x),
			(this._attributeParams ? [this._attributeParams] : [])
		).join(', ');
		
		const attributeArgsFull = [].concat(
			this.classes.map(item => item.attributeArgs).filter(x=>x),
			(this._attributeArgs ? [this._attributeArgs] : [])
		).join(', ');
		
		this._scope.info[this._name] = { attributeArgs: attributeArgsFull };
		
		this._inject = [].concat(
			[`\n\t// Class ${this.name} uniforms`],
			Object.keys(this._cl).filter(k => /^uniform_/.test(k)).map(
				name => this._cl[name].inject
			)
		).join('\n') + '\n\t';
		
		const injectFull = this.classes.map(item => item.inject).join('\n') + this._inject;
		
		// Patch the methods
		Object.keys(this._cl).filter(k => /^dynamic_/.test(k)).forEach(name => {
			this._cl[name].inject          = injectFull;
			this._cl[name].attributeParams = attributeParamsFull;
			this._cl[name].attributeArgs   = attributeArgsFull;
		});
		
		// Pull method headers
		this._header = `\n// --- Class ${this.name} header --- //\n` +
			'\n// Dynamic-headers\n' +
			Object.keys(this._cl).filter(k => /^dynamic_/.test(k)).map(
				name => this._cl[name].header
			).join('\n') + '\n' +
			'\n// Uniform-headers\n' +
			Object.keys(this._cl).filter(k => /^uniform_/.test(k)).map(
				name => this._cl[name].header
			).join('\n') + '\n';
		
		
		// Pull code from methods
		this._source = [].concat(
			// Imported headers
			this.classes.map(item => item.header),
			// Own header
			[this._header, `\n// --- Class ${this.name} code ---`],
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
			[`\n// --- Class ${this.name} END ---`]
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
