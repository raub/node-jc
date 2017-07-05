

import
	= __ 'import' white_sure classes:class_names white_sure 'from'
	  white_sure path:module_path new_line
	{return _import(classes, path)}


module_path = $(dir_dots? dir_path jc_ext?)
dir_dots    = '.' '.'? '/'
dir_path    = $(dir_name sub_dir*)
sub_dir     = $('/' dir_name)
jc_ext      = '.jc'

