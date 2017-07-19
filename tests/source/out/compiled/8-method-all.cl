// ----> MyClass <---- //

// --- Class MyClass header --- //
float __MyClass_f(size_t _this_i_, __global char *_uniform_buffer_, int _f_param_x, char _f_param_z);
// Uniform helpers
uint _uniform___MyClass_stf(__global char *_uniform_buffer_);
// Attribute helpers




// Class MyClass code

float __MyClass_f(size_t _this_i_, __global char *_uniform_buffer_, int _f_param_x, char _f_param_z) {
	// Class MyClass injects
	uint __MyClass_stf = _uniform___MyClass_stf(_uniform_buffer_);

	// return
}

uint _uniform___MyClass_stf(__global char *_uniform_buffer_) {
	return *((__global uint*)(&_uniform_buffer_[28]));
}
