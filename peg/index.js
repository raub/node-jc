'use strict';

const peg = require('pegjs');
const fs = require('fs');
const parser = peg.generate(fs.readFileSync(__dirname + '/grammar.pegjs').toString());

console.log('START');
try{
const parsed1 = parser.parse(`

// import Render from render;

// {
// 	Node {
// 		(){
// 			comsic_speed 
			
// 		}
// 	}
// 	Link {
		
// 	}
// }



// Cosmic {
// 	float: cosmic_speed = 0.01;
	
// 	Body: use()
	
// 	Mind {
// 		Node {
			
// 		}
// 		Link {
			
// 		}
// 	}
// }

Vertex {
	
	
	// Static prop, friction coef, initial 1.0
	// @frict  : function () {}
	frict2 : int
	frict3 : float // = 0.9999
	frict4 : float = 0.9999 ; // hi
	
	.pos : float3
	.rgb : float r, g, b
	.vel : float3
	
	
	// // Constructor, uses init-params
	// .constructor(pos, rgb, vel) {
	// 	.pos = pos
	// 	.rgb = rgb
	// 	.vel = vel
	// }
	
	
	// // Move: simply apply velocity and friction
	// .move() {
	// 	.pos += .vel
	// 	.vel *= frict
	// }
	
}

`);
console.log('parsed1', JSON.stringify(parsed1, null, '\t'));
} catch (e) {
	console.log('eeee', e);
}


try{
const parsed2 = parser.parse(`
import Vertex from vertex


Edge {
	
	// Static prop, thickness coef, initial 1.0
	stiff : float = 1
	
	// Two vertices, joined by this edge
	.a : Vertex
	.b : Vertex
	
	// Preferred distance between vertices, default 2.0
	.dist : float
	
	// known positions of vertices, use to draw lines
	.pos : float3 a, b
	
	
	// // Constructor, uses init-params
	// .constructor(a, b, dist) {
	// 	.a = a
	// 	.b = b
	// 	.c = c
	// 	.update()
	// }
	
	
	// .update() {
	// 	.pos.a = .a.pos
	// 	.pos.b = .b.pos
	// }
	
	
	// // Accelerate vertices to desired positions
	// .pull() {
		
	// 	// TODO: iterate vertices?
		
	// 	.update();
		
	// 	// Calculate acceleration for vertices
	// 	float dist  = distance(.pos.a, .pos.b);
	// 	float force = .stiff * (.dist - dist);
		
	// 	float3 mid  = (.pos.a +.pos.b) * 0.5;
		
	// 	float3 toA  = normalize(.pos.a - mid);
	// 	float3 toB  = normalize(.pos.b - mid);
		
	// 	// Atomic add acceleration
	// 	.a.vel +== toA * force;
	// 	.b.vel +== toB * force;
		
	// }
	
}

`);
console.log('parsed2', JSON.stringify(parsed2, null, '\t'));
} catch (e) {
	console.log('eeee2', e);
}

// const parsed3 = parser.parse(`
// import Vertex from vertex
// import Edge   from edge


// Graph {
	
// 	// // Graph is a collection of vertices and edges
// 	// .vertices : Vertex[]
// 	// .edges    : Edge[]
	
	
// 	// // It moves as they go
// 	// simulate() {
// 	// 	Vertex[] { .move() }
// 	// 	Edge[]   { .pull() }
// 	// }
	
// }

// `);
// console.log('parsed3', JSON.stringify(parsed3, null, '\t'));
