{
	const enlist = (elem, array) => ([elem]).concat(array || []);
	
	const _jc       = (imports, classes)    => ({imports, classes});
	const _import   = (classes, path)       => ({classes, path});
	const _class    = (name,parent,members) => ({name,parent,members});
	
	const _property = (name,access,type)        => ({type:'property',name,access,type});
	const _method   = (name,access,params,body) => ({type:'method',  name,access,body});
	const _external = (name,content)            => ({type:'external',name,content});
	const _alias    = (name,access,target)      => ({type:'alias',   name,access,target});
}


jc
	= imps:import* cls:class+ __
	{return _jc(imps, cls)}

import
	= __ 'import' white_sure classes:class_names white_sure 'from'
	  white_sure path:module_path new_line
	{return _import(classes, path)}

class
	= __ name:class_name
	  parent:extends? white_maybe
	  members:class_body def_end
	{return _class(name,parent,members)}


__ 'comment or whitespace'
	= ___sure?
___sure = (comment / white_sure)+


white_maybe  = white_sure?
white_sure   = white_all+
white_all 'any whitespace'
	= new_line / white_symbol
white_symbol 'a space'
	= [\t\v\f \u00A0\uFEFF]
new_line 'a new line'
	= '\r'? '\n'
any_line
	= (!new_line .)*
def_end 'the end of definition'
	= (white_symbol / ';')* &'}'? (comment_line / new_line)
op_end 'the end of operation'
	= __ ';'

comment       = comment_line / comment_multi
comment_line  = '//' any_line new_line
comment_multi = '/*' (!'*/' .)* '*/'


class_names  = a:class_name b:more_classes* {return enlist(a, b)}
more_classes = white_maybe ',' white_maybe name:class_name {return name}
class_name   = $([A-Z] base_name?)
prop_name    = $([a-z] base_name?)
dir_name     = $((base_name / [\.\- _\(\)])+)
base_name    = $([A-Za-z0-9_]+)


lvalue_prop_chain = lvalue_dynamic_chain / lvalue_static_chain

lvalue_dynamic_chain
	= a:lvalue_chain_next b:lvalue_chain_next*
	{return {type: 'lvalue', access: 'dynamic', chain: enlist(a, b)}}

lvalue_static_chain
	= a:lvalue_chain_item b:lvalue_chain_next*
	{return {type: 'lvalue', access: 'static', chain: enlist(a, b)}}

lvalue_chain_next
	= !def_end __ '.' item:lvalue_chain_item
	{return item}

lvalue_chain_item
	= name:base_name
	{return name}


prop_chain = dynamic_chain / static_chain

dynamic_chain
	= a:chain_next b:chain_next*
	{return {type: 'dynamic', chain: enlist(a, b)}}

static_chain
	= a:chain_item b:chain_next*
	{return {type: 'static', chain: enlist(a, b)}}

chain_next
	= !def_end __ '.' item:chain_item
	{return item}

chain_item
	= name:base_name args:arg_list?
	{return {name, type: args? 'call' : 'access', args}}


module_path = $(dir_dots? dir_path jc_ext?)
dir_dots    = '.' '.'? '/'
dir_path    = $(dir_name sub_dir*)
sub_dir     = $('/' dir_name)
jc_ext      = '.jc'


extends = white_sure 'extends' white_sure name:class_name {return name}


class_body  = class_empty / class_not_empty
class_not_empty
	= __ '{' __ m:members+ __ '}'
	{return m}
class_empty 'an empty class body'
	= __ '{' __ '}'
	{return []}
	
	
members
	= properties / methods / external
properties 'a property'
	= dynamic_prop/ dynamic_alias / static_prop / static_alias
methods 'a method'
	= dynamic_func / static_func

external 'an external property'
	= __ '@' name:prop_name define_op content:js_value def_end
	{return _external(name,content)}

dynamic_prop 'a dynamic property'
	= __ '.' name:prop_name
	  define_op type:(struct_type / core_type / ref_type)
	  def_end
	{return _property(name,'dynamic',type)}
dynamic_alias
	= __ '.' name:prop_name define_op '.' target:prop_name def_end
	{return _alias(name,'dynamic',target)}
	
static_prop 'a static property'
	= __ name:prop_name
	  define_op type:core_type init:default_val?
	  def_end
	{return _property(name,'static',type)}
static_alias
	= __ name:prop_name define_op target:prop_name def_end
	{return _alias(name,'static',target)}


dynamic_func 'a dynamic method'
	= __ '.' name:prop_name
	  params:param_list
	  body:func_body
	  def_end
	{return _method(name,'dynamic',paramas,body)}
static_func 'a static method'
	= __ name:prop_name
	  params:param_list
	  body:func_body
	  def_end
	{return _method(name,'static',paramas,body)}

param_list 'a parameter list'
	= white_symbol? '(' __ p:params? __ ')' {return p || []}

params = a:param b:more_params* {return enlist(a, b)}
more_params = __ ',' p:param {return p}
param = __ p:prop_name {return p}


func_body  = func_empty / func_not_empty
func_not_empty
	= __ '{' __ o:operation+ __ '}'
	{return o}
