// ----> MyClass1 <---- //

// --- Class MyClass header --- //
void __MyClass_update();
void __MyClass_pull();
// Uniform helpers
__global float *_uniform___MyClass_stiff();
// Attribute helpers
__global float *__global *_attribute___MyClass_dist();
__global float3 *__global *_attribute___MyClass_pos();



// --- Class MyClass1 header --- //
void __MyClass1_f1();
// Uniform helpers

// Attribute helpers
__global float *__global *_attribute___MyClass1_dd();



// Class MyClass1 code

void __MyClass1_f1() {
	// Class MyClass injects
	float __MyClass_stiff = *_uniform___MyClass_stiff();
	__global float *__MyClass_dist = *_attribute___MyClass_dist();
	__global float3 *__MyClass_pos = *_attribute___MyClass_pos();

	// Class MyClass1 injects
	__global float *__MyClass1_dd = *_attribute___MyClass1_dd();

	float _f1_local_s = __MyClass_stiff;
	__MyClass_dist = 2;
	__MyClass_pull();
}

__global float *__global *_attribute___MyClass1_dd() {
	__global static float  *__global _attribute_stored___MyClass1_dd;
	return &_attribute_stored___MyClass1_dd;
}


// ----> MyClass2 <---- //

// --- Class MyClass header --- //
void __MyClass_update();
void __MyClass_pull();
// Uniform helpers
__global float *_uniform___MyClass_stiff();
// Attribute helpers
__global float *__global *_attribute___MyClass_dist();
__global float3 *__global *_attribute___MyClass_pos();



// --- Class MyClass1 header --- //
void __MyClass1_f1();
// Uniform helpers

// Attribute helpers
__global float *__global *_attribute___MyClass1_dd();



// --- Class MyClass2 header --- //
void __MyClass2_f2();
// Uniform helpers

// Attribute helpers
__global float3 *__global *_attribute___MyClass2_xyz();



// Class MyClass2 code

void __MyClass2_f2() {
	// Class MyClass injects
	float __MyClass_stiff = *_uniform___MyClass_stiff();
	__global float *__MyClass_dist = *_attribute___MyClass_dist();
	__global float3 *__MyClass_pos = *_attribute___MyClass_pos();


	// Class MyClass1 injects
	__global float *__MyClass1_dd = *_attribute___MyClass1_dd();

	// Class MyClass2 injects
	__global float3 *__MyClass2_xyz = *_attribute___MyClass2_xyz();

	float _f2_local_s = __MyClass_stiff;
	__MyClass_pull();
	__MyClass1_f1();
	__MyClass_pos = 1;
}

__global float3 *__global *_attribute___MyClass2_xyz() {
	__global static float3  *__global _attribute_stored___MyClass2_xyz;
	return &_attribute_stored___MyClass2_xyz;
}
