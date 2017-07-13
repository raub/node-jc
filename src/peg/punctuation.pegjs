
def_end 'the end of definition'
	= (white_symbol / ';')* &'}'? (comment_line / new_line)

op_end 'the end of operation'
	= __ ';'


