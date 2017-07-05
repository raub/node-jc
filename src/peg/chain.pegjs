
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

chain_item = chain_call / chain_index / chain_access

chain_access
	= name:base_name
	{return {name, type: 'access'}}

chain_call
	= name:base_name args:arg_list
	{return {name, type: 'call', args}}

chain_index
	= name:base_name index:indexation
	{return {name, type: 'index', index}}

indexation
	= __ '[' __ r:'%'? i:expression __ ']'
	{return {round:r!==null,i}}
