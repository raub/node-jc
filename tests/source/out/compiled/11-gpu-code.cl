// ----> MyClass <---- //

// Class MyClass header

void _MyClass_dynamic_update();
void _MyClass_dynamic_pull();



// Class MyClass code

void _MyClass_dynamic_update() {

}

void _MyClass_dynamic_pull() {
update();
float _pull_local_dist = distance(_MyClass_dynamic_pos, _MyClass_dynamic_pos);
float _pull_local_force = _MyClass_static_stiff * _MyClass_dynamic_dist - _pull_local_dist;
float3 _pull_local_mid = _MyClass_dynamic_pos + _MyClass_dynamic_pos * 0.5;
float3 _pull_local_toA = normalize(_MyClass_dynamic_pos - _pull_local_mid);
float3 _pull_local_toB = normalize(_MyClass_dynamic_pos - _pull_local_mid);
}
