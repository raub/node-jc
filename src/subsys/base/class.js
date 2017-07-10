'use strict';

const Scope = require('./scope');


class Class {
	
	get name()    { return this._name;    }
	get parent()  { return this._parent;  }
	get scope()   { return this._scope;   }
	get classes() { return this._classes; }
	
	
	constructor(desc, imported, location) {
		
		this._name     = desc.name;
		this._imported = desc.imported;
		this._parent   = imported[desc.parent];
		
		this._classes = Object.keys(imported).map(k => imported[k]);
		
		// Init scope with imports
		this._scope = new Scope();
		this._classes.forEach(c => {
			this._scope.set(c.name, c.scope);
		});
		
		desc.members.forEach(member => {
			
			switch (member.type) {
				
				case 'external':
					try {
						this[member.name] = eval(`(${member.content})`);
					} catch (ex) {
						console.log('EX', location, desc.name, '::', member.name, '\n', ex);
					}
					break;
				
				case 'alias':
					Object.defineProperty(this, member.name, {
						get() { return this[member.target]; },
						set(v) { this[member.target] = v; },
					});
					break;
				
				default: break;
				
			}
			
		});
		
	}
	
};

module.exports = Class;
