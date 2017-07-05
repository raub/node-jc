// Debug rules, skip stuff and return as is. Possible buggy

func_any  = __ '{' __ o:$(!'}' .)* __ '}' {return o}
