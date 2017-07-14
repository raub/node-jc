#include types.pegjs
#include literals.pegjs
#include operators.pegjs

#include function.pegjs
#include javascript.pegjs

// <Class2> ['extends' <Class1>] <'{' ... '}'>
class
	= _0_ name:names_class
	  _s_ parent:class_extends?
	  _0_ members:class_body
	      class_end
	{return _class(name, parent, members)}

// ... 'extends' <Class1>
class_extends
	= 'extends'
	  _s_ name:names_class
	{return name}

// <'{' '}'> / <'{' ... '}'>
class_body  = class_empty / class_not_empty

// <'{' ... '}'>
class_not_empty
	= _0_ class_body_start
	  _0_ m:class_member+
	  _0_ class_body_end
	{return m}

// <'{' '}'>
class_empty 'an empty class body'
	= _0_ class_body_start
	  _0_ class_body_end
	{return []}

class_body_start 'a { before class body'
	= '{'

class_body_end 'a } after class body'
	= '}'


class_end 'the end of class definition'
	= (_s_ / ';')* (comment_line / _n_)

class_member_end 'the end of member definition'
	= (_s_ / ';')* &class_body_end? (comment_line / _n_)


class_member 'a member declaration'
	= class_uniform_js /
	  class_uniform / class_attribute /
	  class_static / class_dynamic /
	  class_alias


class_uniform_js
	= _0_ type:types_js
	  _s_ name:names_property
	      init:class_init_js?
	      class_member_end
	{return _uniform(type, name, init)}

class_uniform
	= _0_ type:types_gpu
	  _s_ name:names_property
	      init:class_init_gpu?
	      class_member_end
	{return _uniform(type, name, /*init*/)}

class_attribute
	= _0_ type:types_gpu
	  _s_ '.' name:names_property
	      init:class_init_gpu?
	      class_member_end
	{return _uniform(type, name, init)}

class_static
	= _0_ name:names_property
	  _0_ params:function_params_static_list
	  _0_ body:function_body_static
	  class_member_end
	{return _static(name, params, body)}

class_dynamic
	= _0_ type:types_gpu
	  _s_ '.' name:names_property
	  _0_ params:function_params_dynamic_list
	  _0_ body:function_body_dynamic
	  class_member_end
	{return _dynamic(type, name, params, body)}

class_alias
	= _0_ name:names_property
	  _0_ class_init_operator
	  _0_ target:names_property
	  class_member_end
	{return _alias(name, target)}

class_init_operator = '='

class_init_gpu
	= _0_ class_init_operator
	  _0_ value:literals_gpu
	{return value}

class_init_js
	= _0_ class_init_operator
	  _0_ value:literals_js
	{return value}
