'use strict';

const peg = require('pegjs');
const fs = require('fs');


const mainDir = process.mainModule.filename.replace(/\\\\?/g,'/').match(/^.*(?=\/)/)[0];

// An abstraction for JC source file, also compiles the file
class Source {
	
	constructor(path, isText) {
		
		if ( ! isText ) {
			this._path   = path.replace(/\\\\?/g,'/');
			this._dir    = this._path.match(/^.*(?=\/)/)[0];
			this._source = fs.readFileSync(this._path).toString();
			this._name   = this._path.match(/[^\/]*$/)[0];
		} else {
			if (typeof isText === 'string') {
				this._path = isText;
				this._name = this._path.match(/[^\/]*$/)[0];
			} else {
				this._path = '[INLINE]'+(new Error()).stack.split('\n')[2];
				this._name = this._path;
			}
			this._dir    = mainDir;
			this._source = path;
		}
		
		try {
			this._parsed = Source._parser.parse(this._source);
		} catch (ex) { (()=>{
			
			const that = this;
			this._parsed = null;
			
			if (ex.name !== 'SyntaxError') {
				return this._error = {
					name: ex.name,
					message: ex.message,
					toString() {
						return '\n// ----------------------------------' +
						'\n// JC Parser ERROR:\n// ' +
						`At file ${that._path}\n// ` +
						ex.toString() +
						'\n// ----------------------------------\n';
					},
				};
			}
			
			const splitted = this._source.split('\n');
			
			this._error = {
				name: ex.name,
				line: {
					number: ex.location.start.line,
					column: ex.location.start.column,
					text  : splitted[ex.location.start.line-1],
				},
				message: ex.message,
				toString() {
					return '\n// ----------------------------------' +
						'\n// JC Parser ERROR:\n// ' +
						`At file ${that._path}\n// At line ${this.line.number}\n// ` +
						this.line.text + '\n// ' +
						(()=>{
							let t = this.line.text.replace(/[^\t]/g, ' ');
							return t.slice(0,this.line.column-1) + '^' + t.slice(this.line.column);
						})() +
						'\n// ' +this.message +
						'\n// ----------------------------------\n';
				},
			};
			
		})(); }
		
		if (this._error) {
			console.log(this._error.toString());
			this._compiled = {};
		} else {
			this._compiled = this._compile();
		}
		
		
		
	}
	
	get file() { return this._path; }
	get name() { return this._name; }
	get parsed() { return this._parsed; }
	get compiled() { return this._compiled; }
	
	get error() { return this._error && this._error.toString() || null; }
	
	
	_compile() {
		
		this._compiled = {};
		
		const imported = {};
		this._parsed.imports.forEach(item => {
			
			const classes = (require('./index.js')).require(item.path, this._dir);
			
			item.classes.forEach(name => {
				if ( ! classes[name] ) {
					throw new Error(`Class ${name} not found in ${item.path}.`);
				}
				imported[name] = classes[name];
			});
			
		});
		
		const exported = {};
		this._parsed.classes.forEach(item => {
			exported[item.name] = item;
		});
		
		return exported;
		
	}
	
}


// Resolve '#include file.pegjs' lines
const include = (str, ban) => {
	
	// Do not repeat inclusion
	if (ban[str]) {
		return '';
	}
	ban[str] = true;
	
	// Read file and resolve its includes
	const text = fs.readFileSync(__dirname + '/peg/' + str).toString();
	return text.replace(/^\s*\#include\s+(.*)\s*$/gm, function (_, name) {
		return include(name, ban);
	});
	
};

try {
	Source._parser = peg.generate( include('index.pegjs', {}) );
} catch (ex) {
	Source._parser = ()=>{throw ex};
}

module.exports = Source;
