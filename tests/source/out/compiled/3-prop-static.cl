// ----> MyClass <---- //

// --- Class MyClass header --- //

// Uniform helpers
int _uniform___MyClass_x(__global char *_uniform_buffer_);
// Attribute helpers




// Class MyClass code

int _uniform___MyClass_x(__global char *_uniform_buffer_) {
	return *((__global int*)(&_uniform_buffer_[17]));
}
