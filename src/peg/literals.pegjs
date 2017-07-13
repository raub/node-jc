// Literal rules

gpu_value   = char_value / num_value
char_value  = $("'" (!"'" .)* "'")
num_value   = float_value / int_value
int_value   = $([0-9]+)
float_value = $(int_value ('.' int_value)?)

js_value = $( (!js_end js_any)+ )


literals_js  = js_value
literals_gpu = gpu_value
