
prop_chain
	= a:chain_item b:chain_next*
	{return {type: 'rvalue', access: 'static', chain: enlist(a, b)}}

chain_next
	= _0_ '.' item:chain_item
	{return item}

chain_item = chain_call / chain_index / chain_access

chain_access
	= name:base_name
	{return {name, type: 'access'}}

chain_call
	= name:names_any args:function_args_dynamic_list
	{return {type: 'call', name, args}}

chain_index
	= name:base_name index:indexation
	{return {type: 'index', name, index}}

indexation
	= __ '[' __ r:'%'? __ i:expression __ ']'
	{return {round:r!==null,i}}
