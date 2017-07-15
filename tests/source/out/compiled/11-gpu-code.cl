// ----> MyClass <---- //

// Class MyClass header
void __MyClass_update();
void __MyClass_pull();



// Class MyClass code

void __MyClass_update() {
	
}

void __MyClass_pull() {
	__MyClass_update();
	float _pull_local__dist = distance(__MyClass_pos, __MyClass_pos);
	float _pull_local_force = __MyClass_stiff * __MyClass_dist - _pull_local__dist;
	float3 _pull_local_mid = __MyClass_pos + __MyClass_pos * 0.5;
	float3 _pull_local_toA = normalize(__MyClass_pos - _pull_local_mid);
	float3 _pull_local_toB = normalize(__MyClass_pos - _pull_local_mid);
	atomic_add(&__MyClass_pos, _pull_local_toA * _pull_local_force);
	atomic_add(&__MyClass_pos, _pull_local_toB * _pull_local_force);
}


