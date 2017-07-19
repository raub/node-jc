// ----> MyClass <---- //

// --- Class MyClass header --- //

// Dynamic-headers


// Uniform-headers
int _uniform___MyClass_x(__global char *_uniform_buffer_);



// --- Class MyClass code ---

int _uniform___MyClass_x(__global char *_uniform_buffer_) {
	return *((__global int*)(&_uniform_buffer_[20]));
}


// --- Class MyClass END ---
