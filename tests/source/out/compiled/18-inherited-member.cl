// ----> MyClass1 <---- //

// Class MyClass header
void __MyClass_update();
void __MyClass_pull();



// Class MyClass1 header
void __MyClass1_f1();



// Class MyClass1 code

void __MyClass1_f1() {
	float _f1_local_s = __MyClass_stiff;
	__MyClass_dist = 2;
	__MyClass_pull();
}


// ----> MyClass2 <---- //

// Class MyClass header
void __MyClass_update();
void __MyClass_pull();



// Class MyClass1 header
void __MyClass1_f1();



// Class MyClass2 header
void __MyClass2_f2();



// Class MyClass2 code

void __MyClass2_f2() {
	float _f2_local_s = __MyClass_stiff;
	__MyClass_pull();
	__MyClass1_f1();
	__MyClass_pos = 1;
}
