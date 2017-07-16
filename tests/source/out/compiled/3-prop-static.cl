// ----> MyClass <---- //

// --- Class MyClass header --- //

// Uniform helpers
__global int *_uniform___MyClass_x();
// Attribute helpers




// Class MyClass code

__global int *_uniform___MyClass_x() {
	__global static int _uniform_stored___MyClass_x;
	return &_uniform_stored___MyClass_x;
}
