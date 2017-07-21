// ----> MyClass <---- //

// --- Class MyClass header --- //

// Dynamic-headers
void __MyClass_update(size_t _this_i_, __global char *_uniform_buffer_, global float *__MyClass_dist, global float3 *__MyClass_pos);
void __MyClass_pull(size_t _this_i_, __global char *_uniform_buffer_, global float *__MyClass_dist, global float3 *__MyClass_pos);

// Uniform-headers
float _uniform___MyClass_stiff(__global char *_uniform_buffer_);



// --- Class MyClass code ---

void __MyClass_update(size_t _this_i_, __global char *_uniform_buffer_, global float *__MyClass_dist, global float3 *__MyClass_pos) {
	// Class MyClass uniforms
	float __MyClass_stiff = _uniform___MyClass_stiff(_uniform_buffer_);
	
	
}

void __MyClass_pull(size_t _this_i_, __global char *_uniform_buffer_, global float *__MyClass_dist, global float3 *__MyClass_pos) {
	// Class MyClass uniforms
	float __MyClass_stiff = _uniform___MyClass_stiff(_uniform_buffer_);
	
	__MyClass_update(_this_i_, _uniform_buffer_, , /*ARGS: MyClass */ __MyClass_dist, __MyClass_pos /* END ARGS */ );
	float _pull_local__dist = distance( /* NO_ARGS: MyClass */ __MyClass_pos.c0f4, __MyClass_pos.c0f4);
}



float _uniform___MyClass_stiff(__global char *_uniform_buffer_) {
	return *((__global float*)(&_uniform_buffer_[0]));
}


// --- Class MyClass END ---
