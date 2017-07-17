// ----> MyClass <---- //

// --- Class MyClass header --- //

// Uniform helpers
float _uniform___MyClass_y(__global char *_uniform_buffer_);
// Attribute helpers




// Class MyClass code

float _uniform___MyClass_y(__global char *_uniform_buffer_) {
	return *((__global float*)(&_uniform_buffer_[21]));
}


