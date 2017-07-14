'use strict';

const peg = require('pegjs');
const fs = require('fs');

const subsys = require('./subsys/opencl');

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
		
		this._exported = {};
		this._parsed = null;
		
		try {
			
			this._parsed = Source._parser.parse(this._source);
			
			this._imported = {};
			this._parsed.imports.forEach(item => {
				
				const classes = (require('./index.js')).require(item.path, this._dir);
				
				item.classes.forEach(name => {
					if ( ! classes[name] ) {
						throw new Error(`Class ${name} not found in ${item.path}.`);
					}
					this._imported[name] = classes[name];
				});
				
			});
			
			this._exported = {};
			this._parsed.classes.forEach(cdata => {
				this._exported[cdata.name] = new subsys.Class(cdata, this._imported, this._path);
				this._imported[cdata.name] = this._exported[cdata.name];
			});
			
		} catch (ex) { (()=>{
			
			const that = this;
			
			if (ex.name !== 'SyntaxError') {
				console.log(ex);
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
					prev  : splitted[ex.location.start.line-2] || null,
					next  : splitted[ex.location.start.line] || null,
				},
				message: ex.message,
				toString() {
					return '\n// ----------------------------------' +
						'\n// JC Parser ERROR:\n// ' +
						`At file ${that._path}\n// At line ${this.line.number}\n// ` +
						(this.line.prev ? `${this.line.prev}\n>> ` : '') +
						this.line.text + '\n// ' +
						(()=>{
							let t = this.line.text.replace(/[^\t]/g, ' ');
							return t.slice(0,this.line.column-1) + '^' + t.slice(this.line.column);
						})() +
						(this.line.next ? `\n// ${this.line.next}` : '') +
						'\n// ' +this.message +
						'\n// ----------------------------------\n';
				},
			};
			console.log(this._error.toString());
			
		})(); }
		
	}
	
	get file()     { return this._path;     }
	get name()     { return this._name;     }
	get parsed()   { return this._parsed;   }
	get exported() { return this._exported; }
	
	get error() { return this._error && this._error.toString() || null; }
	
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
	Source._grammar = include('index.pegjs', {});
	// fs.writeFileSync(__dirname + '/_grammar.pegjs', Source._grammar);
	
	Source._parser = peg.generate(Source._grammar);
} catch (ex) { (()=>{
	
	Source._parser = { parse(){ return {}; } };
	
	if (ex.name !== 'GrammarError') {
		console.log(ex);
		process.exit(1);
	}
	
	const splitted = Source._grammar.split('\n');
	
	Source._error = {
		name: ex.name,
		line: {
			number: ex.location.start.line,
			column: ex.location.start.column,
			text  : splitted[ex.location.start.line-1],
			prev  : splitted[ex.location.start.line-2] || null,
			next  : splitted[ex.location.start.line] || null,
		},
		message: ex.message,
		toString() {
			return '\n// ----------------------------------' +
				'\n// JC Grammar ERROR:\n// ' +
				`At line ${this.line.number}\n// ` +
				(this.line.prev ? `${this.line.prev}\n>> ` : '') +
				this.line.text + '\n// ' +
				(()=>{
					let t = this.line.text.replace(/[^\t]/g, ' ');
					return t.slice(0,this.line.column-1) + '^' + t.slice(this.line.column);
				})() +
				(this.line.next ? `\n// ${this.line.next}` : '') +
				'\n// ' +this.message +
				'\n// ----------------------------------\n';
		},
	};
	console.log(Source._error.toString());
	
	process.exit(1);
	
})(); }

module.exports = Source;
