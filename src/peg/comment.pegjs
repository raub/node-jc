comment       = comment_line / comment_multi
comment_line  = '//' any_line new_line
comment_multi = '/*' (!'*/' .)* '*/'
