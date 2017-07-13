// Whitespace rules

__ 'comment or whitespace'
	= ___sure?
___sure = (comment / white_sure)+

___ = white_symbol+

white_maybe  = white_sure?
white_sure   = white_all+
white_all 'any whitespace'
	= new_line / white_symbol
white_symbol 'a space'
	= [\t\v\f \u00A0\uFEFF]
new_line 'a new line'
	= '\r'? '\n'
any_line
	= (!new_line .)*


_n_ = new_line
_l_ = any_line
_s_ = white_symbol+
