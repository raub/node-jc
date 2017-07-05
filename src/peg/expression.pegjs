
expression = duo_expr / uno_expr
brace_expr = '(' __ e:expression __ ')' {return e}
uno_expr   = uno:uno_op? __ e:(brace_expr / rvalue) {return {uno,e}}
duo_expr   = a:uno_expr __ duo:duo_op __ b:expression {return {a,b,duo}}

rvalue     = gpu_value / prop_chain
