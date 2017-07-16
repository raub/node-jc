// ----> MyClass <---- //

// --- Class MyClass header --- //

// Uniform helpers
__global float *_uniform___MyClass_y();
// Attribute helpers
__global float *__global *_attribute___MyClass_x();



// Class MyClass code

__global float *_uniform___MyClass_y() {
	__global static float _uniform_stored___MyClass_y;
	return &_uniform_stored___MyClass_y;
}

__global float *__global *_attribute___MyClass_x() {
	__global static float  *__global _attribute_stored___MyClass_x;
	return &_attribute_stored___MyClass_x;
}
