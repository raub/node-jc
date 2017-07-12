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


members 'class member declaration'
	= property_js / properties / methods / aliases


property_js 'a property definition'
	= __ type:js_type ___+ name:prop_name init:default_val_js? def_end
	{return _property(name, 'static', type, init)}

properties 'a property definition'
	= __ type:prop_type ___+ dyn:'.'? name:prop_name init:default_val? def_end
	{return _property(name, dyn && 'dynamic' || 'static', type, init)}


aliases 'an alias difinition'
	= __ dyn:'.'? name:prop_name default_op '.' target:prop_name def_end
	{return _alias(name, dyn && 'dynamic' || 'static', target)}


methods 'a method definition'
	= dynamic_func / static_func

dynamic_func 'a dynamic method'
	= __ type:prop_type ___+ '.' name:prop_name
	  params:param_list_dynamic
	  body:func_body
	  def_end
	{return _method(name,'dynamic',params,body)}

static_func 'a static method'
	= __ name:prop_name
	  params:param_list
	  body:func_body_static
	  def_end
	{return _method(name,'static',params,body)}


default_val = default_op value:gpu_value {return value}
default_val_js = default_op value:js_value {return value}
