jc
	= imps:imports? cls:classes .*
	  {return { imports: imps || [], classes: cls }}

imports
	= imports:import+

import
	= __s 'import' white_sure classes:class_names white_sure 'from'
	  white_sure path:module_path new_line 
	  {return {classes,path}}

classes
	= classes:class+

class
	= __s name:class_name
	  parent:extends? white_maybe
	  members:class_body def_end
	  {return {name,parent,members}}


__s 'comment or whitespace'
	= __s_sure?
__s_sure = (comment / white_sure)+


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
op_end
	= __s ';'

comment       = comment_line / comment_multi
comment_line  = '//' any_line new_line
comment_multi = '/*' (!'*/' .)* '*/'


class_names  = c1:class_name c2:more_classes* {return ([c1]).concat(c2||[])}
more_classes = white_maybe ',' white_maybe name:class_name {return name}
class_name   = $([A-Z] base_name?)
prop_name    = $([a-z] base_name?)
dir_name     = $((base_name / [\.\- _\(\)])+)
base_name    = $([A-Za-z0-9_]+)


lvalue_prop_chain = lvalue_dynamic_chain / lvalue_static_chain

lvalue_dynamic_chain
	= c1:lvalue_chain_next c2:lvalue_chain_next*
	{return {type: 'dynamic', chain:([c1]).concat(c2||[])}}

lvalue_static_chain
	= c1:lvalue_chain_item c2:lvalue_chain_next*
	{return {type: 'static', chain:([c1]).concat(c2||[])}}

lvalue_chain_next
	= !def_end __s '.' item:lvalue_chain_item
	{return item}

lvalue_chain_item
	= name:base_name
	{return {name, type: 'lvalue'}}


prop_chain = dynamic_chain / static_chain

dynamic_chain
	= c1:chain_next c2:chain_next*
	{return {type: 'dynamic', chain:([c1]).concat(c2||[])}}

static_chain
	= c1:chain_item c2:chain_next*
	{return {type: 'static', chain:([c1]).concat(c2||[])}}

chain_next
	= !def_end __s '.' item:chain_item
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


class_body  = '{' __s m:members* __s '}' {return m}

members
	= properties / methods / external
properties 'a property'
	= dynamic_prop / static_prop
methods 'a method'
	= dynamic_func / static_func

external 'an external property'
	= __s '@' name:prop_name define_op external_code def_end

dynamic_prop 'a dynamic property'
	= __s '.' name:prop_name
	  define_op type:(struct_type / core_type / ref_type)
	  def_end
	{return {membership: 'property', access: 'dynamic', type, name}}
static_prop 'a static property'
	= __s name:prop_name
	  define_op type:core_type init:default_val?
	  def_end
	{return {membership: 'property', access: 'static', type, init, name}}


dynamic_func 'a dynamic method'
	= __s '.' name:prop_name
	  params:param_list
	  body:func_body
	  def_end
	{return {membership: 'method', access: 'dynamic', name, params, body}}
static_func 'a static method'
	= __s name:prop_name
	  params:param_list
	  body:func_body
	  def_end
	{return {membership: 'method', access: 'static', name, params, body}}

param_list 'a parameter list'
	= white_symbol? '(' __s p:params? __s ')' {return p}

params = p1:param p2:more_params* {return ([p1]).concat(p2||[])}
more_params = __s ',' p:param {return p}
param = __s p:prop_name {return p}


func_body  = __s '{' __s o:operation* __s '}' {return o}

operation  = var_def_op / no_def_op
var_def_op = local_var
no_def_op  = assignment / call_only / iteration / control


local_var  = __s (core_type / class_type) one_local more_local? op_end
one_local  = __s prop_name assign?
more_local = __s ',' __s one_local


assignment
	= __s left:prop_chain right:assign op_end
	{return {op:'assignment',left,right}}
assign
	= __s assign_op __s e:expression
	{return e}


call_only  = __s call op_end
call       = lvalue_prop_chain arg_list

arg_list 'a list of arguments'
	= white_symbol* '(' __s args? __s ')'
args = arg more_args*
more_args = __s ',' arg
arg = __s expression


iteration
	= iter:(iter_expr / iter_local) def_end
	{return iter}
//iter_class = __s list_type param_list func_body
iter_expr
	= __s target:expression __s '[' white_symbol* ']'
	  params:param_list
	  body:func_body
	{return {type: 'iter_kernel', target, params, body}}
//iter_list  = __s '[' __s '.' prop_chain __s ']' param_list func_body
iter_local
	= __s '[' __s target:expression __s ']'
	  params:param_list
	  body:func_body
	{return {type: 'iter_local', target, params, body}}


control = (ctrl_branch / ctrl_loop / return) def_end
ctrl_branch = ctrl_if / ctrl_switch
ctrl_loop = ctrl_for / ctrl_while / ctrl_do

ctrl_if = __s 'if' __s '(' expression ')' (func_body / operation) ctrl_else?
ctrl_else = __s 'else' (func_body / operation)

ctrl_switch = __s 'switch' __s '(' __s expression __s ')' switch_body
switch_body = __s '{' switch_case* switch_default? switch_case* '}'
switch_case = __s 'case' white_symbol+ gpu_value define_op no_def_op* 'break' def_end
switch_default = __s 'default' define_op no_def_op* 'break' def_end

ctrl_for = __s 'for' for_constrain (func_body / operation)
for_constrain = __s '(' loop_var? ';' __s expression __s ';' __s expression __s ')'
loop_var  = __s core_type one_local more_local? def_end

ctrl_while = __s 'while' '(' __s expression __s ')' (func_body / operation)
ctrl_do = __s 'do' (func_body / operation) 'while' '(' __s expression __s ')' 

return = __s 'return' white_symbol* expression def_end


expression = duo_expr / uno_expr
brace_expr = '(' __s e:expression __s ')' {return e}
uno_expr   = uno:uno_op? __s e:(brace_expr / rvalue) {return {uno,e}}
duo_expr   = a:uno_expr __s duo:duo_op __s b:uno_expr {return {a,b,duo}}


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
	= type:core_type white_symbol? p1:prop_name p2:more_subs+
	{return { type, names: ([p1]).concat(p2||[]) }}
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

define_op  = __s ':' __s
default_op = __s '=' __s

external_code = '\`'  (!'\`' .)* '\`'


// ----------- DEBUG ----------- //

func_any  = __s '{' __s o:$(!'}' .)* __s '}' {return o}
