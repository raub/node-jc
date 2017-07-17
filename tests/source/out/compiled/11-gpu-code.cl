// ----> MyClass <---- //

// --- Class MyClass header --- //
void __MyClass_update(size_t _this_i_, __global char *_uniform_buffer_);
void __MyClass_pull(size_t _this_i_, __global char *_uniform_buffer_);
// Uniform helpers
float _uniform___MyClass_stiff(__global char *_uniform_buffer_);
// Attribute helpers





// Class MyClass code

void __MyClass_update(size_t _this_i_, __global char *_uniform_buffer_) {
	// Class MyClass injects
	float __MyClass_stiff = _uniform___MyClass_stiff(_uniform_buffer_);



	
}

void __MyClass_pull(size_t _this_i_, __global char *_uniform_buffer_) {
	// Class MyClass injects
	float __MyClass_stiff = _uniform___MyClass_stiff(_uniform_buffer_);



	__MyClass_update(_this_i_, _uniform_buffer_);
	float _pull_local_x = 1;
}



float _uniform___MyClass_stiff(__global char *_uniform_buffer_) {
	return *((__global float*)(&_uniform_buffer_[0]));
}




