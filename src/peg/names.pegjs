
class_names  = a:class_name b:more_classes* {return enlist(a, b)}
more_classes = white_maybe ',' white_maybe name:class_name {return name}
class_name   = $([A-Z] base_name?)
prop_name    = $([a-z] base_name?)
dir_name     = $( (base_name ':')? (base_name / [\.\- _\(\)])+)
base_name    = $([A-Za-z0-9_]+)

