const enlist = (elem, array) => ([elem]).concat(array || []);


const _jc       = (imports, classes)    => ({imports, classes});
const _import   = (classes, path)       => ({classes, path});
const _class    = (name,parent,members) => ({name,parent,members});


const _attribute = (type, name, init) =>
	({spec: 'attribute', type, name, init});

const _uniform = (type, name, init) =>
	({spec: 'uniform', type, name, init});

const _dynamic = (type, name, params, body) =>
	({spec: 'dynamic', type, name, params, body});

const _static = (name, params, body) =>
	({spec: 'static', name, params, body});

const _alias = (name, target) =>
	({spec: 'alias', name, target});

