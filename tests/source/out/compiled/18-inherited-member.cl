// ----> MyClass1 <---- //

// --- Class MyClass header --- //
void __MyClass_update(size_t _this_i_, __global char *_uniform_buffer_);
void __MyClass_pull(size_t _this_i_, __global char *_uniform_buffer_);
// Uniform helpers
float _uniform___MyClass_stiff(__global char *_uniform_buffer_);
// Attribute helpers





// --- Class MyClass1 header --- //
void __MyClass1_f1(size_t _this_i_, __global char *_uniform_buffer_, float _f1_param_v);
// Uniform helpers
int _uniform___MyClass1_abc(__global char *_uniform_buffer_);
uchar _uniform___MyClass1_def(__global char *_uniform_buffer_);
// Attribute helpers




// Class MyClass1 code

void __MyClass1_f1(size_t _this_i_, __global char *_uniform_buffer_, float _f1_param_v) {
	// Class MyClass injects
	float __MyClass_stiff = _uniform___MyClass_stiff(_uniform_buffer_);



	// Class MyClass1 injects
	int __MyClass1_abc = _uniform___MyClass1_abc(_uniform_buffer_);
	uchar __MyClass1_def = _uniform___MyClass1_def(_uniform_buffer_);


	float _f1_local_s = __MyClass_stiff;
	__MyClass_pull(_this_i_, _uniform_buffer_);
}



int _uniform___MyClass1_abc(__global char *_uniform_buffer_) {
	return *((__global int*)(&_uniform_buffer_[12]));
}

uchar _uniform___MyClass1_def(__global char *_uniform_buffer_) {
	return *((__global uchar*)(&_uniform_buffer_[16]));
}




// ----> MyClass2 <---- //

// --- Class MyClass header --- //
void __MyClass_update(size_t _this_i_, __global char *_uniform_buffer_);
void __MyClass_pull(size_t _this_i_, __global char *_uniform_buffer_);
// Uniform helpers
float _uniform___MyClass_stiff(__global char *_uniform_buffer_);
// Attribute helpers





// --- Class MyClass1 header --- //
void __MyClass1_f1(size_t _this_i_, __global char *_uniform_buffer_, float _f1_param_v);
// Uniform helpers
int _uniform___MyClass1_abc(__global char *_uniform_buffer_);
uchar _uniform___MyClass1_def(__global char *_uniform_buffer_);
// Attribute helpers




// --- Class MyClass2 header --- //
void __MyClass2_f2(size_t _this_i_, __global char *_uniform_buffer_);
// Uniform helpers

// Attribute helpers




// Class MyClass2 code

void __MyClass2_f2(size_t _this_i_, __global char *_uniform_buffer_) {
	// Class MyClass injects
	float __MyClass_stiff = _uniform___MyClass_stiff(_uniform_buffer_);




	// Class MyClass1 injects
	int __MyClass1_abc = _uniform___MyClass1_abc(_uniform_buffer_);
	uchar __MyClass1_def = _uniform___MyClass1_def(_uniform_buffer_);


	// Class MyClass2 injects


	float _f2_local_s = __MyClass_stiff;
	__MyClass_pull(_this_i_, _uniform_buffer_);
	__MyClass1_f1(_this_i_, _uniform_buffer_, _f2_local_s);
}


