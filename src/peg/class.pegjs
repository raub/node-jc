#include types.pegjs
#include literals.pegjs
#include operators.pegjs

#include function.pegjs
#include javascript.pegjs


class
	= __ name:names_class
	  __ parent:class_extends?
	  __ members:class_body
	  class_end
	{return _class(name, parent, members)}

class_extends = 'extends' __ name:names_class {return name}


class_body  = class_empty / class_not_empty

class_not_empty
	= __ class_body_start __ m:class_member+ __ class_body_end
	{return m}

class_empty 'an empty class body'
	= __ class_body_start __ class_body_end
	{return []}

class_body_start 'a { before class body'
	= '{'

class_body_end 'a } after class body'
	= '}'


class_end 'the end of class definition'
	= (___ / ';')* (comment_line / _n_)

class_member_end 'the end of member definition'
	= (___ / ';')* &class_body_end? (comment_line / _n_)


class_member 'class member declaration'
	= class_uniform_js / class_uniform / class_attribute /
	  class_static / class_dynamic /
	  class_alias


class_uniform_js
	= __ type:types_js ___ name:names_property init:class_init_js? class_member_end
	{return _uniform(type, name, init)}

class_uniform
	= __ type:types_gpu ___ name:names_property init:class_init_gpu? class_member_end
	{return _uniform(type, name, init)}

class_attribute
	= __ type:types_gpu ___ '.' name:names_property init:class_init_gpu? class_member_end
	{return _attribute(type, name, init)}





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
	{return _dynamic(returns, name, params, body)}

static_func 'a static method'
	= __ name:prop_name
	  params:param_list
	  body:func_body_static
	  def_end
	{return _static(name,'static',params,body)}


default_val = default_op value:gpu_value {return value}
default_val_js = default_op value:js_value {return value}


class_init_gpu = default_op value:gpu_value {return value}
class_init_js  = default_op value:js_value  {return value}