func_empty 'an empty function body'
	= __ '{' __ '}'
	{return []}

operation  = var_def_op / no_def_op
var_def_op = local_var
no_def_op  = assignment / call_only / iteration / control


local_var  = __ (core_type / class_type) one_local more_local? op_end
one_local  = __ prop_name assign?
more_local = __ ',' __ one_local


assignment
	= __ left:prop_chain right:assign op_end
	{return {type:'assignment',left,operator:right.op,right:right.e}}
assign
	= __ op:assign_op __ e:expression
	{return {op,e}}


call_only
	= __ c:call op_end
	{return c}
call
	= callee:lvalue_prop_chain args:arg_list
	{return {type: 'call', callee, args}}

arg_list 'a list of arguments'
	= white_symbol* '(' __ a:args? __ ')'
	{return a || []}
args
	= a:arg b:more_args*
	{return enlist(a, b)}
more_args
	= __ ',' a:arg
	{return a}
arg
	= __ e:expression
	{return e}


iteration
	= iter:(iter_expr / iter_local) def_end
	{return iter}
iter_expr
	= __ target:expression __ '[' white_symbol* ']'
	  params:param_list
	  body:func_body
	{return {type: 'iter_kernel', target, params, body}}
iter_local
	= __ '[' __ target:expression __ ']'
	  params:param_list
	  body:func_body
	{return {type: 'iter_local', target, params, body}}


control = return / ctrl_branch / ctrl_loop
ctrl_branch = (ctrl_if / ctrl_switch) def_end
ctrl_loop = (ctrl_for / ctrl_while / ctrl_do) def_end

ctrl_if = __ 'if' __ '(' expression ')' (func_body / operation) ctrl_else?
ctrl_else = __ 'else' (func_body / operation)

ctrl_switch = __ 'switch' __ '(' __ expression __ ')' switch_body
switch_body = __ '{' switch_case* switch_default? switch_case* '}'
switch_case = __ 'case' white_symbol+ gpu_value define_op no_def_op* 'break' op_end
switch_default = __ 'default' define_op no_def_op* 'break' op_end

ctrl_for = __ 'for' for_constrain (func_body / operation)
for_constrain = __ '(' loop_var? ';' __ expression __ ';' __ expression __ ')'
loop_var  = __ core_type one_local more_local? def_end

ctrl_while = __ 'while' '(' __ expression __ ')' (func_body / operation)
ctrl_do = __ 'do' (func_body / operation) 'while' '(' __ expression __ ')' 

return
	= __ 'return' (white_symbol+ value:expression)? op_end
	{return {type:'return', value}}


expression = duo_expr / uno_expr
brace_expr = '(' __ e:expression __ ')' {return e}
uno_expr   = uno:uno_op? __ e:(brace_expr / rvalue) {return {uno,e}}
duo_expr   = a:uno_expr __ duo:duo_op __ b:expression {return {a,b,duo}}


rvalue     = gpu_value / prop_chain
uno_op     = '++' / '--' / '%' / '~' / '&' / '*' / '+' / '-' / '!' / 'new'
duo_op     = '/' / '^' / '|' / '<<' / '>>' / '||' / '&&' / '%' / '~' / '&' / '*' / '+' / '-'
assign_op
	= atomic_op / '=' / '<<' / '+=' / '-=' / '*=' / '/=' / '&=' / '|=' / '^=' / '%='
atomic_op  = '+==' / '-==' / '*==' / '/=='
all_op     = uno_op / duo_op / assign_op

core_type  = core_char / core_int / core_float
core_char  = 'char'
core_int   = 'int2' / 'int3' / 'int4' / 'int'
core_float = 'float2' / 'float3' / 'float4' / 'float' 


struct_type "struct type"
	= type:core_type white_symbol? a:prop_name b:more_subs+
	{return { type, names: enlist(a, b) }}
more_subs "struct fields"
	= white_maybe ',' white_maybe name:prop_name
	{return name}



ref_type    = list_type / class_type
list_type
	= target:class_name white_symbol* '[' white_symbol* ']'
	{return {target, type:'list'}}
class_type
	= target:class_name
	{return {target, type:'ref'}}


default_val = default_op value:gpu_value {return value}
gpu_value   = char_value / num_value
char_value  = $("'" (!"'" .)* "'")
num_value   = float_value / int_value
int_value   = $([0-9]+)
float_value = $(int_value ('.' int_value)?)

define_op  = __ ':' __
default_op = __ '=' __

// JS

js_value = $( (def_end  js_any)+ )

js_any = js_round / js_curly / js_curly / js_double / js_single / js_biased / js_normal
js_round  = '('  (!')'  js_any)* ')'
js_square = '['  (!']'  js_any)* ']'
js_curly  = '{'  (!'}'  js_any)* '}'
js_double = '"'  (!'"'  js_any)* '"'
js_single = '\'' (!'\'' js_any)* '\''
js_biased = '`'  (!'`'  js_any)* '`'
js_normal = .

// ----------- DEBUG ----------- //

func_any  = __ '{' __ o:$(!'}' .)* __ '}' {return o}
