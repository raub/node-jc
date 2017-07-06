'use strict';

const fs   = require('fs');
const path = require('path');


const exts = ['', '.jc'];

const mainDir = process.mainModule.filename.replace(/\\\\?/g,'/').match(/^.*(?=\/)/)[0];

const nodeDir = ((new Array(mainDir.match(/\//g).length)).fill(0).reduce((prev, cur) => {
	return prev.dir && prev || (p => {
		const dir = path.join(p.check,'node_modules');
		return {
			dir  : fs.existsSync(path.join(p.check,'node_modules')) && dir,
			check: p.check.replace(/\\\\?/g,'/').replace(/\/[^\/]*$/,''),
		};
	})(prev);
}, {dir:null, check:mainDir})).dir;

const listFiles = (fullPath) => {
	
	const isFile = fs.statSync(fullPath).isFile();
	
	if (isFile && /\.jс$/) {
		
		return [fullPath];
		
	} else if ( ! isFile ) {
		
		const files = fs.readdirSync(fullPath)
			.map( name => listFiles(path.join(fullPath, name)) )
			.filter(list=>list);
			
		return Array.prototype.concat.apply([], files);
		
	} else {
		
		return null;
		
	}
};


const checkPath = (fullBase) => {
	let fullPath = null;
	const found = exts.some(ext => {
		if (fs.existsSync(fullBase + ext)) {
			fullPath = fullBase + ext;
			return true;
		}
	});
	return fullPath;
};


const tryLibs = (name, libs) => {
	
	if ( ! /^libs\:/.test(name) ) {
		return null;
	}
	
	let fullPath = null;
	const part = file.slice(5);
	
	libs.some(dir => {
		fullPath = checkPath(path.resolve(mainDir, dir, part));
		return fullPath && true || false;
	});
	
	return fullPath;
	
};

const tryNode = (name) => {
	
	if ( ! /^node\:/.test(name) ) {
		return null;
	}
	
	let fullPath = null;
	const part = name.slice(5);
	
	this.libs.some(dir => {
		fullPath = checkPath(path.resolve(nodeDir, part));
		return fullPath && true || false;
	});
	
	return null;
	
};


const tryLocal = (name) => {
	
	let fullPath = null;
	
	[mainDir, ''].some(dir => {
		fullPath = checkPath(path.resolve(dir,name));
		return fullPath && true || false;
	});
	
	return null;
	
};


module.exports = (name, libs) => {
	
	return tryLibs(name, libs) || tryNode(name) || tryLocal(name);
	
};
