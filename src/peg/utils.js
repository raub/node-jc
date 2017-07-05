const enlist = (elem, array) => ([elem]).concat(array || []);

const _jc       = (imports, classes)    => ({imports, classes});
const _import   = (classes, path)       => ({classes, path});
const _class    = (name,parent,members) => ({name,parent,members});

const _property = (name,access,type)        => ({type:'property',name,access,type});
const _method   = (name,access,params,body) => ({type:'method',  name,access,params,body});
const _external = (name,content)            => ({type:'external',name,content});
const _alias    = (name,access,target)      => ({type:'alias',   name,access,target});
