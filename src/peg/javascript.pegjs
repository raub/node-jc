// Just skip anything within matching braces/quotes

js_any = js_round / js_curly / js_curly / js_double / js_single / js_biased / js_normal
js_round  = '('  (!')'  js_any)* ')'
js_square = '['  (!']'  js_any)* ']'
js_curly  = '{'  (!'}'  js_any)* '}'
js_double = '"'  (!'"'  js_any)* '"'
js_single = '\'' (!'\'' js_any)* '\''
js_biased = '`'  (!'`'  js_any)* '`'
js_normal = .

js_end = class_member_end (class_body_end / class_member)
