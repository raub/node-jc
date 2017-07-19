// ----> MyClass <---- //

// --- Class MyClass header --- //

// Dynamic-headers


// Uniform-headers
float _uniform___MyClass_y(__global char *_uniform_buffer_);



// --- Class MyClass code ---

float _uniform___MyClass_y(__global char *_uniform_buffer_) {
	return *((__global float*)(&_uniform_buffer_[24]));
}


// --- Class MyClass END ---
