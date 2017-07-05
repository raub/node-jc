#include types.pegjs
#include literals.pegjs
#include operators.pegjs

#include function.pegjs
#include javascript.pegjs


class
	= __ name:class_name
	  parent:extends? white_maybe
	  members:class_body def_end
	{return _class(name,parent,members)}


extends = extends_op name:class_name {return name}


class_body  = class_empty / class_not_empty

class_not_empty
	= __ class_body_start __ m:members+ __ class_body_end
	{return m}

class_empty 'an empty class body'
	= __ class_body_start __ class_body_end
	{return []}

class_body_start 'a { before class body'
	= '{'

class_body_end 'a } after class body'
	= '}'


members
	= properties / methods / external
properties 'a property'
	= dynamic_prop/ dynamic_alias / static_prop / static_alias
methods 'a method'
	= dynamic_func / static_func


dynamic_prop 'a dynamic property'
	= __ '.' name:prop_name
	  define_op type:(struct_type / core_type / ref_type)
	  def_end
	{return _property(name,'dynamic',type)}

static_prop 'a static property'
	= __ name:prop_name
	  define_op type:core_type init:default_val?
	  def_end
	{return _property(name,'static',type)}


dynamic_alias
	= __ '.' name:prop_name define_op '.' target:prop_name def_end
	{return _alias(name,'dynamic',target)}

static_alias
	= __ name:prop_name define_op target:prop_name def_end
	{return _alias(name,'static',target)}


dynamic_func 'a dynamic method'
	= __ '.' name:prop_name
	  params:param_list
	  body:func_body
	  def_end
	{return _method(name,'dynamic',params,body)}
static_func 'a static method'
	= __ name:prop_name
	  params:param_list
	  body:func_body
	  def_end
	{return _method(name,'static',params,body)}


external 'an external property'
	= __ '@' name:prop_name define_op content:js_value def_end
	{return _external(name,content)}


default_val = default_op value:gpu_value {return value}
