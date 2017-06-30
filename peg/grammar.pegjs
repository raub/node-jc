jc
	= imps:imports? cls:classes .*
	  {return { imports: imps || [], classes: cls }}

imports
	= imports:import+

import
	= skip 'import' white_sure classes:class_names white_sure 'from'
	  white_sure path:module_path new_line 
	  {return {classes,path}}

classes
	= classes:class+

class
	= skip name:class_name
	  parent:extends? white_maybe
	  members:class_body def_end
	  {return {name,parent,members}}


skip      = skip_sure?
skip_sure = (comment / white_sure)+


white_maybe  = white_sure?
white_sure   = white_all+
white_all    = new_line / white_symbol
white_symbol = [\t\v\f \u00A0\uFEFF]
new_line     = '\r'? '\n'
any_line     = (!new_line .)*
def_end      = (white_symbol / ';')* (comment_line / new_line)


comment      = comment_line / comment_multi
comment_line  = '//' any_line new_line
comment_multi = '/*' (!'*/' .)* '*/'


class_names  = c1:class_name c2:more_classes* {return (c2||[]).concat([c1])}
more_classes = white_maybe ',' white_maybe name:class_name {return name}
class_name   = $([A-Z] base_name?)
prop_name    = $([a-z] base_name?)
dir_name     = $((base_name / [\.\- _\(\)])+)
base_name    = $([A-Za-z0-9_]+)


module_path = $(dir_dots? dir_path jc_ext?)
dir_dots    = '.' '.'? '/'
dir_path    = $(dir_name sub_dir*)
sub_dir     = $('/' dir_name)
jc_ext      = '.jc'

extends    = white_sure 'extends' white_sure name:class_name {return name}

class_body  = '{' skip m:members* skip '}' {return m}
members 'a class member'
	= properties // / methods / external
properties 'a property'
	= dynamic_prop / static_prop
// methods 'a method'
// = dynamic_func / static_func

external 'an external property'
	= skip '@' name:prop_name define_op external_code def_end

dynamic_prop 'a dynamic property'
	= skip '.' name:prop_name  define_op type:(struct_type / core_type / ref_type) def_end
	  {return {membership: 'property', access: 'dynamic', type, name}}
static_prop 'a static property'
	= skip name:prop_name  define_op type:core_type init:default_val? def_end
	  {return {membership: 'property', access: 'static', type, init, name}}

// dynamic_func  = skip '.' name:prop_name define_op (core_type / struct_type) def_end
// static_func   = skip name:prop_name define_op (core_type / struct_type) def_end

core_type   = core_char / core_int / core_float
core_char   = 'char'
core_int    = 'int2' / 'int3' / 'int4' / 'int'
core_float  = 'float2' / 'float3' / 'float4' / 'float' 

struct_type = t1:sub_type t2:more_types* {return (t2||[]).concat([t1])}
more_types  = white_maybe ',' white_maybe sub:sub_type {return sub}
sub_type    = type:core_type white_sure name:prop_name {return {type,name}}

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

define_op  = skip ':' skip
default_op = skip '=' skip

external_code = '\`'  (!'\`' .)* '\`'
