// ----> MyClass <---- //

// --- Class MyClass header --- //

// Dynamic-headers


// Uniform-headers
float _uniform___MyClass_x(__global char *_uniform_buffer_);



// --- Class MyClass code ---

float _uniform___MyClass_x(__global char *_uniform_buffer_) {
	return *((__global float*)(&_uniform_buffer_[4]));
}


// --- Class MyClass END ---
