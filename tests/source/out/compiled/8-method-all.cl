// ----> MyClass <---- //

// --- Class MyClass header --- //

// Dynamic-headers
float __MyClass_f(size_t _this_i_, __global char *_uniform_buffer_, int _f_param_x, char _f_param_z);

// Uniform-headers
uint _uniform___MyClass_stf(__global char *_uniform_buffer_);



// --- Class MyClass code ---

float __MyClass_f(size_t _this_i_, __global char *_uniform_buffer_, int _f_param_x, char _f_param_z) {
	// Class MyClass uniforms
	uint __MyClass_stf = _uniform___MyClass_stf(_uniform_buffer_);
	
	// TODO: return
}

uint _uniform___MyClass_stf(__global char *_uniform_buffer_) {
	return *((__global uint*)(&_uniform_buffer_[28]));
}


// --- Class MyClass END ---
