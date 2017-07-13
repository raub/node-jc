{
	#include utils.js
}

jc
	= imps:import* cls:class+ __
	{return _jc(imps, cls)}

#include names.pegjs

#include import.pegjs
#include class.pegjs

#include __.pegjs
#include comment.pegjs
#include punctuation.pegjs

#include debug.pegjs
