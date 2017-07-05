// Whitespace rules

__ 'comment or whitespace'
	= ___sure?
___sure = (comment / white_sure)+


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

comment       = comment_line / comment_multi
comment_line  = '//' any_line new_line
comment_multi = '/*' (!'*/' .)* '*/'

