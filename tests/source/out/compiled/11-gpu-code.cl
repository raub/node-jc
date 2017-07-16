// ----> MyClass <---- //

// --- Class MyClass header --- //
void __MyClass_update();
void __MyClass_pull();
// Uniform helpers
__global float *_uniform___MyClass_stiff();
// Attribute helpers
__global float *__global *_attribute___MyClass_dist();
__global float3 *__global *_attribute___MyClass_pos();



// Class MyClass code

void __MyClass_update() {
	// Class MyClass injects
	float __MyClass_stiff = *_uniform___MyClass_stiff();
	__global float *__MyClass_dist = *_attribute___MyClass_dist();
	__global float3 *__MyClass_pos = *_attribute___MyClass_pos();

	
}

void __MyClass_pull() {
	// Class MyClass injects
	float __MyClass_stiff = *_uniform___MyClass_stiff();
	__global float *__MyClass_dist = *_attribute___MyClass_dist();
	__global float3 *__MyClass_pos = *_attribute___MyClass_pos();

	__MyClass_update();
	float _pull_local_x = 1;
}



__global float *_uniform___MyClass_stiff() {
	__global static float _uniform_stored___MyClass_stiff;
	return &_uniform_stored___MyClass_stiff;
}

__global float *__global *_attribute___MyClass_dist() {
	__global static float  *__global _attribute_stored___MyClass_dist;
	return &_attribute_stored___MyClass_dist;
}

__global float3 *__global *_attribute___MyClass_pos() {
	__global static float3  *__global _attribute_stored___MyClass_pos;
	return &_attribute_stored___MyClass_pos;
}
