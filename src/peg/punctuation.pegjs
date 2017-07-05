
def_end 'the end of definition'
	= (white_symbol / ';')* &'}'? (comment_line / new_line)

op_end 'the end of operation'
	= __ ';'

js_end = def_end (class_body_end / members)
