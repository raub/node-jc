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
	= _0_ type:types_static
	  _s_ name:names_param
	{return {type, name}}

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
	  _0_ b:operation_static+
	  _0_ function_body_end
	{return b}


function_body_static_stop
	= iteration_static / literals_js_end / '}'

function_body_static_skip
	= text:$( (!function_body_static_stop literals_js_any)+ )
	{return {type: 'skip', text}}


function_body_static_content
	= (function_body_static_skip / iteration_static)+


// <'{' ... '}'>
function_body_dynamic_not_empty
	= _0_ function_body_start
	  _0_ b:operation_dynamic+
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
	= a:function_args_dynamic_one
	  b:function_args_dynamic_more*
	{return enlist(a, b)}
function_args_dynamic_more
	= _0_ ',' a:function_args_dynamic_one
	{return a}
function_args_dynamic_one
	= _0_ e:expression
	{return e}
