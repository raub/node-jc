
class_names  = a:class_name b:more_classes* {return enlist(a, b)}
more_classes = white_maybe ',' white_maybe name:class_name {return name}
class_name   = $([A-Z] base_name?)
prop_name    = $([a-z] base_name?)
dir_name     = $( (base_name ':')? (base_name / [\.\- _\(\)])+)
base_name    = $([A-Za-z0-9_]+)


names_any      = $([A-Za-z0-9_]+)
names_lower    = $([a-z] names_any?)
names_upper    = $([A-Z] names_any?)

names_class    = names_upper
names_property = names_lower
names_param    = names_lower
