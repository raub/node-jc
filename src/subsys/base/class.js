'use strict';

const Scope = require('./scope');


class Class {
	
	get name()     { return this._name;     }
	get parent()   { return this._parent;   }
	get scope()    { return this._scope;    }
	get imported() { return this._imported; }
	get classes()  { return this._classes;  }
	
	
	constructor(desc, imported, location) {
		
		this._name = desc.name;
		
		if (desc.parent) {
			this._parent = imported[desc.parent];
			this._scope  = this._parent.scope.clone(this._name);
		} else {
			this._parent = null;
			this._scope  = new Scope(this._name);
		}
		
		this._imported = desc.imported;
		this._classes  = Object.keys(imported).map(k => imported[k]);
		
		// Put imports into the scope
		this._classes.forEach(c => this._scope.set(c.name, c));
		this._scope.set(this._name, this);
		
		desc.members.forEach(member => {
			
			const target = member.spec === 'alias' ? member.target : member.name;
			
			const scope = new Scope(`__${this._name}_${target}`);
			scope.info.owner = this._name;
			
			this._scope.set(`${member.name}`, scope);
			
		});
		
	}
	
};

module.exports = Class;
