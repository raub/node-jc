// All operators and their specializations

uno_op
	= '++' / '--' / '%' / '~' / '&' / '*' / '+' / '-' / '!' / 'new'

duo_op
	= '/' / '^' / '|' / '<<' / '>>' / '||' / '&&' / '%' / '~' / '&' / '*' / '+' / '-'

assign_op
	= atomic_op / '=' / '<<' / '+=' / '-=' / '*=' / '/=' / '&=' / '|=' / '^=' / '%='

atomic_op
	= '+==' / '-==' / '*==' / '/=='

all_op
	= uno_op / duo_op / assign_op


define_op  = __ ':' __

default_op = __ '=' __

extends_op = white_sure 'extends' white_sure
