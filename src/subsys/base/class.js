'use strict';

const Scope = require('./scope');


class Class {
	
	get name()    { return this._name;    }
	get parent()  { return this._parent;  }
	get scope()   { return this._scope;   }
	get classes() { return this._classes; }
	
	
	constructor(desc, imported, location) {
		
		this._name     = desc.name;
		
		if (desc.parent) {
			this._parent = imported[desc.parent];
			this._scope  = this._parent.scope.clone(this._name);
		} else {
			this._parent = null;
			this._scope  = new Scope(this._name);
		}
		
		this._imported = desc.imported;
		this._classes = Object.keys(imported).map(k => imported[k]);
		
		// Put imports into the scope
		this._classes.forEach(c => this._scope.set(c.name, c.scope));
		
		
		desc.members.forEach(member => {
			
			switch (member.access) {
				case 'dynamic':
					this._scope.set(
						`.${member.name}`,
						`_${this._name}_dynamic_${member.type === 'alias' ? member.target : member.name}`
					);
					break;
				
				case 'static':
					this._scope.set(
						`${member.name}`,
						`_${this._name}_static_${member.type === 'alias' ? member.target : member.name}`
					);
					break;
				
				default: break;
			}
			
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
