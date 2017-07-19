// ----> MyClass1 <---- //

// --- Class MyClass header --- //

// Dynamic-headers
void __MyClass_update(size_t _this_i_, __global char *_uniform_buffer_, NOT_READY);
void __MyClass_pull(size_t _this_i_, __global char *_uniform_buffer_, NOT_READY);

// Uniform-headers
float _uniform___MyClass_stiff(__global char *_uniform_buffer_);



// --- Class MyClass1 header --- //

// Dynamic-headers
void __MyClass1_f1(size_t _this_i_, __global char *_uniform_buffer_, NOT_READY, float _f1_param_v);

// Uniform-headers
int _uniform___MyClass1_abc(__global char *_uniform_buffer_);
uchar _uniform___MyClass1_def(__global char *_uniform_buffer_);



// --- Class MyClass1 code ---

void __MyClass1_f1(size_t _this_i_, __global char *_uniform_buffer_, NOT_READY, float _f1_param_v) {
	// Class MyClass uniforms
	float __MyClass_stiff = _uniform___MyClass_stiff(_uniform_buffer_);
	
	// Class MyClass1 uniforms
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


// --- Class MyClass1 END ---


// ----> MyClass2 <---- //

// --- Class MyClass header --- //

// Dynamic-headers
void __MyClass_update(size_t _this_i_, __global char *_uniform_buffer_, NOT_READY);
void __MyClass_pull(size_t _this_i_, __global char *_uniform_buffer_, NOT_READY);

// Uniform-headers
float _uniform___MyClass_stiff(__global char *_uniform_buffer_);



// --- Class MyClass1 header --- //

// Dynamic-headers
void __MyClass1_f1(size_t _this_i_, __global char *_uniform_buffer_, NOT_READY, float _f1_param_v);

// Uniform-headers
int _uniform___MyClass1_abc(__global char *_uniform_buffer_);
uchar _uniform___MyClass1_def(__global char *_uniform_buffer_);



// --- Class MyClass2 header --- //

// Dynamic-headers
void __MyClass2_f2(size_t _this_i_, __global char *_uniform_buffer_, NOT_READY);

// Uniform-headers




// --- Class MyClass2 code ---

void __MyClass2_f2(size_t _this_i_, __global char *_uniform_buffer_, NOT_READY) {
	// Class MyClass uniforms
	float __MyClass_stiff = _uniform___MyClass_stiff(_uniform_buffer_);
	

	// Class MyClass1 uniforms
	int __MyClass1_abc = _uniform___MyClass1_abc(_uniform_buffer_);
	uchar __MyClass1_def = _uniform___MyClass1_def(_uniform_buffer_);
	
	// Class MyClass2 uniforms
	
	float _f2_local_s = __MyClass_stiff;
	__MyClass_pull(_this_i_, _uniform_buffer_);
	__MyClass1_f1(_this_i_, _uniform_buffer_, _f2_local_s);
}


// --- Class MyClass2 END ---
