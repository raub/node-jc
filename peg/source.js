'use strict';

const peg = require('pegjs');
const fs = require('fs');

// const fill = (n,c) => { let s=''; while(--n)s+=c; return s };

class Source {
	
	constructor(path, isText) {
		
		if ( ! isText ) {
			this._path = path;
			this._source = fs.readFileSync(__dirname + '/' + path).toString();
		} else {
			this._path = '[INLINE]'+(new Error()).stack.split('\n')[2];
			this._source = path;
		}
		
		try {
			this._compiled = Source._parser.parse(this._source);
		} catch (ex) {
			if (ex.name !== 'SyntaxError') {
				return this._error = {
					name: ex.name,
					message: ex.message,
				};
			}
			const splitted = this._source.split('\n');
			const that = this;
			this._error = {
				name: ex.name,
				line: {
					number: ex.location.start.line,
					column: ex.location.start.column,
					text  : splitted[ex.location.start.line-1],
				},
				message: ex.message,
				toString() {
					return '\nJC Parser ERROR:\n' +
						this.message + '\n' +
						`At file ${that._path}\nAt line ${this.line.number}\n` +
						this.line.text + '\n' +
						(()=>{
							let t = this.line.text.replace(/[^\t]/g, ' ');
							return t.slice(0,this.line.column-1) + '^' + t.slice(this.line.column);
						})();
				},
			};
		}
		
		if (this._error) {
			console.log(this._error.toString());
		}
		
	}
	
	get compiled() { return this._compiled; }
	
	get error() { return this._error; }
	
}

Source._parser = peg.generate(fs.readFileSync(__dirname + '/grammar.pegjs').toString());

module.exports = Source;
