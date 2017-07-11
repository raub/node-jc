
expression = duo_expr / uno_expr
brace_expr = '(' __ e:expression __ ')' {return e}
uno_expr   = uno:uno_op? __ a:(brace_expr / rvalue) {return {type:'uno',uno,a}}
duo_expr   = a:uno_expr __ duo:duo_op __ b:expression {return {type:'duo',a,b,duo}}

rvalue     = a:(gpu_value / prop_chain) {return {type:'rvalue',a}}
