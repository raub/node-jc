#include operation.pegjs


// Parameter lists

// <'(' ')'> / <'(' ... ')'>
function_params_static_list
	= function_params_empty / function_params_static_not_empty
	
function_params_dynamic_list
	= function_params_empty / function_params_dynamic_not_empty


// <'(' name[{',' <name>}] ')'>
function_params_static_not_empty
	= _0_ function_params_start
	  _0_ p:function_params_static_names
	  _0_ function_params_end
	{return p}

// <'(' <type> <name>[{',' <type> <name>}] ')'>
function_params_dynamic_not_empty
	= _0_ function_params_start
	  _0_ p:function_params_dynamic_names
	  _0_ function_params_end
	{return p}

// <'(' ')'>
function_params_empty 'an empty parameter list'
	= _0_ function_params_start
	  _0_ function_params_end
	{return []}

function_params_static_names
	= a:function_params_static_one
	  b:function_params_static_more*
	{return enlist(a, b)}
function_params_static_more
	= __ ',' p:function_params_static_one
	{return p}
function_params_static_one
	= _0_ name:names_param
	{return {name}}

function_params_dynamic_names
	= a:function_params_dynamic_one
	  b:function_params_dynamic_more*
	{return enlist(a, b)}
function_params_dynamic_more
	= __ ',' p:function_params_dynamic_one
	{return p}
function_params_dynamic_one
	= _0_ type:types_gpu
	  _s_ name:names_param
	{return {type, name}}


// Function bodies

function_body_static
	= function_body_empty / function_body_static_not_empty
function_body_dynamic
	= function_body_empty / function_body_dynamic_not_empty

// <'{' ... '}'>
function_body_static_not_empty
	= _0_ function_body_start
	  _0_ b:function_body_static
	  _0_ function_body_end
	{return b}

// <'{' ... '}'>
function_body_dynamic_not_empty
	= _0_ function_body_start
	  _0_ b:operation+
	  _0_ function_body_end
	{return b}

// <'{' '}'>
function_body_empty 'an empty class body'
	= _0_ class_body_start
	  _0_ class_body_end
	{return []}


function_params_start 'a ( before parameter list'
	= '('

function_params_end 'a ) after parameter list'
	= ')'
	
function_body_start 'a { before function body'
	= '{'

function_body_end 'a } after function body'
	= '}'


// Argument lists

function_args_dynamic_list
	= function_args_empty / function_args_dynamic_not_empty


// <'(' <type> <name>[{',' <type> <name>}] ')'>
function_args_dynamic_not_empty
	= _0_ function_args_start
	  _0_ args:function_args_dynamic
	  _0_ function_args_end
	{return args}

// <'(' ')'>
function_args_empty 'an empty argument list'
	= _0_ function_args_start
	  _0_ function_args_end
	{return []}


function_args_start 'a ( before argument list'
	= '('

function_args_end 'a ) after argument list'
	= ')'


function_args_dynamic
	= a:function_params_dynamic_one
	  b:function_params_dynamic_more*
	{return enlist(a, b)}
function_args_dynamic_more
	= _0_ ',' p:function_args_dynamic_one
	{return p}
function_args_dynamic_one
	= _0_ expression





/*
param_list 'a static parameter list'
	= white_symbol? '(' __ p:params? __ ')' {return p || []}

params = a:param b:more_params* {return enlist(a, b)}
more_params = __ ',' p:param {return p}
param = __ p:prop_name {return p}


param_list_dynamic 'a dynamic parameter list'
	= ___* '(' __ p:params_dynamic? __ ')' {return p || []}

params_dynamic = a:param_dynamic b:more_params_dynamic* {return enlist(a, b)}
more_params_dynamic = __ ',' p:param_dynamic {return p}
param_dynamic = __ type:prop_type ___+ name:prop_name {return {type,name}}


func_body = func_empty / func_not_empty

func_body_static = func_empty / func_not_empty_static

func_not_empty
	= __ func_body_start __ o:operation+ __ func_body_end
	{return o}

func_empty 'an empty function body'
	= __ func_body_start __ func_body_end
	{return []}

func_body_start 'a { before function body'
	= '{'
func_body_end 'a } after function body'
	= '}'


arg_list 'a list of arguments'
	= white_symbol* '(' __ a:args? __ ')'
	{return a || []}

args
	= a:expression b:more_args*
	{return enlist(a, b)}

more_args
	= __ ',' __ e:expression
	{return e}


func_not_empty_static
	= __ o:js_curly
	{return o}
*/
