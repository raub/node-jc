// ----> MyClass <---- //

// --- Class MyClass header --- //

// Uniform helpers
__global float *_uniform___MyClass_x();
// Attribute helpers




// Class MyClass code

__global float *_uniform___MyClass_x() {
	__global static float _uniform_stored___MyClass_x;
	return &_uniform_stored___MyClass_x;
}
