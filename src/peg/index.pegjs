{
	#include utils.js
}

jc
	= imps:import* cls:class+ __
	{return _jc(imps, cls)}

#include import.pegjs
#include class.pegjs

#include whitespace.pegjs
#include punctuation.pegjs
#include names.pegjs

#include debug.pegjs
